/** [v1.0-scaffold] Initial Component Architecture **/
import React, { useState, useEffect, useRef } from "react";
import { soundEngine } from "../audio/synthAudio";

export function GhostEditor({
  targetCode,
  questionId,
  difficulty,
  onComplete,
  onKeystroke,
  onPasteAttempt
}) {
  const [inputCode, setInputCode] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [isFocused, setIsFocused] = useState(true);
  const textareaRef = useRef(null);

  const normalizedTarget = (targetCode || "").replace(/\r\n/g, "\n").trim();

  useEffect(() => {
    setInputCode("");
    setStartTime(null);
    setErrorCount(0);
    setCombo(0);
    setMaxCombo(0);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [targetCode]);

  const handleInput = (e) => {
    const val = e.target.value;
    
    if (!startTime) {
      setStartTime(Date.now());
    }

    const targetChar = normalizedTarget[val.length - 1];
    const typedChar = val[val.length - 1];

    if (val.length > inputCode.length) {
      const isWordEnd = typedChar === " " || typedChar === "\n";
      if (typedChar === targetChar) {
        soundEngine.playKeyClick(isWordEnd);
        const nextCombo = combo + 1;
        setCombo(nextCombo);
        if (nextCombo > maxCombo) setMaxCombo(nextCombo);
        if (onKeystroke) onKeystroke(wpm, nextCombo);
      } else {
        soundEngine.playError();
        setErrorCount(prev => prev + 1);
        setCombo(0);
        if (onKeystroke) onKeystroke(wpm, 0);
      }
    } else {
      soundEngine.playKeyClick();
      if (onKeystroke) onKeystroke(wpm, combo);
    }

    setInputCode(val);

    if (startTime) {
      const elapsedMins = (Date.now() - startTime) / 60000;
      if (elapsedMins > 0) {
        const words = val.length / 5;
        setWpm(Math.round(words / elapsedMins));
      }
    }

    // Check completion
    if (val.length >= normalizedTarget.length && val === normalizedTarget) {
      soundEngine.playSuccessMusic(); // Aero Chord - Shooting Star [oh baby a triple drop]
      const elapsedSec = Math.round((Date.now() - (startTime || Date.now())) / 1000);
      if (onComplete) {
        onComplete({
          mode: "pair",
          grade: "D",
          wpm: Math.max(wpm, 45),
          streak: Math.max(maxCombo, combo, 20),
          elapsedSeconds: elapsedSec,
          completedCode: val
        });
      }
    }
  };

  const handleKeyDown = (e) => {
    // Intercept Paste (Ctrl+V / Cmd+V)
    if ((e.ctrlKey || e.metaKey) && (e.key === "v" || e.key === "V")) {
      e.preventDefault();
      soundEngine.playWrongSound(); // Fahhh!
      if (onPasteAttempt) onPasteAttempt();
      return;
    }

    // Tab autocomplete
    if (e.key === "Tab") {
      e.preventDefault();
      const nextChar = normalizedTarget[inputCode.length];
      if (nextChar === " " || nextChar === "\t") {
        let spaces = "";
        let idx = inputCode.length;
        while (idx < normalizedTarget.length && (normalizedTarget[idx] === " " || normalizedTarget[idx] === "\t") && spaces.length < 4) {
          spaces += normalizedTarget[idx];
          idx++;
        }
        const newVal = inputCode + (spaces || "    ");
        setInputCode(newVal);
        soundEngine.playKeyClick();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    soundEngine.playError();
    if (onPasteAttempt) onPasteAttempt();
  };

  const targetChars = normalizedTarget.split("");
  const inputChars = inputCode.split("");

  const totalLines = Math.max(1, normalizedTarget.split("\n").length);
  const lineNumbers = Array.from({ length: totalLines }, (_, i) => i + 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#0f1013" }}>
      
      {/* Top Status Ribbon */}
      <div className="editor-top-ribbon">
        <div className="editor-ribbon-stat">
          <span>Cadence:</span>
          <span className="editor-ribbon-val" style={{ color: "var(--accent-amber)" }}>{wpm || 0} WPM</span>
        </div>

        <div className="editor-ribbon-stat">
          <span>Streak:</span>
          <span className="editor-ribbon-val">{combo}x</span>
        </div>

        <div className="editor-ribbon-stat" style={{ color: "var(--text-dim)" }}>
          <span>Accuracy:</span>
          <span className="editor-ribbon-val" style={{ color: errorCount === 0 ? "var(--accent-sage)" : "var(--accent-terracotta)" }}>
            {Math.max(0, Math.round(100 - (errorCount / (inputCode.length || 1)) * 100))}%
          </span>
        </div>

        <span style={{ marginLeft: "auto", color: "var(--accent-amber)", fontFamily: "var(--font-code)", fontSize: "11px" }}>
          Muscle Drill · Grade D Capped
        </span>
      </div>

      {/* Viewport with Warm Parchment Typing and Amber Caret */}
      <div
        onClick={() => textareaRef.current?.focus()}
        style={{
          flex: 1,
          position: "relative",
          display: "flex",
          overflowY: "auto",
          padding: "20px 24px",
          fontFamily: "var(--font-code)",
          fontSize: "13.5px",
          lineHeight: 1.6,
          cursor: "text"
        }}
      >
        {/* Invisible active textarea */}
        <textarea
          ref={textareaRef}
          value={inputCode}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          rows={totalLines + 4}
          spellCheck={false}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            background: "transparent",
            color: "transparent",
            caretColor: "transparent",
            border: "none",
            outline: "none",
