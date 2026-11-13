import React, { useState, useEffect } from "react";
import { MarkdownViewer } from "./MarkdownViewer";
import { soundEngine } from "../audio/synthAudio";

export function HandbookDrawer({ isOpen, onClose }) {
  const [patterns, setPatterns] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [patternContent, setPatternContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    soundEngine.playDrawer();

    fetch("/api/patterns")
      .then(res => res.json())
      .then(data => {
        setPatterns(data);
        if (data.length > 0) {
          loadPatternByIndex(0, data);
        }
      })
      .catch(err => console.error("Failed to load patterns", err));
  }, [isOpen]);

  const loadPatternByIndex = (idx, list = patterns) => {
    if (!list || list.length === 0 || idx < 0 || idx >= list.length) return;
    setCurrentIndex(idx);
    const p = list[idx];
    setLoading(true);

    fetch(`/api/patterns/${p.filename}`)
      .then(res => res.json())
      .then(data => {
        let content = data.content || "";
        if (content.startsWith("---")) {
          const parts = content.split("---", 3);
          if (parts.length >= 3) {
            content = parts[2].trim();
          }
        }
        setPatternContent(content);
      })
      .catch(err => setPatternContent("# Error loading pattern document"))
      .finally(() => setLoading(false));
  };

  if (!isOpen) return null;

  const currentPattern = patterns[currentIndex];

  return (
    <>
      <div className="postmortem-overlay" onClick={onClose} />
      <div style={{
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        width: "520px",
        maxWidth: "92vw",
        background: "var(--bg-desk)",
        borderRight: "1px solid var(--border-subtle)",
        zIndex: 220,
        display: "flex",
        flexDirection: "column",
        padding: "24px",
        boxShadow: "10px 0 50px rgba(0, 0, 0, 0.6)"
      }}>
        {/* Drawer Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "12px" }}>
          <div>
            <div style={{ fontFamily: "var(--font-code)", fontSize: "11px", color: "var(--accent-amber)", textTransform: "uppercase" }}>
              Architectural Codex · 89 Patterns
            </div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "17px", color: "var(--text-parchment)", margin: "4px 0 0" }}>
              Data Engineering Design Patterns
            </h2>
          </div>
          <button
            onClick={onClose}
            className="earth-btn"
            style={{ padding: "4px 8px", fontSize: "11px" }}
            title="Close Handbook (Esc)"
          >
            ✕ Esc
          </button>
        </div>

        {/* Navigation & Chapter Bar */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <button
            className="earth-btn"
            disabled={currentIndex <= 0}
            onClick={() => loadPatternByIndex(currentIndex - 1)}
            style={{ opacity: currentIndex <= 0 ? 0.4 : 1, padding: "4px 10px", fontSize: "11px" }}
          >
            ← Previous
          </button>
          
          <span style={{ fontFamily: "var(--font-code)", fontSize: "11.5px", color: "var(--text-parchment)" }}>
            Pattern {currentIndex + 1} of {patterns.length || 89}
          </span>

          <button
            className="earth-btn"
            disabled={currentIndex >= patterns.length - 1}
            onClick={() => loadPatternByIndex(currentIndex + 1)}
            style={{ opacity: currentIndex >= patterns.length - 1 ? 0.4 : 1, padding: "4px 10px", fontSize: "11px" }}
          >
            Next →
          </button>

          {currentPattern && (
            <span style={{
              marginLeft: "auto",
              fontSize: "10.5px",
              fontFamily: "var(--font-code)",
              color: "var(--accent-amber)",
              background: "var(--accent-amber-dim)",
              padding: "2px 8px",
              borderRadius: "var(--radius-sm)"
            }}>
              {currentPattern.category}
            </span>
          )}
        </div>

        {/* Content Viewport */}
        <div style={{ flex: 1, overflowY: "auto", paddingRight: "6px" }}>
          {loading ? (
            <div style={{ padding: "20px", color: "var(--text-muted)", fontSize: "12px" }}>
              Loading pattern diagram and analysis...
            </div>
          ) : (
            <div>
              <div style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 600,
                fontSize: "16px",
                color: "var(--text-parchment)",
                marginBottom: "12px",
                borderBottom: "1px solid var(--border-subtle)",
                paddingBottom: "8px"
              }}>
                {currentPattern?.title}
              </div>

              <MarkdownViewer content={patternContent} />
            </div>
          )}
        </div>

      </div>
    </>
  );
}
