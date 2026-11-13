import React, { useState } from "react";

export function AntiPasteModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="postmortem-overlay" onClick={onClose}>
      <div className="postmortem-card" style={{ maxWidth: "440px" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "grid", gap: "8px" }}>
          <div style={{
            fontFamily: "var(--font-code)",
            fontSize: "11px",
            color: "var(--accent-terracotta)",
            textTransform: "uppercase",
            letterSpacing: "0.06em"
          }}>
            Tactile Habit Safeguard
          </div>
          
          <h3 style={{
            fontFamily: "var(--font-heading)",
            fontSize: "17px",
            fontWeight: 600,
            color: "var(--text-parchment)",
            margin: "2px 0 0"
          }}>
            Type it out manually.
          </h3>
          
          <p style={{
            fontSize: "12.5px",
            color: "var(--text-muted)",
            lineHeight: 1.6,
            margin: "8px 0"
          }}>
            Pasting code defeats tactile muscle memory. In a high-stakes technical screen, your hands need to automatically type window partitions, CTEs, and date boundaries without hesitation.
          </p>

          <div style={{ marginTop: "12px", display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={onClose}
              className="earth-btn earth-btn-primary"
            >
              I'll type it out →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ClankerDrawer({ isOpen, onClose }) {
  const [advice, setAdvice] = useState(null);
  const [loading, setLoading] = useState(false);

  const askClanker = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/clanker");
      const data = await res.json();
      setAdvice(data.message);
    } catch {
      setAdvice("Clanker says: My 2B weights have suffered a matrix multiplication meltdown.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      padding: "12px 16px",
      background: "var(--bg-card)",
      border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-sm)",
      marginTop: "12px"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{
            fontFamily: "var(--font-code)",
            fontSize: "11px",
            color: "var(--accent-amber)"
          }}>
            🤖 Clanker (2B LLM)
          </span>
        </div>
        <button
          className="earth-btn"
          onClick={askClanker}
          disabled={loading}
          style={{ fontSize: "11px", padding: "2px 10px" }}
        >
          {loading ? "Thinking..." : "Consult Clanker"}
        </button>
      </div>

      {advice && (
        <div style={{
          marginTop: "10px",
          padding: "10px",
          background: "#131417",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-sm)"
        }}>
          <p style={{
            fontFamily: "var(--font-code)",
            fontSize: "11.5px",
            color: "var(--text-parchment)",
            margin: 0,
            lineHeight: 1.5,
            fontStyle: "italic"
          }}>
            "{advice}"
          </p>
        </div>
      )}
    </div>
  );
}
