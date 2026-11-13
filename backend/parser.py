import os
import re
import yaml
from pathlib import Path

BASE_DIR = Path(r"P:\SQL Interview Prep\StrataScratch")
QUESTIONS_DIR = BASE_DIR / "03 Interview Questions"
PATTERNS_DIR = BASE_DIR / "02 SQL Patterns"
FOUNDATIONS_DIR = BASE_DIR / "01 Foundations"

def parse_frontmatter(content: str):
    frontmatter = {}
    body = content
    if content.startswith("---"):
        parts = content.split("---", 2)
        if len(parts) >= 3:
            try:
                frontmatter = yaml.safe_load(parts[1]) or {}
            except Exception:
                frontmatter = {}
            body = parts[2].strip()
    return frontmatter, body

def parse_markdown_table(table_str: str):
    lines = [line.strip() for line in table_str.strip().split("\n") if line.strip().startswith("|")]
    if not lines or len(lines) < 2:
        return {"columns": [], "rows": []}
    
    header_line = lines[0]
    data_lines = [l for l in lines[1:] if not re.match(r"^\|[-|\s:]+\|$", l)]
    
    headers = [c.strip() for c in header_line.strip("|").split("|")]
    rows = []
    for line in data_lines:
        row_vals = [c.strip() for c in line.strip("|").split("|")]
        if len(row_vals) < len(headers):
            row_vals += [""] * (len(headers) - len(row_vals))
        row_obj = {}
        for h, v in zip(headers, row_vals[:len(headers)]):
            cleaned_val = v
            try:
                if re.match(r"^-?\d+$", v):
                    cleaned_val = int(v)
                elif re.match(r"^-?\d+\.\d+$", v):
                    cleaned_val = float(v)
            except Exception:
                pass
            row_obj[h] = cleaned_val
        rows.append(row_obj)
        
    return {"columns": headers, "rows": rows}

def extract_named_tables(text: str):
    tables = {}
    # Split text into segments starting with #### or ###
    segments = re.split(r"(?:^|\n)#{3,4}\s+", text)
    for seg in segments:
        lines = seg.strip().splitlines()
        if not lines:
            continue
        first_line = lines[0].strip()
        if first_line.startswith("|"):
            # Table directly without heading
            tbl_lines = [l for l in lines if l.strip().startswith("|")]
            if tbl_lines:
                tbl_name = f"table_{len(tables)+1}" if tables else "expected_output"
                tables[tbl_name] = parse_markdown_table("\n".join(tbl_lines))
        else:
            title_line = first_line.replace("`", "").strip()
            tbl_lines = [l for l in lines[1:] if l.strip().startswith("|")]
            if tbl_lines:
                clean_name = re.sub(r"[^\w\s-]", "", title_line).strip()
                if not clean_name:
                    clean_name = f"table_{len(tables)+1}"
                tables[clean_name] = parse_markdown_table("\n".join(tbl_lines))
            
    # Fallback if no tables found yet
    if not tables:
        tbl_lines = [l for l in text.splitlines() if l.strip().startswith("|")]
        if tbl_lines:
            tables["expected_output"] = parse_markdown_table("\n".join(tbl_lines))
            
    return tables

def get_section_content(body: str, start_header: str, stop_headers: list):
    if stop_headers:
        stop_pattern = "|".join([re.escape(h) for h in stop_headers])
        regex = rf"(?:^|\n){re.escape(start_header)}\s*\n(.*?)(?=\n+(?:{stop_pattern})|\Z)"
    else:
        regex = rf"(?:^|\n){re.escape(start_header)}\s*\n(.*)\Z"
    m = re.search(regex, body, re.DOTALL | re.IGNORECASE)
    return m.group(1).strip() if m else ""

