import React, { useState, useEffect } from "react";
import { soundEngine } from "../audio/synthAudio";
import { SkeletonCard, SkeletonStat } from "./ui/Skeleton";
import {
  Flame,
  Zap,
  BookOpen,
  TrendingUp,
  Target,
  BookmarkCheck,
  Check,
  Activity,
  ArrowRight,
  Sparkles
} from "lucide-react";

// Crisp handcrafted vector illustration of a relaxing Onsen bath with Capybara
export function OnsenCapybaraIllustration({ size = 96, isPetting = false }) {
  return (
    <svg width={size} height={size * 0.8} viewBox="0 0 120 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Ambient Onsen Steam Waves */}
      <path d="M42 22 Q46 14 42 6 Q38 -2 43 -8" stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />
      <path d="M58 20 Q62 12 58 4 Q54 -4 59 -10" stroke="rgba(255,255,255,0.55)" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="4 4" />
      <path d="M74 24 Q78 16 74 8 Q70 0 75 -6" stroke="rgba(255,255,255,0.4)" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="3 3" />

      {/* Wooden Onsen Tub Rim (Back) */}
      <ellipse cx="60" cy="56" rx="52" ry="16" fill="#4a301d" stroke="#2c1a0e" strokeWidth="2" />
      
      {/* Onsen Hot Spring Water */}
      <ellipse cx="60" cy="57" rx="50" ry="14" fill="#0284c7" fillOpacity="0.45" />
      <ellipse cx="60" cy="57" rx="46" ry="12" fill="#38bdf8" fillOpacity="0.25" />

      {/* Capybara in the Tub */}
      <g transform={isPetting ? "translate(0, 2) scale(1.02)" : "translate(0, 0)"} style={{ transition: "transform 0.15s ease" }}>
        {/* Capybara Body submerged */}
        <path d="M38 64 C38 46 50 42 62 42 C74 42 84 46 84 64" fill="#8c5835" />
        
        {/* Head */}
        <path d="M48 44 C48 30 54 26 68 26 C78 26 82 32 82 44 C82 50 74 54 64 54 C52 54 48 50 48 44 Z" fill="#9e663e" />
        
        {/* Cute Rounded Ear */}
        <ellipse cx="52" cy="30" rx="3.5" ry="4.5" fill="#6a3e1f" />
        <ellipse cx="52" cy="30" rx="2" ry="2.5" fill="#422511" />

        {/* Relaxed Snout / Nose */}
        <path d="M74 38 C76 38 78 40 78 42 C78 45 75 47 72 47 C69 47 67 45 67 42 C67 40 71 38 74 38 Z" fill="#523018" />
        <circle cx="76" cy="41" r="1" fill="#201108" />

        {/* Closed Zen / Peaceful Eyes (^ ^) */}
        <path d="M59 36 Q63 32 67 36" stroke="#2c170b" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Rosy Cheek */}
        <circle cx="63" cy="42" r="3" fill="#f43f5e" fillOpacity="0.4" />

        {/* Japanese Yuzu Citrus Fruit on Head */}
        <g transform="translate(62, 16)">
          <circle cx="6" cy="7" r="6" fill="#f59e0b" stroke="#d97706" strokeWidth="0.8" />
          <circle cx="4.5" cy="5.5" r="1.8" fill="#fef08a" fillOpacity="0.6" />
          <path d="M6 1.5 C6 0.2 7.5 -0.5 8.5 0" stroke="#15803d" strokeWidth="1.2" strokeLinecap="round" />
          <ellipse cx="9" cy="0.5" rx="2" ry="1.1" fill="#22c55e" transform="rotate(-15 9 0.5)" />
        </g>
      </g>

      {/* Wooden Tub (Front Slat / Rim) */}
      <path d="M8 56 C8 68 31 78 60 78 C89 78 112 68 112 56 C112 70 89 88 60 88 C31 88 8 70 8 56 Z" fill="#6d472b" stroke="#3b2111" strokeWidth="2" />
      {/* Metal Tub Hoops */}
      <path d="M12 66 C24 74 42 78 60 78 C78 78 96 74 108 66" stroke="#94a3b8" strokeWidth="2" fill="none" />
      <path d="M18 78 C30 84 45 86 60 86 C75 86 90 84 102 78" stroke="#64748b" strokeWidth="1.6" fill="none" />

      {/* Floating Yuzu in Water */}
      <circle cx="34" cy="62" r="4" fill="#f59e0b" stroke="#b45309" strokeWidth="0.6" />
      <ellipse cx="36" cy="59" rx="1.2" ry="0.6" fill="#22c55e" />
    </svg>
  );
}

