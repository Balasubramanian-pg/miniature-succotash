import React, { useState, useEffect, useRef } from "react";
import { soundEngine } from "../audio/synthAudio";

export function SoloEditor({
  question,
  onComplete,
  onKeystroke,
  onPasteAttempt
}) {
  const [query, setQuery] = useState("");
  const [executing, setExecuting] = useState(false);
  const [result, setResult] = useState(null);
  const [grade, setGrade] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [keystrokes, setKeystrokes] = useState(0);
  const textareaRef = useRef(null);

  useEffect(() => {
    setQuery("");
    setResult(null);
    setGrade(null);
    setStartTime(null);
    setKeystrokes(0);
  }, [question?.id]);

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === "v" || e.key === "V")) {
      e.preventDefault();
      soundEngine.playError();
      if (onPasteAttempt) onPasteAttempt();
      return;
    }

    if (!startTime) {
      setStartTime(Date.now());
    }

    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      runQuery();
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const nextQuery = query.substring(0, start) + "    " + query.substring(end);
      setQuery(nextQuery);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
        }
      }, 0);
      soundEngine.playKeyClick(true);
      return;
    }

    const isWordEnd = e.key === " " || e.key === "Enter";
    soundEngine.playKeyClick(isWordEnd);
    const nextK = keystrokes + 1;
    setKeystrokes(nextK);
    if (onKeystroke) onKeystroke(55, Math.floor(nextK / 8));
  };

  const handlePaste = (e) => {
    e.preventDefault();
    soundEngine.playWrongSound();
    if (onPasteAttempt) onPasteAttempt();
  };

  const runQuery = async () => {
    if (!query.trim()) return;
    setExecuting(true);
    setResult(null);

    const payload = {
      query: query.trim(),
      input_tables: question.example_input_tables || {},
      expected_output: question.example_output_tables?.expected_output || Object.values(question.example_output_tables || {})[0]
    };

    try {
      const resp = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await resp.json();
      setResult(data);

      if (data.success && data.matches_expected) {
        soundEngine.playSuccessMusic(); // Aero Chord - Shooting Star [oh baby a triple drop]
        const elapsedSec = Math.round((Date.now() - (startTime || Date.now())) / 1000);
        const awardedGrade = elapsedSec < 360 ? "A" : "B";
        setGrade(awardedGrade);

        if (onComplete) {
          onComplete({
            mode: "solo",
            grade: awardedGrade,
            wpm: 65,
            streak: 75,
            elapsedSeconds: elapsedSec,
            completedCode: query.trim()
          });
        }
      } else {
        soundEngine.playWrongSound(); // Fahhh - Sound Effect for Meme Edits
      }
    } catch (err) {
      setResult({
        success: false,
        error: "Execution failed: " + err.message
      });
      soundEngine.playWrongSound();
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#0f1013" }}>
      
      {/* Top Status Ribbon */}
      <div className="editor-top-ribbon">
        <span style={{ color: "var(--text-parchment)", fontWeight: 500 }}>
          Autonomous Mode · DuckDB Query Console
        </span>
        <span style={{ color: "var(--text-dim)", fontFamily: "var(--font-code)", fontSize: "11px" }}>
          (Ctrl + Enter to Execute)
        </span>
        
        <button
          onClick={runQuery}
          disabled={executing || !query.trim()}
          className="earth-btn earth-btn-primary"
          style={{ marginLeft: "auto", padding: "4px 14px", fontSize: "11px" }}
        >
          {executing ? "Running Query..." : "Execute (Ctrl + Enter)"}
        </button>
      </div>

      {/* Code Textarea */}
      <div style={{ flex: 1, position: "relative", minHeight: "240px", background: "#0f1013" }}>
        <textarea
          ref={textareaRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder="-- Write your SQL query from scratch here...&#10;SELECT ..."
          rows={12}
          spellCheck={false}
          style={{
            width: "100%",
            height: "100%",
            background: "transparent",
            color: "var(--text-parchment)",
            border: "none",
            outline: "none",
            resize: "none",
            padding: "20px 24px",
            fontFamily: "var(--font-code)",
            fontSize: "13.5px",
            lineHeight: 1.6,
            tabSize: 4
          }}
        />
      </div>

      {/* Query Execution Output Table */}
      {result && (
        <div style={{
          borderTop: "1px solid var(--border-subtle)",
          background: "var(--bg-desk)",
          padding: "16px 20px",
          maxHeight: "240px",
          overflowY: "auto"
        }}>
          {result.success ? (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{
                    fontSize: "11px",
                    fontFamily: "var(--font-code)",
                    padding: "3px 8px",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid",
                    borderColor: result.matches_expected ? "var(--accent-sage)" : "var(--accent-terracotta)",
                    color: result.matches_expected ? "var(--accent-sage)" : "var(--accent-terracotta)",
                    background: result.matches_expected ? "var(--accent-sage-dim)" : "var(--accent-terracotta-dim)"
                  }}>
                    {result.matches_expected ? "✓ Output Matched Expected Schema (Grade A)" : "✗ Output Mismatch"}
                  </span>
                  <span style={{ fontSize: "11px", color: "var(--text-dim)", fontFamily: "var(--font-code)" }}>
                    {result.row_count} rows in {result.execution_ms} ms
                  </span>
                </div>
              </div>

              {result.diff_info && (
                <div style={{ fontSize: "11px", color: "var(--accent-terracotta)", fontFamily: "var(--font-code)", marginBottom: "8px" }}>
                  {result.diff_info}
                </div>
              )}

              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11.5px", fontFamily: "var(--font-code)" }}>
                <thead>
                  <tr>
                    {result.columns.map((c, i) => (
                      <th key={i} style={{ background: "var(--bg-card)", color: "var(--accent-amber)", textAlign: "left", padding: "6px 10px", borderBottom: "1px solid var(--border-subtle)" }}>
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((r, ri) => (
                    <tr key={ri} style={{ background: ri % 2 === 0 ? "transparent" : "rgba(255, 255, 255, 0.02)" }}>
                      {result.columns.map((c, ci) => (
                        <td key={ci} style={{ padding: "6px 10px", borderBottom: "1px solid rgba(255, 255, 255, 0.04)", color: "var(--text-parchment)" }}>
                          {r[c] !== null && r[c] !== undefined ? String(r[c]) : "NULL"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div>
              <span style={{ fontSize: "11px", color: "var(--accent-terracotta)", fontFamily: "var(--font-code)", fontWeight: 600 }}>
                DuckDB Binder / Syntax Error:
              </span>
              <pre style={{
                margin: "8px 0 0",
                fontSize: "11px",
                fontFamily: "var(--font-code)",
                color: "var(--accent-terracotta)",
                whiteSpace: "pre-wrap",
                background: "#0f1013",
                padding: "10px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border-subtle)"
              }}>
                {result.error}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
