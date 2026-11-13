import React, { useState, useEffect } from "react";
import { soundEngine } from "../audio/synthAudio";
import {
  Flame,
  VolumeX,
  Keyboard,
  Music,
  Pause,
  Play,
  Square,
  Search,
  GitBranch,
  Home,
  Terminal,
  BookOpen,
  TrendingUp
} from "lucide-react";

export function Nav({
  activeTab,
  onTabChange,
  currentLanguage = "SQL",
  onLanguageChange,
  onOpenHandbook,
  onOpenSearch,
  onOpenRepo,
  repoName = "StrataScratch",
  currentTier = "L0",
  streakDays = 1
}) {
  const [muted, setMuted] = useState(soundEngine.isMuted());
  const [isMusicPlaying, setIsMusicPlaying] = useState(soundEngine.isMusicPlaying);

  useEffect(() => {
    return soundEngine.subscribe((playing) => {
      setIsMusicPlaying(playing);
    });
  }, []);

  const handleMuteToggle = () => {
    const isNowMuted = soundEngine.toggleMute();
    setMuted(isNowMuted);
  };

  return (
    <header className="earth-nav">
      {/* Brand */}
      <div className="earth-brand" onClick={() => onTabChange("home")} style={{ cursor: "pointer" }}>
        <span className="earth-logo">RAILS</span>
        <span className="earth-tag">Data Engineering Interview Engine</span>
      </div>

      {/* Center Navigation Tabs with Home-Row Keyboard Shortcuts */}
      <div className="earth-tabs">
        <button
          className={`earth-tab ${activeTab === "home" ? "active" : ""}`}
          onClick={() => onTabChange("home")}
          title="Home Dashboard & Chill Zone (⌘H)"
        >
          <Home size={13} style={{ marginRight: 5, verticalAlign: "middle" }} />
          <span>Home</span>
          <span className="earth-shortcut-badge">⌘H</span>
        </button>

        <button
          className={`earth-tab ${activeTab === "workspace" ? "active" : ""}`}
          onClick={() => onTabChange("workspace")}
          title="LeetCode-Style Typing & DuckDB Workspace (⌘K)"
        >
          <Terminal size={13} style={{ marginRight: 5, verticalAlign: "middle" }} />
          <span>Workspace</span>
          <span className="earth-shortcut-badge">⌘K</span>
        </button>

        <button
          className={`earth-tab ${activeTab === "handbook" ? "active" : ""}`}
          onClick={() => onTabChange("handbook")}
          title="Open SQL & PySpark Pattern Codex (⌘B)"
        >
          <BookOpen size={13} style={{ marginRight: 5, verticalAlign: "middle" }} />
          <span>Handbook</span>
          <span className="earth-shortcut-badge">⌘B</span>
        </button>

        <button
          className={`earth-tab ${activeTab === "ladder" ? "active" : ""}`}
          onClick={() => onTabChange("ladder")}
          title="Career Progression Skill Tree (⌘L)"
        >
          <TrendingUp size={13} style={{ marginRight: 5, verticalAlign: "middle" }} />
          <span>Ladder</span>
          <span className="earth-shortcut-badge">⌘L</span>
        </button>
      </div>

      {/* Right Controls */}
      <div className="earth-actions">
        {/* Active Repo Connect Button */}
        {onOpenRepo && (
          <button
            className="earth-btn"
            onClick={onOpenRepo}
            title="Connect Custom GitHub Repository / Plug & Play"
            style={{ fontSize: "11px", display: "flex", alignItems: "center", gap: "6px" }}
          >
            <GitBranch size={13} style={{ color: "#10b981" }} />
            <span style={{ color: "var(--text-parchment)" }}>{repoName}</span>
          </button>
        )}

        {/* Streak Counter */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
          fontSize: "11px",
          color: "var(--accent-amber)",
          fontFamily: "var(--font-code)",
          background: "var(--accent-amber-dim)",
          padding: "3px 8px",
          borderRadius: "var(--radius-sm)"
        }}>
          <Flame size={13} style={{ color: "#f59e0b" }} />
          <span>{streakDays} Day Streak</span>
        </div>

        {/* Dialect Selector */}
        <button
          className="earth-btn"
          onClick={() => {
            if (onLanguageChange) {
              onLanguageChange(currentLanguage === "SQL" ? "PYSPARK" : "SQL");
            }
          }}
          title="Switch SQL / PySpark dialect"
        >
          <span style={{ color: "var(--text-dim)" }}>Dialect:</span>
          <span style={{ color: "var(--text-parchment)", fontWeight: 500 }}>{currentLanguage}</span>
        </button>

        {/* Mechanical Switch Sound Toggle */}
        <button
          className="earth-btn"
          onClick={handleMuteToggle}
          title={muted ? "Unmute mechanical keyboard sound" : "Mute mechanical keyboard sound"}
          style={{ display: "flex", alignItems: "center", gap: "5px" }}
        >
          {muted ? <VolumeX size={13} /> : <Keyboard size={13} />}
          <span>{muted ? "Sound: Off" : "Sound: On"}</span>
        </button>

        {/* Victory Music Track Pill */}
        {isMusicPlaying && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "11px",
            fontFamily: "var(--font-code)",
            color: "var(--accent-amber)",
            background: "var(--accent-amber-dim)",
            border: "1px solid var(--accent-amber)",
            padding: "2px 8px",
            borderRadius: "var(--radius-sm)"
          }}>
            <Music size={12} />
            <span>Shooting Star</span>
            <button
              onClick={() => soundEngine.toggleMusicPlayback()}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-parchment)",
                cursor: "pointer",
                padding: "0 2px",
                display: "flex",
                alignItems: "center"
              }}
              title="Pause/Resume"
            >
              <Pause size={11} />
            </button>
            <button
              onClick={() => soundEngine.stopSuccessMusic()}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-dim)",
                cursor: "pointer",
                padding: "0 2px",
                display: "flex",
                alignItems: "center"
              }}
              title="Stop track"
            >
              <Square size={10} fill="currentColor" />
            </button>
          </div>
        )}

        {/* Question Search Shortcut */}
        <span
          className="earth-shortcut-badge"
          onClick={onOpenSearch}
          title="Fuzzy search problems (Ctrl+P)"
          style={{ padding: "4px 8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
        >
          <Search size={11} />
          <span>⌘P Search</span>
        </span>
      </div>
    </header>
  );
}