def parse_question_file(filepath: Path):
    if not filepath.exists():
        return None
        
    content = filepath.read_text(encoding="utf-8", errors="replace")
    frontmatter, body = parse_frontmatter(content)
    
    title_match = re.search(r"^#\s+(.+)$", body, re.MULTILINE)
    title = title_match.group(1).strip() if title_match else filepath.stem

    # Split into Question Spec and Solutions Walkthrough
    spec_parts = re.split(r"(?:^|\n)##\s+Solutions\s*(?:&|and)\s*Detailed\s*Walkthrough", body, flags=re.IGNORECASE)
    question_markdown = spec_parts[0].strip()
    solutions_text = spec_parts[1].strip() if len(spec_parts) > 1 else ""
    
    # Extract code blocks from solutions_text
    solutions = []
    blocks = re.findall(r"(?:###\s+([^\n]+)\s*\n+)?```([a-zA-Z0-9_-]*)\s*\n(.*?)```", solutions_text, re.DOTALL)
    for subheader, lang, code in blocks:
        clean_code = code.strip()
        if not clean_code:
            continue
        clean_lang = lang.lower().strip() if lang else "sql"
        label = subheader.strip() if subheader else f"{clean_lang.upper()} Solution"
        solutions.append({
            "label": label,
            "language": clean_lang,
            "code": clean_code
        })
        
    canonical_sql = ""
    for s in solutions:
        if "sql" in s["language"]:
            canonical_sql = s["code"]
            break
    if not canonical_sql and solutions:
        canonical_sql = solutions[0]["code"]

    example_input_text = get_section_content(body, "### Example Input", ["### Example Output", "### Explanation of Example", "---", "## Solutions"])
    example_output_text = get_section_content(body, "### Example Output", ["### Explanation of Example", "### Constraints", "---", "## Solutions"])

    input_tables = extract_named_tables(example_input_text)
    output_tables = extract_named_tables(example_output_text)
    
    diff = str(frontmatter.get("difficulty", filepath.parent.name)).lower()
    if diff == "easy":
        tier = "L1"
        tier_name = "Junior Data Analyst"
    elif diff == "medium":
        tier = "L3"
        tier_name = "SWE 2 / DE @ Bookface"
    else:
        tier = "L5"
        tier_name = "Distinguished Architect @ Rock Corp"

    return {
        "id": filepath.stem,
        "filename": filepath.name,
        "difficulty": diff,
        "tier": tier,
        "tier_name": tier_name,
        "title": title,
        "frontmatter": frontmatter,
        "question_markdown": question_markdown,
        "example_input_tables": input_tables,
        "example_output_tables": output_tables,
        "solutions": solutions,
        "canonical_solution": canonical_sql,
        "walkthrough": solutions_text
    }

def get_all_questions():
    questions = []
    for diff in ["Easy", "Medium", "Hard"]:
        dir_path = QUESTIONS_DIR / diff
        if not dir_path.exists():
            continue
        for f in dir_path.glob("*.md"):
            content = f.read_text(encoding="utf-8", errors="replace")
            fm, body = parse_frontmatter(content)
            title_match = re.search(r"^#\s+(.+)$", body, re.MULTILINE)
            title = title_match.group(1).strip() if title_match else f.stem
            
            diff_clean = diff.lower()
            tier = "L1" if diff_clean == "easy" else ("L3" if diff_clean == "medium" else "L5")
            
            questions.append({
                "id": f.stem,
                "filename": f.name,
                "difficulty": diff_clean,
                "tier": tier,
                "title": title,
                "companies": fm.get("companies", []),
                "tags": fm.get("tags", []),
                "pattern": fm.get("pattern", []),
                "status": fm.get("status", "not-started")
            })
    return questions

def get_all_patterns():
    patterns = []
    if not PATTERNS_DIR.exists():
        return patterns
    for f in PATTERNS_DIR.rglob("*.md"):
        content = f.read_text(encoding="utf-8", errors="replace")
        fm, body = parse_frontmatter(content)
        title_match = re.search(r"^#\s+(.+)$", body, re.MULTILINE)
        title = title_match.group(1).strip() if title_match else f.stem
        category = f.parent.name if f.parent != PATTERNS_DIR else "General"
        patterns.append({
            "id": f.stem,
            "filename": f.name,
            "category": category,
            "title": title,
            "relative_path": str(f.relative_to(PATTERNS_DIR)),
            "tags": fm.get("tags", [])
        })
    return patterns

if __name__ == "__main__":
    sample_file = QUESTIONS_DIR / "Easy" / "Amazon - Top 5 Revenue Product Categories for Q1.md"
    parsed = parse_question_file(sample_file)
    print("Parsed Title:", parsed["title"])
    print("Input Tables:", list(parsed["example_input_tables"].keys()))
    print("Output Tables:", list(parsed["example_output_tables"].keys()))
    print("Solutions Found:", len(parsed["solutions"]))
    for s in parsed["solutions"]:
        print(" -", s["label"], f"({s['language']})")
    print("\nCanonical Solution preview:\n", parsed["canonical_solution"][:150])
