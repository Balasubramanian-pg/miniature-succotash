# RAILS DE · Rigorous High-Efficiency Learning System

> **Non-Slop Data Engineering & Analytics Mastery Engine**  
> Designed with the **Hallmark "Vantage"** aesthetic, **1980s Anime Retro** CRT palette, and **Earthly Warm** typography (`oklch` dark slate/steel palette, hairline rules, surveyor corner ticks, `Geologica` typography with `SHRP` 100 display heads, tabular numerals, and zero AI slop).

---

## What is RAILS DE?

Inspired by the philosophy of dangerously self-taught engineering mastery, **RAILS DE** turns SQL, PySpark, and Python interview preparation into tactile muscle memory building. 

Instead of passively reading solutions or copying code with AI, you build real muscle memory by physically typing code, climbing a tiered corporate ladder, and executing queries against in-memory DuckDB engines with strict, authentic grading.

---

## Core Features

### 1. Home Dashboard & Chill Zone (Capybara Onsen)
- **Interactive Capybara Mascot**: Relax in a warm steaming onsen hot spring with an interactive capybara mascot. Pet the capybara on hover for soothing sound and chill counter points (+1 chill).
- **Preparation Metrics**: Real-time stats on completed problems, pattern coverage percentages, and active streaks.
- **Smart Recommendations**: Next suggested challenge and recommended architectural pattern based on preparation history.
- **Career Ladder Preview**: Direct visual representation of your progress up the corporate hierarchy.

### 2. Plug-and-Play Repository Connect & Metadata Enricher
- **Bring Your Own Questions**: Connect any GitHub repository containing SQL, Python, or data engineering challenges.
- **Automated Metadata Handling**: If your repo lacks structured metadata (e.g. only contains question numbers or raw names), RAILS DE automatically:
  - Resolves associated LeetCode problem IDs and direct links.
  - Tags target FAANG / Tier-1 companies (Meta, Amazon, Google, Netflix, Uber, etc.).
  - Classifies the difficulty level (Easy, Medium, Hard).
  - Categorizes the underlying architectural pattern (Window Functions, Gaps & Islands, Deduplication, Running Totals, Retention & Churn).

### 3. Handbook Autocomplete Search & HoverCards
- **ReUI Autocomplete (`@reui/c-autocomplete-8`)**: Fast typeahead filter grouped by category (Window Functions, Aggregations, Joins, Advanced) with sticky headers.
- **ReUI HoverCards (`@reui/c-hover-card-3`)**: Hovering over any pattern previews code snippets, interview frequency, and practical use cases without leaving your place.

### 4. Pair Programming Mode (Ghost Typer Muscle Memory)
- **The Core Drill**: Displays the canonical solution dimmed directly behind your typing cursor.
- **Character-by-Character Cadence**: Correct keystrokes snap into high-contrast lime/white; typos flash in red with audio feedback.
- **Strict Grade Cap**: Any solution typed in Pair Programming mode receives a maximum grade of **Grade D ("Guided Muscle Memory Drill")**. To earn a **Grade A**, you must solve in Solo Mode.
- **Telemetry**: Real-time Words Per Minute (WPM), Accuracy %, and Elapsed Time tracking.

### 5. High-Efficiency Solo Mode (Live DuckDB Engine)
- **Unguided Solving**: Clean code editor with full problem requirements, schema inspector, and mock data tables.
- **In-Memory DuckDB**: Automatically creates and registers mock tables from Markdown files and executes your query live (< 50ms).
- **Deep Output Diff**: Verifies row counts, column names, column order, and values against expected output.
- **Authentic Grading**: Awards Grade A (fast, 100% correct, no crutches), Grade B, or Grade C.

### 6. The Corporate Ladder (Progression System)
Climb from the bottom up to the top of the data hierarchy:
- **L0: Unemployed (Mom's School of Life)** — Starting baseline with dry remarks on failures.
- **L1: Junior Data Analyst / Intern** — Early-stage startup ($15/hr). Basic WHERE, single joins, GROUP BY.
- **L2: Associate Data Engineer** — MidCorp Enterprise. CTEs, self-joins, basic PySpark schemas.
- **L3: SWE 2 / DE @ Bookface** — Meta tier. Advanced window functions (LEAD, LAG, DENSE_RANK), running totals, churn.
- **L4: Senior Data Engineer / Staff** — Unicorn tier. Gaps & islands, cumulative rolling metrics, distributed shuffle optimization.
- **L5: Distinguished Architect @ Rock Corp** — Bar-raiser FAANG challenges.
- **L6: Absolute Data God** — Untouchable mastery. Solving complex medium/hard problems in minutes.

### 7. Synthesized & Real Mechanical Switch Audio
- Tactile mechanical switch click audio on every keystroke with real recorded micro-samples and Web Audio API fallback.
- Harmonic victory music on query success and defeat buzzer on syntax/grading errors.
- Quick 1-click **MUTE** toggle in the persistent navigation bar.

### 8. Anti-Cheat (Anti-Paste Enforcement)
- Detects `Ctrl+V` and clipboard paste events in the editor.
- Blocks pasting immediately with a Hallmark-styled alert: *"No shortcuts allowed. Build manual muscle memory."*

### 9. "Extend the Tutorial" Post-Solve Drawer
- **PySpark Translation Tab**: Shows the equivalent query in the PySpark DataFrame API.
- **1-Billion Row Reflection**: Evaluates broadcast join opportunities, GROUP BY data skew, and partition pruning.
- **Interviewer Follow-ups**: Realistic interviewer follow-up questions for deeper understanding.

---

## Architecture & Tech Stack

- **Design Systems**: Hallmark **Vantage**, **1980s Anime Retro**, and **Earthly Warm**
- **Frontend**: React 18 + Vite 6 + Tailwind CSS
- **Backend**: Python 3.13 + FastAPI + Uvicorn + DuckDB
- **UI Components**: ReUI component library (`@reui/c-autocomplete-8`, `@reui/c-sidebar-2`, `@reui/c-tree-3`, `@reui/c-hover-card-3`, `@reui/c-toggle-group-13`)
- **Audio Engine**: Dual-layer Web Audio API synthesizer + low-latency HTML5 Audio buffers

---

## Quick Start

### Option 1: Double-click `start.bat`
Double-click `start.bat` to automatically start both the backend on `http://127.0.0.1:8001` and frontend on `http://localhost:5173`.

### Option 2: Python Launcher
```powershell
python start.py
```

### Option 3: Manual Startup
```powershell
# Terminal 1: Backend
cd backend
python -m uvicorn server:app --host 127.0.0.1 --port 8001 --reload

# Terminal 2: Frontend
cd frontend
npm run dev
```

Visit **`http://localhost:5173`** and enjoy muscle-memory data engineering mastery!
