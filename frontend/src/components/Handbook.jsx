import React, { useState, useEffect } from "react";
import { MarkdownViewer } from "./MarkdownViewer";
import { soundEngine } from "../audio/synthAudio";
import { GroupedAutocomplete } from "./ui/Autocomplete";
import { HoverCard, PatternHoverCardContent } from "./ui/HoverCard";

export function Handbook({ onOpenWorkspace }) {
  const [patterns, setPatterns] = useState([]);
  const [selectedPattern, setSelectedPattern] = useState(null);
  const [patternContent, setPatternContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  const [listWidth, setListWidth] = useState(340);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    fetch("/api/patterns")
      .then((res) => res.json())
      .then((data) => {
        setPatterns(data);
        if (data.length > 0) {
          loadPatternDetail(data[0]);
        }
      })
      .catch((err) => console.error("Failed to load patterns", err));
  }, []);

  const loadPatternDetail = (pattern) => {
    setSelectedPattern(pattern);
    setLoading(true);
    soundEngine.playKeyClick();

    fetch(`/api/patterns/${pattern.filename}`)
      .then((res) => res.json())
      .then((data) => {
        let content = data.content || "";
        if (content.startsWith("---")) {
          const parts = content.split("---", 3);
          if (parts.length >= 3) {
            content = parts[2].trim();
          }
        }
        setPatternContent(content);
      })
      .catch((err) => {
        setPatternContent("# Error loading pattern document");
      })
      .finally(() => setLoading(false));
  };

  // Draggable splitter handler
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      const newWidth = Math.max(260, Math.min(e.clientX, 560));
      setListWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };

    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, [isDragging]);

  const categories = ["all", ...new Set(patterns.map((p) => p.category))];

  const filtered = patterns.filter((p) => {
    return selectedCategory === "all" || p.category === selectedCategory;
  });

  return (
    <div
      style={{
        display: "flex",
        height: "calc(100vh - 54px)",
        background: "var(--bg-study)",
        color: "var(--text-parchment)",
        overflow: "hidden"
      }}
    >
      {/* Patterns Left Sidebar */}
      <div
        style={{
          width: `${listWidth}px`,
          flexShrink: 0,
          background: "var(--bg-desk)",
          borderRight: "1px solid var(--border-subtle)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }}
      >
        {/* Header & Grouped Autocomplete Search */}
        <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid var(--border-subtle)", display: "grid", gap: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span
              style={{
                fontSize: "10.5px",
                color: "var(--accent-amber)",
                fontFamily: "var(--font-code)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                fontWeight: 600
              }}
            >
              Architectural Codex
            </span>
            <span style={{ fontSize: "11px", color: "var(--text-dim)", fontFamily: "var(--font-code)" }}>
              {filtered.length} of {patterns.length}
            </span>
          </div>

          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "16px", fontWeight: 600, color: "var(--text-parchment)", margin: 0 }}>
            SQL Design Patterns
          </h2>

          {/* Grouped Autocomplete Input (@reui/c-autocomplete-8) */}
          <GroupedAutocomplete
            items={patterns}
            placeholder="Search patterns (e.g. Window, Pivot, Gaps)..."
            onSelectPattern={loadPatternDetail}
          />

          {/* Categories Pill Bar */}
          <div style={{ display: "flex", gap: "4px", overflowX: "auto", paddingBottom: "2px" }}>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    background: isSelected ? "var(--accent-amber-dim)" : "transparent",
                    color: isSelected ? "var(--accent-amber)" : "var(--text-muted)",
                    border: isSelected ? "1px solid var(--accent-amber)" : "1px solid var(--border-subtle)",
                    borderRadius: "12px",
                    padding: "2px 8px",
                    fontSize: "10.5px",
                    fontFamily: "var(--font-code)",
                    cursor: "pointer",
                    whiteSpace: "nowrap"
                  }}
                >
                  {cat === "all" ? "All Categories" : cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Pattern List with HoverCards (@reui/c-hover-card-3) */}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
          {filtered.map((p) => {
            const isSel = selectedPattern?.id === p.id;
            return (
              <HoverCard
                key={p.id}
                trigger={
                  <div
                    onClick={() => loadPatternDetail(p)}
                    style={{
                      padding: "8px 10px",
                      borderRadius: "var(--radius-sm)",
                      background: isSel ? "var(--bg-card)" : "transparent",
                      borderLeft: isSel ? "3px solid var(--accent-amber)" : "3px solid transparent",
                      cursor: "pointer",
                      marginBottom: "4px",
                      transition: "background 0.1s ease"
                    }}
                    onMouseEnter={(e) => {
                      if (!isSel) e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isSel) e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12.5px",
                        fontWeight: isSel ? 600 : 400,
                        color: isSel ? "var(--text-parchment)" : "var(--text-muted)",
                        lineHeight: 1.3
                      }}
                    >
                      {p.title}
                    </div>
                    <div
                      style={{
                        fontSize: "10px",
                        color: isSel ? "var(--accent-amber)" : "var(--text-dim)",
                        marginTop: "3px",
                        fontFamily: "var(--font-code)"
                      }}
                    >
                      {p.category}
                    </div>
                  </div>
                }
              >
                <PatternHoverCardContent pattern={p} />
              </HoverCard>
            );
          })}
        </div>
      </div>

      {/* Draggable Resizer Bar */}
      <div
        className={`workspace-resizer ${isDragging ? "dragging" : ""}`}
        onMouseDown={() => setIsDragging(true)}
        title="Drag to resize pattern list"
      />

      {/* Pattern Detail Viewer (Widescreen Reading View) */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "28px 44px",
          background: "var(--bg-study)"
        }}
      >
        {loading ? (
          <div style={{ padding: "40px", color: "var(--text-muted)", fontSize: "13px", fontFamily: "var(--font-code)" }}>
            Loading pattern analysis and architecture diagram...
          </div>
        ) : (
          <div style={{ maxWidth: "880px", margin: "0 auto" }}>
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                borderBottom: "1px solid var(--border-subtle)",
                paddingBottom: "16px",
                marginBottom: "24px"
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--accent-amber)",
                    fontFamily: "var(--font-code)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em"
                  }}
                >
                  Category: {selectedPattern?.category}
                </div>
                <h1
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "24px",
                    fontWeight: 600,
                    color: "var(--text-parchment)",
                    margin: "6px 0 0"
                  }}
                >
                  {selectedPattern?.title}
                </h1>
              </div>

              {onOpenWorkspace && (
                <button
                  type="button"
                  onClick={onOpenWorkspace}
                  className="earth-btn earth-btn-primary"
                  style={{ fontSize: "11.5px" }}
                >
                  Practice in Workspace ⌘K →
                </button>
              )}
            </div>

            {/* Markdown & Flowchart Viewer */}
            <MarkdownViewer content={patternContent} />
          </div>
        )}
      </div>
    </div>
  );
}
