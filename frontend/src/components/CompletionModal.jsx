/** [v1.0-scaffold] Initial Component Architecture **/
import React, { useState, useEffect } from "react";
import { soundEngine } from "../audio/synthAudio";

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
              gap: "8px",
              marginTop: "10px",
              background: "var(--accent-amber-dim)",
              border: "1px solid var(--accent-amber)",
              padding: "3px 10px",
              borderRadius: "16px",
              fontSize: "11px",
              fontFamily: "var(--font-code)",
              color: "var(--accent-amber)"
            }}>
              <span>🎶 Aero Chord - Shooting Star</span>
              <button
                onClick={() => soundEngine.toggleMusicPlayback()}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--text-parchment)",
                  cursor: "pointer",
                  fontSize: "11px",
                  padding: "0 4px",
                  fontWeight: 600
                }}
              >
                {isPlayingMusic ? "⏸ Pause" : "▶ Resume"}
              </button>
              <button
                onClick={() => soundEngine.stopSuccessMusic()}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--text-dim)",
                  cursor: "pointer",
                  fontSize: "11px",
                  padding: "0 2px"
                }}
                title="Stop music"
              >
                ⏹ Stop
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

