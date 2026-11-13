import React, { useState, useEffect } from "react";
import { soundEngine } from "../audio/synthAudio";
import { Music, Pause, Play, Square, Lightbulb } from "lucide-react";

export function CompletionModal({
  isOpen,
  question,
  stats,
  completedCode,
  onClose,
  onNextQuestion
}) {
  const [reflectionNote, setReflectionNote] = useState("");
  const [noteSaved, setNoteSaved] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(soundEngine.isMusicPlaying);

  useEffect(() => {
    return soundEngine.subscribe((playing) => {
      setIsPlayingMusic(playing);
    });
  }, []);

  if (!isOpen || !question) return null;

  const mode = stats?.mode || "pair";
  const grade = stats?.grade || (mode === "pair" ? "D" : "A");
  const wpm = stats?.wpm || 55;
  const elapsedSec = stats?.elapsedSeconds || 140;
  const elapsedMins = Math.floor(elapsedSec / 60);
  const remainingSecs = elapsedSec % 60;
  const timeFormatted = `${elapsedMins}m ${remainingSecs}s`;

  const codeLines = (completedCode || question.canonical_solution || "").split("\n");

  const handleSaveReflection = () => {
    if (!reflectionNote.trim()) {
      if (onNextQuestion) onNextQuestion();
      return;
    }

    fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question_id: question.id,
        difficulty: question.difficulty,
        mode: mode,
        grade: grade,
        mistake_note: reflectionNote.trim()
      })
    })
      .then(() => {
        setNoteSaved(true);
        setTimeout(() => {
          if (onNextQuestion) onNextQuestion();
        }, 600);
      })
      .catch(() => {
        if (onNextQuestion) onNextQuestion();
      });
  };

  return (
    <div className="postmortem-overlay" onClick={onClose}>
      <div className="postmortem-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
          <div>
            <div style={{
              fontSize: "11px",
              fontFamily: "var(--font-code)",
              color: "var(--accent-amber)",
              textTransform: "uppercase",
              letterSpacing: "0.06em"
            }}>
              Engineering Reflection Log
            </div>
            
            <h2 style={{
              fontFamily: "var(--font-heading)",
              fontSize: "18px",
              fontWeight: 600,
              color: "var(--text-parchment)",
              margin: "4px 0 0"
            }}>
              {question.title}
            </h2>

            {/* Grounded Real Learning Metrics */}
            <div style={{ display: "flex", gap: "20px", marginTop: "12px", fontSize: "12px", flexWrap: "wrap" }}>
              <div>
                <span style={{ color: "var(--text-dim)" }}>Time to Solve: </span>
                <span style={{ color: "var(--text-parchment)", fontFamily: "var(--font-code)", fontWeight: 500 }}>
                  {timeFormatted}
                </span>
              </div>

              <div>
                <span style={{ color: "var(--text-dim)" }}>Typing Fluency: </span>
                <span style={{ color: "var(--text-parchment)", fontFamily: "var(--font-code)", fontWeight: 500 }}>
                  {wpm} WPM
                </span>
              </div>

              <div>
                <span style={{ color: "var(--text-dim)" }}>Method: </span>
                <span style={{ color: mode === "pair" ? "var(--accent-amber)" : "var(--accent-sage)", fontWeight: 500 }}>
                  {mode === "pair" ? "Pair Drill (Grade D Capped)" : "Autonomous Recall (Grade A)"}
                </span>
              </div>
            </div>

            {/* Victory Track Music Player Pill */}
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              marginTop: "10px",
              background: "var(--accent-amber-dim)",
              border: "1px solid var(--accent-amber)",
              padding: "3px 10px",
              borderRadius: "16px",
              fontSize: "11px",
              fontFamily: "var(--font-code)",
              color: "var(--accent-amber)"
            }}>
              <Music size={12} />
              <span>Aero Chord - Shooting Star</span>
              <button
                onClick={() => soundEngine.toggleMusicPlayback()}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--text-parchment)",
                  cursor: "pointer",
                  fontSize: "11px",
                  padding: "0 4px",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center"
                }}
              >
                {isPlayingMusic ? (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}><Pause size={10} /> Pause</span>
                ) : (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}><Play size={10} /> Resume</span>
                )}
              </button>
              <button
                onClick={() => soundEngine.stopSuccessMusic()}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--text-dim)",
                  cursor: "pointer",
                  fontSize: "11px",
                  padding: "0 2px",
                  display: "flex",
                  alignItems: "center"
                }}
                title="Stop music"
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}><Square size={9} fill="currentColor" /> Stop</span>
              </button>
            </div>
          </div>

          {/* Grade Badge */}
          <div style={{ textAlign: "right" }}>
            <div style={{
              fontFamily: "var(--font-heading)",
              fontSize: "2.4rem",
              fontWeight: 700,
              color: grade === "A" ? "var(--accent-sage)" : "var(--accent-amber)",
              lineHeight: 1
            }}>
              {grade}
            </div>
            <div style={{ fontSize: "10px", color: "var(--text-dim)", marginTop: "2px" }}>
              {grade === "D" ? "Muscle Memory Drill" : "Autonomous Pass"}
            </div>
          </div>
        </div>

        {/* Clean Code Output Viewport */}
        <div style={{
          background: "#131417",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-sm)",
          padding: "14px 16px",
          maxHeight: "200px",
          overflowY: "auto",
          fontFamily: "var(--font-code)",
          fontSize: "12px",
          lineHeight: 1.6,
          color: "var(--text-parchment)"
        }}>
          {codeLines.map((line, idx) => (
            <div key={idx} style={{ display: "flex" }}>
              <span style={{ width: "30px", color: "var(--text-dim)", userSelect: "none" }}>
                {idx + 1}
              </span>
              <span style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
                {line}
              </span>
            </div>
          ))}
        </div>

        {/* Human Post-Mortem Question */}
        <div style={{ marginTop: "16px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", color: "var(--text-muted)", marginBottom: "6px" }}>
            <Lightbulb size={12} style={{ color: "var(--accent-amber)" }} />
            <span>What caught you off guard on this problem? (1 sentence for future recall)</span>
          </label>
          <input
            type="text"
            value={reflectionNote}
            onChange={(e) => setReflectionNote(e.target.value)}
            onKeyDown={(e) => {
              const isWordEnd = e.key === " " || e.key === "Enter";
              soundEngine.playKeyClick(isWordEnd);
            }}
            placeholder="e.g. Remember to cast conversions to FLOAT before division to prevent integer truncation..."
            style={{
              width: "100%",
              background: "var(--bg-input)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-sm)",
              padding: "8px 12px",
              color: "var(--text-parchment)",
              fontFamily: "var(--font-body)",
              fontSize: "12px",
              outline: "none"
            }}
          />
        </div>

        {/* Action Controls */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "18px" }}>
          <button
            onClick={onClose}
            className="earth-btn"
          >
            Review Problem Spec
          </button>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleSaveReflection}
              className="earth-btn earth-btn-primary"
            >
              {noteSaved ? "Saved! Loading Next..." : "Save Note & Next Problem →"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
