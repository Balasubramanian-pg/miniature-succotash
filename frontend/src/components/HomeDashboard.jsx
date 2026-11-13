/** [v1.0-scaffold] Initial Component Architecture **/
import React, { useState, useEffect } from "react";
import { soundEngine } from "../audio/synthAudio";
import { SkeletonCard, SkeletonStat } from "./ui/Skeleton";

export function HomeDashboard({
  onOpenWorkspace,
  onOpenHandbook,
  onOpenLadder,
  onOpenRepo,
  onSelectQuestion
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [capyChillQuote, setCapyChillQuote] = useState("Slow is smooth, smooth is fast. Breathe and write clean CTEs.");
  const [capyClicks, setCapyClicks] = useState(0);

  const chillQuotes = [
    "Slow is smooth, smooth is fast. Breathe and write clean CTEs.",
    "A single well-indexed query solves what 100 EC2 instances cannot.",
    "The capybara is calm because his data pipelines are idempotent.",
    "Idempotent workflows and warm green tea make the best data engineers.",
    "Window functions are not scary once you realize the frame is your friend.",
    "Trust the DuckDB vectorized engine. Your logic is sound."
  ];

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
      })
      .catch((err) => console.error("Error loading dashboard data", err))
      .finally(() => setLoading(false));
  }, []);

  const handleCapyPet = () => {
    soundEngine.playPetPurr();
    setCapyClicks((prev) => prev + 1);
    const nextQuote = chillQuotes[(capyClicks + 1) % chillQuotes.length];
    setCapyChillQuote(nextQuote);
  };

  if (loading) {
    return (
      <div style={{ padding: "32px 40px", maxWidth: "1100px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
          <SkeletonStat />
          <SkeletonStat />
          <SkeletonStat />
          <SkeletonStat />
        </div>
        <SkeletonCard lines={4} />
        <SkeletonCard lines={4} />
      </div>
    );
  }

  const { profile, repository, stats, recommended_question, recommended_pattern, recent_solved } = data || {};

  return (
    <div
      className="reui-home-dashboard"
      style={{
        padding: "32px 40px 60px",
        maxWidth: "1160px",
        margin: "0 auto",
        color: "var(--text-parchment)",
        overflowY: "auto"
      }}
    >
      {/* Chill Zone & Welcome Hero */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(28, 29, 34, 0.9) 0%, rgba(22, 23, 27, 0.95) 100%)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-lg)",
          padding: "24px 28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "24px",
          marginBottom: "28px",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.35)",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div style={{ zIndex: 2, maxWidth: "680px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <span
              style={{
                fontSize: "11px",
                fontFamily: "var(--font-code)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "var(--accent-amber)",
                background: "rgba(217, 155, 67, 0.12)",
                padding: "3px 10px",
                borderRadius: "12px",
                fontWeight: 600
              }}
            >
              Chill Study Haven • {repository?.name || "StrataScratch FAANG"}
            </span>
            <span style={{ fontSize: "11px", color: "var(--text-dim)", fontFamily: "var(--font-code)" }}>
              🔥 {stats?.streak_days || 1} Day Streak
            </span>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "26px",
              fontWeight: 700,
              color: "var(--text-parchment)",
              margin: "0 0 8px"
            }}
          >
            Welcome back, {profile?.name || "Nadia"}
          </h1>

          <p
            style={{
              fontSize: "13.5px",
              color: "var(--text-muted)",
              lineHeight: 1.6,
              margin: 0
            }}
          >
            Targeting <strong style={{ color: "var(--accent-amber)" }}>{profile?.target_company || "FAANG Staff DE"}</strong>. Take a moment to breathe, review your SQL patterns, and level up with zero friction.
          </p>

          {/* Interactive Chill Mascot Pill */}
          <div
            onClick={handleCapyPet}
            title="Click to pet companion capybara"
            style={{
              marginTop: "16px",
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              background: "rgba(0, 0, 0, 0.35)",
              border: "1px solid rgba(217, 155, 67, 0.25)",
              borderRadius: "20px",
              padding: "6px 14px",
              cursor: "pointer",
              transition: "transform 0.1s ease"
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <span style={{ fontSize: "18px" }}>🦫</span>
            <span style={{ fontSize: "12px", color: "var(--accent-amber)", fontStyle: "italic", fontFamily: "var(--font-body)" }}>
              "{capyChillQuote}"
            </span>
            <span style={{ fontSize: "10px", color: "var(--text-dim)", fontFamily: "var(--font-code)" }}>
              (Petting: {capyClicks})
            </span>
          </div>
        </div>

        {/* Ambient Capybara Illustration Tile */}
        <div
          onClick={handleCapyPet}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            background: "rgba(0,0,0,0.25)",
            borderRadius: "16px",
            border: "1px solid rgba(255,255,255,0.05)",
            cursor: "pointer",
            flexShrink: 0
          }}
        >
          <div style={{ fontSize: "52px", filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.5))" }}>
            ♨️🦫🍊
          </div>
          <span style={{ fontSize: "10px", color: "var(--accent-amber)", fontFamily: "var(--font-code)", marginTop: "4px" }}>
            Onsen Spa • Pure Chill
          </span>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "16px",
          marginBottom: "28px"
        }}
      >
        {/* Stat 1: Questions Solved */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            padding: "18px 20px"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "11px", color: "var(--text-dim)", fontFamily: "var(--font-code)", textTransform: "uppercase" }}>
              Questions Completed
            </span>
            <span style={{ color: "var(--accent-amber)", fontSize: "16px" }}>⚡</span>
          </div>
          <div style={{ fontSize: "28px", fontWeight: 700, color: "var(--text-parchment)", fontFamily: "var(--font-heading)" }}>
            {stats?.solved_questions} <span style={{ fontSize: "14px", color: "var(--text-dim)", fontWeight: 400 }}>/ {stats?.total_questions}</span>
          </div>
          <div style={{ marginTop: "10px", height: "5px", background: "rgba(255,255,255,0.06)", borderRadius: "4px", overflow: "hidden" }}>
            <div
              style={{
                width: `${stats?.solve_percentage || 0}%`,
                height: "100%",
                background: "linear-gradient(90deg, #d99b43 0%, #10b981 100%)",
                borderRadius: "4px"
              }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10.5px", color: "var(--text-dim)", marginTop: "6px", fontFamily: "var(--font-code)" }}>
            <span>{stats?.solve_percentage}% Completed</span>
            <span style={{ color: "#10b981" }}>Active</span>
          </div>
        </div>

        {/* Stat 2: Patterns Mastered */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            padding: "18px 20px"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "11px", color: "var(--text-dim)", fontFamily: "var(--font-code)", textTransform: "uppercase" }}>
              Patterns Mastered
            </span>
            <span style={{ color: "var(--accent-amber)", fontSize: "16px" }}>📖</span>
          </div>
          <div style={{ fontSize: "28px", fontWeight: 700, color: "var(--text-parchment)", fontFamily: "var(--font-heading)" }}>
            {stats?.patterns_solved} <span style={{ fontSize: "14px", color: "var(--text-dim)", fontWeight: 400 }}>/ {stats?.patterns_total || 89}</span>
          </div>
          <div style={{ marginTop: "10px", height: "5px", background: "rgba(255,255,255,0.06)", borderRadius: "4px", overflow: "hidden" }}>
            <div
              style={{
                width: `${stats?.patterns_percentage || 0}%`,
                height: "100%",
                background: "var(--accent-amber)",
                borderRadius: "4px"
              }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10.5px", color: "var(--text-dim)", marginTop: "6px", fontFamily: "var(--font-code)" }}>
            <span>{stats?.patterns_percentage}% Patterns Unlocked</span>
            <span style={{ color: "var(--accent-amber)", cursor: "pointer" }} onClick={onOpenHandbook}>Explore Codex ⌘B →</span>
          </div>
        </div>

        {/* Stat 3: Career Ladder Tier */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            padding: "18px 20px"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "11px", color: "var(--text-dim)", fontFamily: "var(--font-code)", textTransform: "uppercase" }}>
              Career Ladder Tier
            </span>
            <span style={{ color: "var(--accent-amber)", fontSize: "16px" }}>🧗</span>
          </div>
          <div style={{ fontSize: "22px", fontWeight: 700, color: "var(--accent-amber)", fontFamily: "var(--font-heading)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {stats?.current_tier} • {stats?.current_tier_name}
          </div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "8px" }}>
            XP Earned: <strong style={{ color: "var(--text-parchment)" }}>{stats?.xp} XP</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10.5px", color: "var(--accent-amber)", marginTop: "8px", fontFamily: "var(--font-code)", cursor: "pointer" }} onClick={onOpenLadder}>
            <span>View Valhalla Skill Tree ⌘L →</span>
          </div>
        </div>

        {/* Stat 4: Active Repository Status */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            padding: "18px 20px"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "11px", color: "var(--text-dim)", fontFamily: "var(--font-code)", textTransform: "uppercase" }}>
              Active Repository
            </span>
            <span style={{ color: "#10b981", fontSize: "16px" }}>●</span>
          </div>
          <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-parchment)", fontFamily: "var(--font-heading)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {repository?.name}
          </div>
          <div style={{ fontSize: "11px", color: "var(--text-dim)", marginTop: "6px", fontFamily: "var(--font-code)" }}>
            Branch: <span style={{ color: "var(--text-parchment)" }}>{repository?.branch || "main"}</span> • DuckDB In-Memory
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10.5px", color: "var(--accent-amber)", marginTop: "12px", fontFamily: "var(--font-code)", cursor: "pointer" }} onClick={onOpenRepo}>
            <span>Change / Connect Repo →</span>
          </div>
        </div>
      </div>

      {/* Two Column Recommendations Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: "20px", marginBottom: "28px" }}>
        
        {/* Recommendation 1: Question Recommendation */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--accent-amber)",
            borderRadius: "var(--radius-md)",
            padding: "22px 24px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.4)"
          }}
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <span
                style={{
                  fontSize: "10.5px",
                  fontFamily: "var(--font-code)",
                  textTransform: "uppercase",
                  color: "var(--accent-amber)",
                  fontWeight: 600,
                  letterSpacing: "0.05em"
                }}
              >
                🎯 Suggested Next Question
              </span>
              <span
                style={{
                  fontSize: "10px",
                  fontFamily: "var(--font-code)",
                  background: "rgba(217, 155, 67, 0.15)",
                  color: "var(--accent-amber)",
                  padding: "2px 8px",
                  borderRadius: "10px"
                }}
              >
                High Interview Frequency
              </span>
            </div>

            <h3
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "18px",
                fontWeight: 600,
                color: "var(--text-parchment)",
                margin: "0 0 10px",
                lineHeight: 1.3
              }}
            >
              {recommended_question?.title || "Department Top Three Salaries"}
            </h3>

            {/* Badges: LeetCode equivalent + Company + Difficulty */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "14px" }}>
              {recommended_question?.leetcode_id && (
                <span style={{ fontSize: "11px", background: "rgba(217, 155, 67, 0.15)", color: "var(--accent-amber)", padding: "2px 8px", borderRadius: "4px", fontFamily: "var(--font-code)" }}>
                  LeetCode #{recommended_question.leetcode_id}
                </span>
              )}
              {recommended_question?.companies?.slice(0, 3).map((comp) => (
                <span key={comp} style={{ fontSize: "11px", background: "rgba(255, 255, 255, 0.05)", color: "var(--text-muted)", padding: "2px 8px", borderRadius: "4px", fontFamily: "var(--font-code)" }}>
                  {comp}
                </span>
              ))}
              <span
                style={{
                  fontSize: "11px",
                  textTransform: "capitalize",
                  background: recommended_question?.difficulty === "hard" ? "rgba(239, 68, 68, 0.15)" : "rgba(217, 155, 67, 0.15)",
                  color: recommended_question?.difficulty === "hard" ? "#ef4444" : "var(--accent-amber)",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  fontFamily: "var(--font-code)"
                }}
              >
                {recommended_question?.difficulty || "Medium"}
              </span>
            </div>

            <p style={{ fontSize: "12.5px", color: "var(--text-dim)", lineHeight: 1.6, margin: 0 }}>
              Based on your preparation profile, tackling this question reinforces your dense ranking window partition logic required in FAANG interviews.
            </p>
          </div>

          <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
            <button
              type="button"