// Small Capybara Silhouette Icon for Badges
export function CapybaraIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M5 16C5 12 8 10 13 10C17 10 19 12 19 16C19 19 16 20 12 20C7 20 5 19 5 16Z" fill="#a47148" />
      <path d="M11 9C11 6.5 13.5 5 16.5 5C19 5 20.5 7 20.5 10C20.5 13 18.5 14 15.5 14C12.5 14 11 11.5 11 9Z" fill="#b07d53" />
      <ellipse cx="19.5" cy="10" rx="1.2" ry="1.6" fill="#6d4327" />
      <path d="M15 8 Q16 6.5 17.5 8" stroke="#3b2012" strokeWidth="1" strokeLinecap="round" fill="none" />
      <circle cx="16.5" cy="3" r="2" fill="#f59e0b" />
    </svg>
  );
}

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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "20px" }}>
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  const { profile, repository, stats, recommended_question, recommended_pattern, recent_solved } = data || {};

  return (
    <div className="earth-dashboard" style={{ padding: "32px 40px", maxWidth: "1200px", margin: "0 auto" }}>
      
      {/* Hero Chill Zone Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(217, 155, 67, 0.08) 0%, rgba(17, 18, 21, 0.95) 100%)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-lg)",
          padding: "28px 32px",
          marginBottom: "28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div style={{ maxWidth: "640px", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
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
            <span style={{ fontSize: "11px", color: "var(--text-dim)", fontFamily: "var(--font-code)", display: "flex", alignItems: "center", gap: "4px" }}>
              <Flame size={12} style={{ color: "#f59e0b" }} />
              <span>{stats?.streak_days || 1} Day Streak</span>
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
            <CapybaraIcon size={18} />
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
            padding: "16px 20px",
            background: "rgba(0,0,0,0.25)",
            borderRadius: "16px",
            border: "1px solid rgba(255,255,255,0.05)",
            cursor: "pointer",
            flexShrink: 0
          }}
        >
          <OnsenCapybaraIllustration size={88} isPetting={false} />
          <span style={{ fontSize: "10px", color: "var(--accent-amber)", fontFamily: "var(--font-code)", marginTop: "8px" }}>
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
            <Zap size={15} style={{ color: "var(--accent-amber)" }} />
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
            <span>{stats?.solve_percentage}% Complete</span>
            <span style={{ color: "var(--accent-amber)", cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }} onClick={onOpenWorkspace}>
              Practice ⌘K <ArrowRight size={10} />
            </span>
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
            <BookOpen size={15} style={{ color: "var(--accent-amber)" }} />
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
            <span style={{ color: "var(--accent-amber)", cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }} onClick={onOpenHandbook}>
              Explore Codex ⌘B <ArrowRight size={10} />
            </span>
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
            <TrendingUp size={15} style={{ color: "var(--accent-amber)" }} />
          </div>
          <div style={{ fontSize: "22px", fontWeight: 700, color: "var(--accent-amber)", fontFamily: "var(--font-heading)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {stats?.current_tier} • {stats?.current_tier_name}
          </div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "8px" }}>
            XP Earned: <strong style={{ color: "var(--text-parchment)" }}>{stats?.xp} XP</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10.5px", color: "var(--accent-amber)", marginTop: "8px", fontFamily: "var(--font-code)", cursor: "pointer" }} onClick={onOpenLadder}>
            <span style={{ display: "flex", alignItems: "center", gap: 3 }}>View Valhalla Skill Tree ⌘L <ArrowRight size={10} /></span>
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
            <Activity size={15} style={{ color: "#10b981" }} />
          </div>
          <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-parchment)", fontFamily: "var(--font-heading)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {repository?.name}
          </div>
          <div style={{ fontSize: "11px", color: "var(--text-dim)", marginTop: "6px", fontFamily: "var(--font-code)" }}>
            Branch: <span style={{ color: "var(--text-parchment)" }}>{repository?.branch || "main"}</span> • DuckDB In-Memory
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10.5px", color: "var(--accent-amber)", marginTop: "12px", fontFamily: "var(--font-code)", cursor: "pointer" }} onClick={onOpenRepo}>
            <span style={{ display: "flex", alignItems: "center", gap: 3 }}>Change / Connect Repo <ArrowRight size={10} /></span>
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
                  letterSpacing: "0.05em",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px"
                }}
              >
                <Target size={14} />
                <span>Suggested Next Question</span>
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
              {recommended_question?.title || "Amazon - Top 5 Revenue Product Categories for Q1"}
            </h3>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "14px" }}>
              <span style={{ fontSize: "11px", background: "rgba(16, 185, 129, 0.12)", color: "#10b981", padding: "2px 8px", borderRadius: "4px", fontFamily: "var(--font-code)" }}>
                {recommended_question?.difficulty?.toUpperCase() || "EASY"}
              </span>
              <span style={{ fontSize: "11px", background: "rgba(255, 255, 255, 0.05)", color: "var(--text-muted)", padding: "2px 8px", borderRadius: "4px", fontFamily: "var(--font-code)" }}>
                Tier {recommended_question?.tier || "L1"}
              </span>
              {recommended_question?.companies?.map((comp) => (
                <span key={comp} style={{ fontSize: "11px", background: "rgba(217, 155, 67, 0.12)", color: "var(--accent-amber)", padding: "2px 8px", borderRadius: "4px", fontFamily: "var(--font-code)" }}>
                  {comp}
                </span>
              ))}
            </div>

            <p style={{ fontSize: "12.5px", color: "var(--text-dim)", lineHeight: 1.6, margin: 0 }}>
              Associated with <strong>LeetCode #{recommended_question?.leetcode_id || 321}</strong>. Great for building muscle memory on Window Ranking and Aggregation logic under timed pressure.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <button
              type="button"
              onClick={() => {
                soundEngine.playKeyClick();
                if (onSelectQuestion && recommended_question) {
                  onSelectQuestion(recommended_question);
                } else {
                  onOpenWorkspace();
                }
              }}
              style={{
                flex: 1,
                padding: "10px 16px",
                background: "var(--accent-amber)",
                color: "#111",
                border: "none",
                borderRadius: "var(--radius-sm)",
                fontWeight: 600,
                fontSize: "12px",
                fontFamily: "var(--font-code)",
                cursor: "pointer",
                transition: "all 0.15s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
            >
              <span>Solve in Solo Engine</span>
              <ArrowRight size={13} />
            </button>

            {recommended_question?.leetcode_url && (
              <a
                href={recommended_question.leetcode_url}
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: "10px 14px",
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-sm)",
                  color: "var(--text-muted)",
                  fontSize: "12px",
                  fontFamily: "var(--font-code)",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
                title="View original problem on LeetCode"
              >
                LeetCode ↗
              </a>
            )}
          </div>
        </div>

        {/* Recommendation 2: Pattern Recommendation */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            padding: "22px 24px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
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
                  letterSpacing: "0.05em",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px"
                }}
              >
                <BookmarkCheck size={14} />
                <span>Recommended Pattern</span>
              </span>
              <span
                style={{
                  fontSize: "10px",
                  fontFamily: "var(--font-code)",
                  color: "var(--text-dim)"
                }}
              >
                Codex Architectural Strategy
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
              {recommended_pattern?.title || "Calculating Funnel Conversion Rates"}
            </h3>

            <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
              <span style={{ fontSize: "11px", background: "rgba(217, 155, 67, 0.12)", color: "var(--accent-amber)", padding: "2px 8px", borderRadius: "4px", fontFamily: "var(--font-code)" }}>
                Category: {recommended_pattern?.category || "Advanced Analytics"}
              </span>
              <span style={{ fontSize: "11px", background: "rgba(255, 255, 255, 0.05)", color: "var(--text-muted)", padding: "2px 8px", borderRadius: "4px", fontFamily: "var(--font-code)" }}>
                Flowchart Architecture Ready
              </span>
            </div>

            <p style={{ fontSize: "12.5px", color: "var(--text-dim)", lineHeight: 1.6, margin: 0 }}>
              Mastering this pattern unblocks multi-stage sessionization and user drop-off queries commonly asked at DoorDash, Uber, and Meta.
            </p>
          </div>

          <div style={{ marginTop: "20px" }}>
            <button
              type="button"
              onClick={() => {
                soundEngine.playKeyClick();
                onOpenHandbook();
              }}
              style={{
                width: "100%",
                padding: "10px 16px",
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-sm)",
                color: "var(--text-parchment)",
                fontSize: "12px",
                fontFamily: "var(--font-code)",
                cursor: "pointer",
                transition: "all 0.15s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--accent-amber)";
                e.currentTarget.style.color = "var(--accent-amber)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-subtle)";
                e.currentTarget.style.color = "var(--text-parchment)";
              }}
            >
              <span>Inspect Pattern Architecture in Handbook ⌘B</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>

      </div>

      {/* Quick Launch & Recent Practice Bar */}
      <div
        style={{
          background: "rgba(17, 18, 21, 0.6)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-md)",
          padding: "20px 24px"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "16px" }}>
          <h4 style={{ margin: 0, fontFamily: "var(--font-heading)", fontSize: "15px", fontWeight: 600, color: "var(--text-parchment)" }}>
            Recent Practice Activity
          </h4>
          <span style={{ fontSize: "11px", color: "var(--text-dim)", fontFamily: "var(--font-code)" }}>
            Solo Recall vs Paired Typer
          </span>
        </div>

        {recent_solved && recent_solved.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {recent_solved.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 14px",
                  background: "var(--bg-card)",
                  borderRadius: "6px",
                  border: "1px solid rgba(255,255,255,0.04)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Check size={14} style={{ color: "#10b981" }} />
                  <span style={{ fontSize: "12.5px", color: "var(--text-parchment)", fontWeight: 500 }}>
                    {item.title}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "11px", fontFamily: "var(--font-code)" }}>
                  <span style={{ color: "var(--accent-amber)" }}>Grade {item.grade}</span>
                  <span style={{ color: "var(--text-dim)", textTransform: "capitalize" }}>{item.mode} Mode</span>
                  {item.wpm > 0 && <span style={{ color: "var(--text-muted)" }}>{item.wpm} WPM</span>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: "20px", textAlign: "center", color: "var(--text-dim)", fontSize: "12px" }}>
            No questions solved yet. Pick the suggested question above to begin climbing the corporate ladder!
          </div>
        )}
      </div>

    </div>
  );
}
