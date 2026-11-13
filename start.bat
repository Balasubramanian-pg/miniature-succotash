@echo off
echo ========================================================
echo   RAILS DE · Rigorous High-Efficiency Learning System
echo   Vantage Dark Precision Theme (Hallmark Architecture)
echo ========================================================
echo.

echo Starting Python FastAPI Backend on http://127.0.0.1:8001 ...
start "RAILS DE Backend" cmd /k "cd backend && python -m uvicorn server:app --host 127.0.0.1 --port 8001 --reload"

echo Starting Vite Frontend on http://localhost:5173 ...
start "RAILS DE Frontend" cmd /k "cd frontend && npm run dev"

timeout /t 3 /nobreak > nul
echo Opening browser...
start http://localhost:5173
echo.
echo RAILS DE is running. Enjoy muscle-memory interview prep!
