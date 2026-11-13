/** [v1.0-scaffold] Initial Component Architecture **/
import React, { useState } from "react";
import { soundEngine } from "../audio/synthAudio";

export function ExtendDrawer({ question, onSaveNote }) {
  const [activeTab, setActiveTab] = useState("pyspark");
  const [pysparkInput, setPysparkInput] = useState("");
  const [validationResult, setValidationResult] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [saved, setSaved] = useState(false);

  const scaffolding = `# PySpark DataFrame Setup
from pyspark.sql import functions as F
from pyspark.sql.window import Window
`;

  const handlePysparkKeyDown = (e) => {
    const isWordEnd = e.key === " " || e.key === "Enter" || e.key === "Tab";
    soundEngine.playKeyClick(isWordEnd);
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const val = pysparkInput.substring(0, start) + "    " + pysparkInput.substring(end);
      setPysparkInput(val);
    }
  };

  const handleValidatePySpark = () => {
    const code = pysparkInput.toLowerCase();
    const checks = [];

    if (code.includes("groupby") || code.includes("group_by")) {
      checks.push("Aggregation grouping detected (.groupBy)");
    } else {
      checks.push("Missing .groupBy() for aggregation rollup");
    }

    if (code.includes("agg(") || code.includes("withcolumn")) {
      checks.push("Transformation (.agg / .withColumn) verified");
    } else {
      checks.push("Missing .agg() or .withColumn()");
    }

    if (code.includes("f.col") || code.includes("col(")) {
      checks.push("Column vectorization (F.col) used");
    } else {
      checks.push("Best practice: Use F.col('column') for Catalyst optimizer pushdown");
    }

    const passed = checks.filter(c => !c.startsWith("Missing")).length >= 2;
    if (passed) {
      soundEngine.playSuccessMusic();
    } else {
      soundEngine.playWrongSound();
    }

    setValidationResult({
      passed,
      feedback: checks
    });
  };

  const handleSaveNote = () => {
    if (!noteText.trim()) return;
    if (onSaveNote) {
      onSaveNote(noteText.trim());
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{
      padding: "16px",
      background: "var(--bg-desk)",
      border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-sm)",
      display: "grid",
      gap: "12px",
      marginTop: "16px"
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <div style={{ fontSize: "11px", color: "var(--accent-amber)", fontFamily: "var(--font-code)", textTransform: "uppercase" }}>
            Post-Solve Exploration
          </div>
          <h3 style={{ fontSize: "13.5px", color: "var(--text-parchment)", margin: "2px 0 0", fontFamily: "var(--font-heading)" }}>
            PySpark Translation & Scale Reflection
          </h3>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: "flex", gap: "4px" }}>
          {["pyspark", "scale", "followup"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="earth-btn"
              style={{
                fontSize: "10.5px",
                padding: "2px 8px",
                borderColor: activeTab === tab ? "var(--accent-amber)" : "var(--border-subtle)",
                color: activeTab === tab ? "var(--accent-amber)" : "var(--text-muted)"
              }}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Tab: PySpark Translation */}
      {activeTab === "pyspark" && (
        <div style={{ display: "grid", gap: "8px" }}>
          <div style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
            Scaffolding provided (first 2 lines). Type out the PySpark DataFrame logic manually:
          </div>

          <div style={{
            background: "#0f1013",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-sm)",
            padding: "10px",
            fontFamily: "var(--font-code)",
            fontSize: "12px"
          }}>
            <div style={{ color: "var(--accent-amber)", opacity: 0.8, whiteSpace: "pre-wrap", marginBottom: "4px" }}>
              {scaffolding}
            </div>
            <textarea
              value={pysparkInput}
              onChange={(e) => setPysparkInput(e.target.value)}
              onKeyDown={handlePysparkKeyDown}
              placeholder="# Continue typing the DataFrame transformation here...&#10;df_res = df.groupBy(...)"
              rows={5}
              style={{
                width: "100%",
                background: "transparent",
                color: "var(--text-parchment)",
                border: "none",
                outline: "none",
                fontFamily: "var(--font-code)",
                fontSize: "12px",
                lineHeight: 1.5,
                resize: "vertical"
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
