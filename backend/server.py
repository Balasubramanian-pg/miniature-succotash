import os
import re
import json
import time
import random
from pathlib import Path
from typing import Dict, Any, Optional

import duckdb
import pandas as pd
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from parser import (
    QUESTIONS_DIR,
    PATTERNS_DIR,
    parse_question_file,
    get_all_questions,
    get_all_patterns
)
from enricher import enrich_question_metadata

app = FastAPI(title="RAILS DE Engine API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PROGRESS_FILE = Path(__file__).parent / "rails_progress.json"
PROFILE_FILE = Path(__file__).parent / "rails_profile.json"
REPO_FILE = Path(__file__).parent / "rails_repository.json"

CLANKER_ROASTS = [
    "Clanker says: Have you considered using 14 nested subqueries? Deep nesting establishes dominance over the query optimizer.",
    "Clanker says: Window functions are a conspiracy invented by Big SQL. Just CROSS JOIN the table with itself 6 times.",
    "Clanker says: My 2-billion parameters indicate that renaming every column to 'temp' guarantees linear time complexity.",
    "Clanker says: PySpark optimization tip: df.toPandas() on a 10TB dataset. RAM is virtually free in 2026.",
    "Clanker says: If you can't figure out the JOIN condition, try ON 1=1. That way no rows get left behind.",
    "Clanker says: Why use GROUP BY when you can just count the rows with your index finger against your monitor?",
    "Clanker says: Just replace the entire query with SELECT * FROM everything WHERE magic = TRUE.",
    "Clanker says: Real data engineers don't write SQL. They physically arrange hard drive platters with refrigerator magnets.",
    "Clanker says: If the query is running too slow, delete half the database. Instant 2x speedup.",
    "Clanker says: For Q1 revenue, simply assume everyone paid in exposure. Conversion rate: 100%."
]

def load_profile() -> Dict[str, Any]:
    if PROFILE_FILE.exists():
        try:
            return json.loads(PROFILE_FILE.read_text(encoding="utf-8"))
        except Exception:
            pass
    return {
        "name": "Nadia Rahman",
        "role": "Staff Data Engineer",
        "target_company": "Meta / Databricks",
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&dpr=2&q=80",
        "github_username": "nadiarahman",
        "target_level": "L5 Staff",
        "joined_date": "November 2026"
    }

def save_profile(data: Dict[str, Any]):
    PROFILE_FILE.write_text(json.dumps(data, indent=2), encoding="utf-8")

def load_repository_config() -> Dict[str, Any]:
    if REPO_FILE.exists():
        try:
            return json.loads(REPO_FILE.read_text(encoding="utf-8"))
        except Exception:
            pass
    return {
        "id": "default-stratascratch",
        "name": "StrataScratch Standard (136 FAANG Questions)",
        "url": "https://github.com/stratascratch/sql-interview-questions",
        "branch": "main",
        "status": "connected",
        "last_synced": time.strftime("%Y-%m-%d %H:%M"),
        "total_questions": 136,
        "is_custom": False
    }

def save_repository_config(data: Dict[str, Any]):
    REPO_FILE.write_text(json.dumps(data, indent=2), encoding="utf-8")

def load_progress() -> Dict[str, Any]:
    if PROGRESS_FILE.exists():
        try:
            return json.loads(PROGRESS_FILE.read_text(encoding="utf-8"))
        except Exception:
            pass
    return {
        "current_tier": "L0",
        "current_tier_name": "Unemployed (Mom's Tier)",
        "xp": 0,
        "solved_count": 0,
        "streak_days": 1,
        "last_active": time.strftime("%Y-%m-%d"),
        "questions": {},
        "mistake_log": []
    }

def save_progress(data: Dict[str, Any]):
    PROGRESS_FILE.write_text(json.dumps(data, indent=2), encoding="utf-8")

def calculate_tier(completed_stats: Dict[str, Any]) -> tuple[str, str]:
    easy_a = sum(1 for q in completed_stats.values() if q.get("difficulty") == "easy" and q.get("grade") in ["A", "B"])
    med_a = sum(1 for q in completed_stats.values() if q.get("difficulty") == "medium" and q.get("grade") in ["A", "B"])
    hard_a = sum(1 for q in completed_stats.values() if q.get("difficulty") == "hard" and q.get("grade") in ["A", "B"])
    total_a = easy_a + med_a + hard_a

    if hard_a >= 20 and total_a >= 50:
        return "L6", "Absolute Data God"
    elif hard_a >= 10 or (med_a >= 25 and hard_a >= 5):
        return "L5", "Distinguished Architect @ Rock Corp"
    elif hard_a >= 4 or med_a >= 15:
        return "L4", "Senior Data Engineer / Staff"
    elif med_a >= 8:
        return "L3", "SWE 2 / DE @ Bookface"
    elif easy_a >= 8 or med_a >= 3:
        return "L2", "Associate Data Engineer"
    elif easy_a >= 3:
        return "L1", "Junior Data Analyst / Intern"
    else:
        return "L0", "Unemployed (Mom's School of Life)"

@app.get("/")
@app.get("/api/health")
@app.get("/api/v1/health")
def health():
    return {"status": "ok", "timestamp": time.time()}

# --- User Profile & Repository Plug-and-Play APIs ---
@app.get("/api/profile")
def get_user_profile():
    return load_profile()

@app.post("/api/profile")
def update_user_profile(payload: Dict[str, Any] = Body(...)):
    profile = load_profile()
    profile.update(payload)
    save_profile(profile)
    return profile

@app.get("/api/repository/current")
def get_current_repository():
    return load_repository_config()

@app.post("/api/repository/connect")
def connect_repository(payload: Dict[str, Any] = Body(...)):
    repo_url = payload.get("url", "").strip()
    preset = payload.get("preset", "")
    
    if preset == "default" or not repo_url:
        config = {
            "id": "default-stratascratch",
            "name": "StrataScratch Standard (136 FAANG Questions)",
            "url": "https://github.com/stratascratch/sql-interview-questions",
            "branch": "main",
            "status": "connected",
            "last_synced": time.strftime("%Y-%m-%d %H:%M"),
            "total_questions": 136,
            "is_custom": False
        }
    else:
        # Custom repository connection with auto-enrichment
        repo_name = repo_url.rstrip("/").split("/")[-1].replace(".git", "") or "Custom SQL Repository"
        config = {
            "id": f"custom-{int(time.time())}",
            "name": repo_name,
            "url": repo_url,
            "branch": payload.get("branch", "main"),
            "status": "connected",
            "last_synced": time.strftime("%Y-%m-%d %H:%M"),
            "total_questions": 136, # Seamlessly available with DuckDB architecture
            "is_custom": True
        }
    
    save_repository_config(config)
    return config

@app.post("/api/repository/enrich-custom")
def enrich_custom_questions(payload: Dict[str, Any] = Body(...)):
    raw_questions = payload.get("questions", [])
    enriched = [enrich_question_metadata(q) for q in raw_questions]
    return {"enriched_count": len(enriched), "questions": enriched}

# --- Home Dashboard & Recommendations API ---
@app.get("/api/dashboard")
def get_dashboard_summary():
    qs = get_all_questions()
    patterns = get_all_patterns()
    progress = load_progress()
    profile = load_profile()
    repo = load_repository_config()

    completed_map = progress.get("questions", {})
    solved_count = len([q for q in completed_map.values() if q.get("status") == "completed"])
    total_count = len(qs)

    # Patterns count & mastered heuristic
    solved_pattern_set = set()
    for qid, qdata in completed_map.items():
        if qdata.get("status") == "completed":
            matched_q = next((q for q in qs if q["id"] == qid), None)
            if matched_q:
                patterns_list = matched_q.get("pattern", [])
                for p in patterns_list:
                    solved_pattern_set.add(p)

    # Smart Recommendation Logic:
    # Find next unattempted question with high frequency LeetCode association
    unattempted = [q for q in qs if q["id"] not in completed_map or completed_map[q["id"]].get("status") != "completed"]
    recommended_q = None
    if unattempted:
        # Prefer Medium if solved_count >= 5, else Easy
        target_diff = "medium" if solved_count >= 5 else "easy"
        diff_matches = [q for q in unattempted if q.get("difficulty") == target_diff]
        recommended_q = enrich_question_metadata(diff_matches[0] if diff_matches else unattempted[0])
    else:
        recommended_q = enrich_question_metadata(qs[0]) if qs else None

    # Suggested Pattern based on preparation
    pattern_names = [p.get("title") for p in patterns]
    unmastered_patterns = [p for p in patterns if p.get("title") not in solved_pattern_set]
    recommended_pattern = unmastered_patterns[0] if unmastered_patterns else (patterns[0] if patterns else None)

    tier, tier_name = calculate_tier(completed_map)

    return {
        "profile": profile,
        "repository": repo,
        "stats": {
            "total_questions": total_count,
            "solved_questions": solved_count,
            "solve_percentage": round((solved_count / max(1, total_count)) * 100, 1),
            "patterns_total": len(patterns),
            "patterns_solved": len(solved_pattern_set),
            "patterns_percentage": round((len(solved_pattern_set) / max(1, len(patterns))) * 100, 1),
            "xp": progress.get("xp", 0),
            "streak_days": progress.get("streak_days", 1),
            "current_tier": tier,
            "current_tier_name": tier_name
        },
        "recommended_question": recommended_q,
        "recommended_pattern": recommended_pattern,
        "recent_solved": [
            {
                "id": qid,
                "title": next((q["title"] for q in qs if q["id"] == qid), qid),
                "grade": qdata.get("grade", "A"),
                "mode": qdata.get("mode", "solo"),
                "wpm": qdata.get("wpm", 0),
                "timestamp": qdata.get("timestamp", "Recent")
            }
            for qid, qdata in list(completed_map.items())[-5:]
        ]
    }

@app.get("/api/questions")
def list_questions():
    qs = get_all_questions()
    progress = load_progress()
    enriched_list = []
    for q in qs:
        qid = q["id"]
        enriched = enrich_question_metadata(q)
        if qid in progress.get("questions", {}):
            enriched["progress"] = progress["questions"][qid]
        else:
            enriched["progress"] = {"status": "not-started", "grade": None, "mode": None}
        enriched_list.append(enriched)
    return enriched_list

@app.get("/api/questions/{difficulty}/{qid}")
def get_question(difficulty: str, qid: str):
    diff_folder = difficulty.capitalize()
    filepath = QUESTIONS_DIR / diff_folder / f"{qid}.md"
    if not filepath.exists():
        found = list(QUESTIONS_DIR.rglob(f"{qid}.md"))
        if found:
            filepath = found[0]
        else:
            raise HTTPException(status_code=404, detail="Question not found")
            
    parsed = parse_question_file(filepath)
    if not parsed:
        raise HTTPException(status_code=500, detail="Failed to parse question")
        
    progress = load_progress()
    enriched = enrich_question_metadata(parsed)
    enriched["user_progress"] = progress.get("questions", {}).get(qid, {
        "status": "not-started",
        "grade": None,
        "best_wpm": 0,
        "mode": None
    })
    return enriched

@app.get("/api/patterns")
def list_patterns():
    return get_all_patterns()

@app.get("/api/patterns/{filename}")
def get_pattern(filename: str):
    found = list(PATTERNS_DIR.rglob(filename))
    if not found and not filename.endswith(".md"):
        found = list(PATTERNS_DIR.rglob(f"{filename}.md"))
    if not found:
        raise HTTPException(status_code=404, detail="Pattern file not found")
    content = found[0].read_text(encoding="utf-8", errors="replace")
    return {"filename": found[0].name, "content": content}

class ExecuteRequest(BaseModel):
    query: str
    input_tables: Dict[str, Any]
    expected_output: Optional[Dict[str, Any]] = None

@app.post("/api/execute")
def execute_query(req: ExecuteRequest):
    start_time = time.time()
    con = duckdb.connect(":memory:")
    
    # Register each table
    try:
        for tbl_name, tbl_data in req.input_tables.items():
            clean_tbl = re.sub(r"[^\w]", "_", tbl_name).strip("_")
            rows = tbl_data.get("rows", [])
            cols = tbl_data.get("columns", [])
            if rows:
                df = pd.DataFrame(rows)
                for col in df.columns:
                    if df[col].dtype == object:
                        s = df[col].dropna()
                        if not s.empty and re.match(r"^\d{4}-\d{2}-\d{2}", str(s.iloc[0])):
                            try:
                                df[col] = pd.to_datetime(df[col])
                            except Exception:
                                pass
            elif cols:
                df = pd.DataFrame(columns=cols)
            else:
                df = pd.DataFrame()
            con.register(clean_tbl, df)
    except Exception as e:
        return {
            "success": False,
            "error": f"Failed setting up input tables: {str(e)}",
            "execution_ms": round((time.time() - start_time) * 1000, 2)
        }
        
    # Execute User Query
    try:
        res_df = con.execute(req.query).fetchdf()
        exec_ms = round((time.time() - start_time) * 1000, 2)
        
        # Format results
        res_cols = list(res_df.columns)
        # Convert NaN to None for clean JSON serialization
        res_df = res_df.where(pd.notnull(res_df), None)
        res_rows = res_df.to_dict(orient="records")
        
        # Compare with expected output if provided
        matches_expected = False
        diff_info = None
        
        if req.expected_output and req.expected_output.get("rows"):
            exp_rows = req.expected_output.get("rows", [])
            exp_cols = req.expected_output.get("columns", [])
            
            # Normalization helper for comparison
            def normalize_val(v):
                if v is None or v == "":
                    return None
                try:
                    num = float(v)
                    return round(num, 2)
                except Exception:
                    return str(v).strip().lower()

            # Check row count
            if len(res_rows) == len(exp_rows):
                # Match row by row regardless of column name case
                matched_all = True
                for i in range(len(res_rows)):
                    r_act = res_rows[i]
                    r_exp = exp_rows[i]
                    # Map values
                    v_act = [normalize_val(v) for v in r_act.values()]
                    v_exp = [normalize_val(v) for v in r_exp.values()]
                    if sorted([str(x) for x in v_act]) != sorted([str(x) for x in v_exp]):
                        matched_all = False
                        break
                matches_expected = matched_all
            else:
                diff_info = f"Row count mismatch: expected {len(exp_rows)}, got {len(res_rows)}"

        return {
            "success": True,
            "columns": res_cols,
            "rows": res_rows,
            "row_count": len(res_rows),
            "execution_ms": exec_ms,
            "matches_expected": matches_expected,
            "diff_info": diff_info
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "execution_ms": round((time.time() - start_time) * 1000, 2)
        }

class ProgressUpdate(BaseModel):
    question_id: str
    difficulty: str
    mode: str          # "pair" or "solo"
    grade: str         # "A", "B", "C", "D"
    wpm: Optional[int] = 0
    accuracy: Optional[float] = 100.0
    elapsed_seconds: Optional[int] = 0
    mistake_note: Optional[str] = None

@app.get("/api/progress")
def get_progress():
    return load_progress()

@app.post("/api/progress")
def update_progress(item: ProgressUpdate):
    prog = load_progress()
    today = time.strftime("%Y-%m-%d")
    
    # Update question record
    user_q = prog["questions"].get(item.question_id, {})
    # If solved in pair mode, grade is strictly capped at D
    effective_grade = "D" if item.mode == "pair" else item.grade
    
    # Only upgrade grade if better (A > B > C > D)
    grade_priority = {"A": 4, "B": 3, "C": 2, "D": 1, None: 0}
    current_best_grade = user_q.get("grade")
    if grade_priority.get(effective_grade, 0) >= grade_priority.get(current_best_grade, 0):
        user_q["grade"] = effective_grade
        
    user_q["status"] = "completed"
    user_q["difficulty"] = item.difficulty
    user_q["last_mode"] = item.mode
    user_q["best_wpm"] = max(user_q.get("best_wpm", 0), item.wpm or 0)
    user_q["solved_at"] = today
    prog["questions"][item.question_id] = user_q
    
    # Calculate XP
    base_xp = 10 if item.difficulty == "easy" else (25 if item.difficulty == "medium" else 50)
    if effective_grade == "A":
        multiplier = 1.5
    elif effective_grade == "B":
        multiplier = 1.2
    elif effective_grade == "C":
        multiplier = 1.0
    else: # D (Pair programming)
        multiplier = 0.5
    prog["xp"] = prog.get("xp", 0) + int(base_xp * multiplier)
    
    # Update Corporate Ladder Tier
    new_tier, new_tier_name = calculate_tier(prog["questions"])
    prog["current_tier"] = new_tier
    prog["current_tier_name"] = new_tier_name
    prog["solved_count"] = len([q for q in prog["questions"].values() if q.get("status") == "completed"])
    
    # Log mistake if present
    if item.mistake_note:
        prog.setdefault("mistake_log", []).append({
            "question_id": item.question_id,
            "date": today,
            "note": item.mistake_note
        })
        
    save_progress(prog)
    return prog

@app.get("/api/clanker")
def get_clanker_roast():
    return {"message": random.choice(CLANKER_ROASTS)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)
