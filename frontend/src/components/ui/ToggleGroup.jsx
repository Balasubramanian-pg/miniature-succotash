import React from "react";
import { soundEngine } from "../../audio/synthAudio";

export function ModeToggleGroup({ value, onChange, onOpenExtend }) {
  const modes = [
    {
      id: "solo",
      label: "Solo Recall",
      badge: "Grade A",
      icon: (
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 14 14" />
        </svg>
      ),
      tooltip: "Write from scratch with full DuckDB execution (Unlocks Grade A promotion)"
    },
    {
      id: "pair",
      label: "Paired Typer",
      badge: "Grade D cap",
      icon: (
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      tooltip: "Guided keystroke muscle-memory typing with ghost guidance (Capped at Grade D)"
    },
    {
      id: "pyspark",
      label: "PySpark Extension",
      badge: "AST Verified",
      icon: (
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      ),
      tooltip: "Scale to Distributed Engine: PySpark DataFrame syntax challenge"
    }
  ];

  const handleClick = (id) => {
    soundEngine.playKeyClick();
    if (id === "pyspark") {
      if (onOpenExtend) onOpenExtend();
    } else {
      onChange(id);
    }
  };

  return (
    <div
      className="reui-toggle-group-13"
      role="group"
      aria-label="Editor Mode Selection"
      style={{
        display: "inline-flex",
        alignItems: "center",
        background: "rgba(17, 18, 21, 0.8)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "8px",
        padding: "3px",
        gap: "3px"
      }}
    >
      {modes.map((m) => {
        const isActive = value === m.id;
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => handleClick(m.id)}
            title={m.tooltip}
            aria-pressed={isActive}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "5px 10px",
              borderRadius: "6px",
              fontSize: "11px",
              fontFamily: "var(--font-code)",
              fontWeight: isActive ? 600 : 400,
              color: isActive ? "var(--text-parchment)" : "var(--text-muted)",
              background: isActive ? "var(--bg-card)" : "transparent",
              border: isActive ? "1px solid var(--accent-amber)" : "1px solid transparent",
              boxShadow: isActive ? "0 2px 8px rgba(0,0,0,0.4)" : "none",
              cursor: "pointer",
              transition: "all 0.15s ease",
              whiteSpace: "nowrap"
            }}
          >
            <span style={{ color: isActive ? "var(--accent-amber)" : "var(--text-dim)", display: "flex" }}>
              {m.icon}
            </span>
            <span>{m.label}</span>
            <span
              style={{
                fontSize: "9px",
                padding: "1px 5px",
                borderRadius: "4px",
                background: isActive ? "rgba(217, 155, 67, 0.18)" : "rgba(255, 255, 255, 0.04)",
                color: isActive ? "var(--accent-amber)" : "var(--text-dim)"
              }}
            >
              {m.badge}
            </span>
          </button>
        );
      })}
    </div>
  );
}
