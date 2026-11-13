import React, { useState, useMemo } from "react";
import { soundEngine } from "../../audio/synthAudio";

export function QuestionTree({
  questions = [],
  activeQuestion = null,
  onSelectQuestion,
  onNextQuestion,
  onPrevQuestion,
  onRandomQuestion
}) {
  const [groupBy, setGroupBy] = useState("pattern"); // "pattern" | "company" | "difficulty"
  const [search, setSearch] = useState("");
  const [expandedFolders, setExpandedFolders] = useState(() => {
    return { "Window Functions (Ranking)": true, "Amazon": true, "medium": true, "Easy": true };
  });

  const toggleFolder = (folderName) => {
    soundEngine.playKeyClick();
    setExpandedFolders((prev) => ({
      ...prev,
      [folderName]: !prev[folderName]
    }));
  };

  // Group questions according to selected mode
  const treeData = useMemo(() => {
    const qList = search.trim()
      ? questions.filter(
          (q) =>
            q.title.toLowerCase().includes(search.toLowerCase()) ||
            (q.companies && q.companies.some((c) => c.toLowerCase().includes(search.toLowerCase()))) ||
            (q.pattern && q.pattern.some((p) => p.toLowerCase().includes(search.toLowerCase()))) ||
            (q.leetcode_id && String(q.leetcode_id).includes(search))
        )
      : questions;

    const groups = {};

    qList.forEach((q) => {
      let groupKeys = [];
      if (groupBy === "pattern") {
        groupKeys = q.pattern && q.pattern.length > 0 ? q.pattern : ["General Aggregations"];
      } else if (groupBy === "company") {
        groupKeys = q.companies && q.companies.length > 0 ? q.companies : ["FAANG & Tech"];
      } else {
        groupKeys = [q.difficulty ? q.difficulty.toUpperCase() : "GENERAL"];
      }

      groupKeys.forEach((key) => {
        if (!groups[key]) groups[key] = [];
        // Avoid duplicate in same group
        if (!groups[key].some((item) => item.id === q.id)) {
          groups[key].push(q);
        }
      });
    });

    return Object.keys(groups)
      .sort((a, b) => groups[b].length - groups[a].length)
      .map((key) => ({
        folder: key,
        items: groups[key]
      }));
  }, [questions, groupBy, search]);

  const activeIndex = activeQuestion
    ? questions.findIndex((q) => q.id === activeQuestion.id)
    : -1;

  return (
    <div
      className="reui-tree-container"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "var(--bg-desk)",
        fontFamily: "var(--font-code)",
        fontSize: "12px",
        overflow: "hidden"
      }}
    >
      {/* Top Quick Navigation Bar */}
      <div
        style={{
          padding: "10px 12px",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          background: "rgba(17, 18, 21, 0.6)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span
            style={{
              fontSize: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--accent-amber)",
              fontWeight: 600
            }}
          >
            Question Codex
          </span>
          <span style={{ fontSize: "10.5px", color: "var(--text-dim)" }}>
            {activeIndex !== -1 ? `${activeIndex + 1} / ${questions.length}` : `${questions.length} Total`}
          </span>
        </div>

        {/* Prev / Next / Random Controls */}
        <div style={{ display: "flex", gap: "6px" }}>
          <button
            type="button"
            onClick={onPrevQuestion}
            title="Previous Question (Ctrl+Left)"
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
              padding: "5px 8px",
              borderRadius: "4px",
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-parchment)",
              fontSize: "11px",
              cursor: "pointer"
            }}
          >
            <span>◀</span> Prev
          </button>

          <button
            type="button"
            onClick={onNextQuestion}
            title="Next Question (Ctrl+Right)"
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
              padding: "5px 8px",
              borderRadius: "4px",
              background: "rgba(217, 155, 67, 0.12)",
              border: "1px solid var(--accent-amber)",
              color: "var(--accent-amber)",
              fontSize: "11px",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            Next <span>▶</span>
          </button>

          <button
            type="button"
            onClick={onRandomQuestion}
            title="Random Unsolved Question"
            style={{
              padding: "5px 8px",
              borderRadius: "4px",
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-muted)",
              cursor: "pointer"
            }}
          >
            🎲
          </button>
        </div>

        {/* Group By Selector Tabs */}
        <div
          style={{
            display: "flex",
            background: "rgba(0, 0, 0, 0.3)",
            borderRadius: "4px",
            padding: "2px",
            border: "1px solid var(--border-subtle)"
          }}
        >
          {["pattern", "company", "difficulty"].map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => {
                soundEngine.playKeyClick();
                setGroupBy(mode);
              }}
              style={{
                flex: 1,
                padding: "3px 0",
                fontSize: "10px",
                textTransform: "capitalize",
                background: groupBy === mode ? "var(--bg-card)" : "transparent",
                color: groupBy === mode ? "var(--accent-amber)" : "var(--text-dim)",
                border: "none",
                borderRadius: "3px",
                cursor: "pointer"
              }}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Filter Input */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter tree questions..."
          style={{
            background: "var(--bg-input)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "4px",
            padding: "5px 8px",
            color: "var(--text-parchment)",
            fontSize: "11px",
            outline: "none"
          }}
        />
      </div>

      {/* Tree Content View */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 6px" }}>
        {treeData.length === 0 ? (
          <div style={{ padding: "20px 10px", textAlign: "center", color: "var(--text-dim)", fontSize: "11px" }}>
            No matching questions found.
          </div>
        ) : (
          treeData.map((group) => {
            const isExpanded = !!expandedFolders[group.folder] || Boolean(search);
            return (
              <div key={group.folder} style={{ marginBottom: "4px" }}>
                {/* Folder Header */}
                <div
                  onClick={() => toggleFolder(group.folder)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "5px 8px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    userSelect: "none",
                    color: isExpanded ? "var(--text-parchment)" : "var(--text-muted)",
                    background: "rgba(255, 255, 255, 0.02)",
                    fontSize: "11.5px"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)")}
                >
                  <span style={{ fontSize: "10px", color: "var(--accent-amber)", transition: "transform 0.15s ease", transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)" }}>
                    ▶
                  </span>

                  <span style={{ display: "flex", color: isExpanded ? "var(--accent-amber)" : "var(--text-dim)" }}>
                    {isExpanded ? (
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                        <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
                      </svg>
                    )}
                  </span>

                  <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontWeight: 500 }}>
                    {group.folder}
                  </span>

                  <span
                    style={{
                      fontSize: "9px",
                      background: "rgba(255, 255, 255, 0.05)",
                      color: "var(--text-dim)",
                      padding: "1px 5px",
                      borderRadius: "10px"
                    }}
                  >
                    {group.items.length}
                  </span>
                </div>

                {/* Folder Children (Questions) */}
                {isExpanded && (
                  <div
                    style={{
                      marginLeft: "14px",
                      paddingLeft: "8px",
                      borderLeft: "1px solid var(--border-subtle)",
                      marginTop: "2px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px"
                    }}
                  >
                    {group.items.map((q) => {
                      const isSel = activeQuestion?.id === q.id;
                      const isSolved = q.progress?.status === "completed" || q.user_progress?.status === "completed";
                      const grade = q.progress?.grade || q.user_progress?.grade;

                      return (
                        <div
                          key={q.id}
                          onClick={() => {
                            soundEngine.playKeyClick();
                            onSelectQuestion(q);
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "5px 8px",
                            borderRadius: "4px",
                            cursor: "pointer",
                            background: isSel ? "var(--bg-card)" : "transparent",
                            borderLeft: isSel ? "2px solid var(--accent-amber)" : "2px solid transparent",
                            transition: "background 0.1s ease"
                          }}
                          onMouseEnter={(e) => {
                            if (!isSel) e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                          }}
                          onMouseLeave={(e) => {
                            if (!isSel) e.currentTarget.style.background = "transparent";
                          }}
                        >
                          {/* Status Icon */}
                          <span style={{ fontSize: "11px", flexShrink: 0 }}>
                            {isSolved ? (
                              <span style={{ color: "#10b981", fontWeight: 700 }}>✓</span>
                            ) : (
                              <span style={{ color: "var(--text-dim)", opacity: 0.6 }}>•</span>
                            )}
                          </span>

                          {/* Title */}
                          <span
                            style={{
                              flex: 1,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              fontSize: "11px",
                              color: isSel ? "var(--text-parchment)" : isSolved ? "#94a3b8" : "var(--text-muted)",
                              fontWeight: isSel ? 600 : 400
                            }}
                            title={q.title}
                          >
                            {q.title}
                          </span>

                          {/* LeetCode ID Pill if enriched */}
                          {q.leetcode_id && (
                            <span
                              style={{
                                fontSize: "8.5px",
                                color: "var(--accent-amber)",
                                background: "rgba(217, 155, 67, 0.1)",
                                padding: "1px 4px",
                                borderRadius: "3px",
                                flexShrink: 0
                              }}
                            >
                              LC #{q.leetcode_id}
                            </span>
                          )}

                          {/* Difficulty Initial */}
                          <span
                            style={{
                              fontSize: "8.5px",
                              textTransform: "uppercase",
                              padding: "1px 4px",
                              borderRadius: "3px",
                              flexShrink: 0,
                              background:
                                q.difficulty === "easy"
                                  ? "rgba(16, 185, 129, 0.12)"
                                  : q.difficulty === "medium"
                                  ? "rgba(217, 155, 67, 0.15)"
                                  : "rgba(239, 68, 68, 0.15)",
                              color:
                                q.difficulty === "easy"
                                  ? "#10b981"
                                  : q.difficulty === "medium"
                                  ? "var(--accent-amber)"
                                  : "#ef4444"
                            }}
                          >
                            {q.difficulty ? q.difficulty[0] : "E"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
