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
  Sparkles,
  ExternalLink
} from "lucide-react";

// Disciplined, handcrafted vector illustration of Onsen bath with Capybara
export function OnsenCapybaraIllustration({ size = 88, isPetting = false }) {
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Quiet Steam Paths */}
      <path d="M44 18 Q47 12 44 6 Q41 0 45 -4" stroke="rgba(239, 233, 222, 0.25)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3" />
      <path d="M60 16 Q63 10 60 4 Q57 -2 61 -6" stroke="rgba(239, 233, 222, 0.35)" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="4 4" />
      <path d="M76 20 Q79 14 76 8 Q73 2 77 -2" stroke="rgba(239, 233, 222, 0.25)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3" />

      {/* Wooden Tub Rim (Back) */}
      <ellipse cx="60" cy="52" rx="50" ry="15" fill="#2b241e" stroke="#1c1713" strokeWidth="1.5" />
      
      {/* Hot Spring Water */}
      <ellipse cx="60" cy="53" rx="48" ry="13" fill="#1e3a5f" fillOpacity="0.4" />
      <ellipse cx="60" cy="53" rx="44" ry="11" fill="#0284c7" fillOpacity="0.18" />

      {/* Capybara */}
      <g transform={isPetting ? "translate(0, 1) scale(1.01)" : "translate(0, 0)"} style={{ transition: "transform 140ms cubic-bezier(0.22, 1, 0.36, 1)" }}>
        {/* Body submerged */}
        <path d="M40 58 C40 43 51 39 62 39 C73 39 82 43 82 58" fill="#7a5032" />
        
        {/* Head */}
        <path d="M50 41 C50 29 55 25 67 25 C76 25 80 30 80 41 C80 46 73 50 63 50 C53 50 50 46 50 41 Z" fill="#8c5d3b" />
        
        {/* Ear */}
        <ellipse cx="53" cy="28" rx="3" ry="4" fill="#5a351d" />
        <ellipse cx="53" cy="28" rx="1.6" ry="2" fill="#3a2010" />

        {/* Snout */}
        <path d="M73 36 C75 36 77 38 77 40 C77 42 74 44 71 44 C68 44 66 42 66 40 C66 38 70 36 73 36 Z" fill="#4a2a16" />
        <circle cx="75" cy="39" r="0.9" fill="#1a0f08" />

        {/* Calm Eyes */}
        <path d="M59 34 Q62 31 65 34" stroke="#2a140a" strokeWidth="1.8" strokeLinecap="round" fill="none" />

        {/* Cheek blush */}
        <circle cx="63" cy="39" r="2.5" fill="#f43f5e" fillOpacity="0.25" />

        {/* Japanese Yuzu Citrus Fruit */}
        <g transform="translate(62, 15)">
          <circle cx="5" cy="6" r="5" fill="#d99b43" stroke="#b4782b" strokeWidth="0.8" />
          <circle cx="3.8" cy="4.8" r="1.4" fill="#fef08a" fillOpacity="0.5" />
          <path d="M5 1.5 C5 0.3 6.5 -0.3 7.2 0.2" stroke="#4a7c59" strokeWidth="1" strokeLinecap="round" />
          <ellipse cx="7.8" cy="0.6" rx="1.6" ry="0.9" fill="#5e9373" transform="rotate(-15 7.8 0.6)" />
        </g>
      </g>

      {/* Wooden Tub (Front) */}
      <path d="M10 52 C10 64 32 73 60 73 C88 73 110 64 110 52 C110 65 88 81 60 81 C32 81 10 65 10 52 Z" fill="#443224" stroke="#251a11" strokeWidth="1.5" />
      {/* Metal Hoop Bands */}
      <path d="M14 61 C25 69 42 72 60 72 C78 72 95 69 106 61" stroke="#6b7280" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M20 72 C31 77 45 79 60 79 C75 79 89 77 100 72" stroke="#4b5563" strokeWidth="1.2" fill="none" opacity="0.6" />

      {/* Floating Citrus in Water */}
      <circle cx="34" cy="57" r="3.2" fill="#d99b43" stroke="#925f1e" strokeWidth="0.5" />
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
    "Data pipelines remain reliable when transformations are strictly idempotent.",
    "Window functions are predictable once the frame partition is explicit.",
    "DuckDB vectorized execution validates SQL logic in sub-millisecond cycles."
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
      <div style={{ padding: "32px", maxWidth: "1280px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
          <SkeletonStat />
          <SkeletonStat />
          <SkeletonStat />
          <SkeletonStat />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "16px" }}>
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  const { profile, repository, stats, recommended_question, recommended_pattern, recent_solved } = data || {};

  return (
    <div style={{ padding: "32px", maxWidth: "1280px", margin: "0 auto", color: "var(--text-primary)" }}>
      
      {/* Hero Overview Panel */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-lg)",
          padding: "24px 28px",
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "24px"
        }}
      >
        <div style={{ maxWidth: "680px" }}>
          {/* Context Line */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <span
              style={{
                fontSize: "12px",
                fontFamily: "var(--font-code)",
                color: "var(--text-muted)",
                letterSpacing: "0.02em"
              }}
            >
              Candidate preparation overview
            </span>
            <span style={{ color: "var(--border-subtle)" }}>•</span>
            <span style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "var(--font-code)", display: "flex", alignItems: "center", gap: "4px" }}>
              <Flame size={13} style={{ color: "var(--accent-amber)" }} />
              <span>{stats?.streak_days || 1} day streak</span>
            </span>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "24px",
              fontWeight: 600,
              color: "var(--text-primary)",
              margin: "0 0 6px",
              letterSpacing: "-0.01em"
            }}
          >
            {profile?.name || "Nadia Rahman"} — {profile?.role || "Staff Data Engineer"}
          </h1>

          <p
            style={{
              fontSize: "13.5px",
              color: "var(--text-secondary)",
              lineHeight: 1.5,
              margin: "0 0 16px"
            }}
          >
            Targeting {profile?.target_company || "Meta / Databricks"}. Tracking against {stats?.total_questions || 136} catalog questions and {stats?.patterns_total || 89} SQL patterns in in-memory DuckDB.
          </p>

          {/* Interactive Desk Companion Bar */}
          <div
            onClick={handleCapyPet}
            title="Click to interact with study companion"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              background: "var(--bg-raised)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              padding: "6px 12px",
              cursor: "pointer",
              transition: "background 140ms cubic-bezier(0.22, 1, 0.36, 1), transform 100ms ease"
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <Sparkles size={13} style={{ color: "var(--accent-amber)" }} />
            <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
              "{capyChillQuote}"
            </span>
            <span style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "var(--font-code)" }}>
              ({capyClicks})
            </span>
          </div>
        </div>

        {/* Ambient Capybara Companion Tile */}
        <div
          onClick={handleCapyPet}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px 20px",
            background: "var(--bg-study)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-subtle)",
            cursor: "pointer",
            flexShrink: 0,
            transition: "border-color 140ms ease"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(239, 233, 222, 0.16)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border-subtle)")}
        >
          <OnsenCapybaraIllustration size={80} isPetting={false} />
          <span style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "var(--font-code)", marginTop: "6px" }}>
            Study cadence
          </span>
        </div>
      </div>

      {/* 4 Stat Cards Grid (4px scale, uniform 20px padding) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "16px",
          marginBottom: "24px"
        }}
      >
        {/* Stat 1: Questions Solved */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "var(--font-code)" }}>
                Questions completed
              </span>
              <Zap size={15} style={{ color: "var(--text-muted)" }} />
            </div>
            <div style={{ fontSize: "28px", fontWeight: 500, color: "var(--text-primary)", fontVariantNumeric: "tabular-nums" }}>
              {stats?.solved_questions} <span style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: 400 }}>/ {stats?.total_questions}</span>
            </div>
          </div>

          <div style={{ marginTop: "12px" }}>
            <div style={{ height: "4px", background: "var(--bg-raised)", borderRadius: "2px", overflow: "hidden" }}>
              <div
                style={{
                  width: `${stats?.solve_percentage || 0}%`,
                  height: "100%",
                  background: "var(--accent-amber)",
                  borderRadius: "2px"
                }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--text-muted)", marginTop: "6px", fontFamily: "var(--font-code)" }}>
              <span>{stats?.solve_percentage}% complete</span>
              <span style={{ color: "var(--accent-amber)", cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }} onClick={onOpenWorkspace}>
                Practice <ArrowRight size={10} />
              </span>
            </div>
          </div>
        </div>

        {/* Stat 2: Patterns Mastered */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "var(--font-code)" }}>
                Patterns mastered
              </span>
              <BookOpen size={15} style={{ color: "var(--text-muted)" }} />
            </div>
            <div style={{ fontSize: "28px", fontWeight: 500, color: "var(--text-primary)", fontVariantNumeric: "tabular-nums" }}>
              {stats?.patterns_solved} <span style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: 400 }}>/ {stats?.patterns_total || 89}</span>
            </div>
          </div>

          <div style={{ marginTop: "12px" }}>
            <div style={{ height: "4px", background: "var(--bg-raised)", borderRadius: "2px", overflow: "hidden" }}>
              <div
                style={{
                  width: `${stats?.patterns_percentage || 0}%`,
                  height: "100%",
                  background: "var(--accent-amber)",
                  borderRadius: "2px"
                }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--text-muted)", marginTop: "6px", fontFamily: "var(--font-code)" }}>
              <span>{stats?.patterns_percentage}% unlocked</span>
              <span style={{ color: "var(--accent-amber)", cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }} onClick={onOpenHandbook}>
                Codex <ArrowRight size={10} />
              </span>
            </div>
          </div>
        </div>

        {/* Stat 3: Career Progression Tier */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "var(--font-code)" }}>
                Career ladder tier
              </span>
              <TrendingUp size={15} style={{ color: "var(--text-muted)" }} />
            </div>
            <div style={{ fontSize: "20px", fontWeight: 500, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {stats?.current_tier} · {stats?.current_tier_name}
            </div>
          </div>

          <div style={{ marginTop: "12px" }}>
            <div style={{ fontSize: "12px", color: "var(--text-secondary)", fontFamily: "var(--font-code)" }}>
              Total preparation XP: <strong style={{ color: "var(--text-primary)" }}>{stats?.xp} XP</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--accent-amber)", marginTop: "6px", fontFamily: "var(--font-code)", cursor: "pointer" }} onClick={onOpenLadder}>
              <span style={{ display: "flex", alignItems: "center", gap: 3 }}>View progression tree <ArrowRight size={10} /></span>
            </div>
          </div>
        </div>

        {/* Stat 4: Active Repository Status */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "var(--font-code)" }}>
                Active question catalog
              </span>
              <Activity size={15} style={{ color: "var(--accent-sage)" }} />
            </div>
            <div style={{ fontSize: "16px", fontWeight: 500, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {repository?.name}
            </div>
          </div>

          <div style={{ marginTop: "12px" }}>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "var(--font-code)" }}>
              Branch: {repository?.branch || "main"} · DuckDB in-memory
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--accent-amber)", marginTop: "6px", fontFamily: "var(--font-code)", cursor: "pointer" }} onClick={onOpenRepo}>
              <span style={{ display: "flex", alignItems: "center", gap: 3 }}>Connect repository <ArrowRight size={10} /></span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Recommendations Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        
        {/* Recommendation 1: Question Recommendation */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span
                style={{
                  fontSize: "12px",
                  fontFamily: "var(--font-code)",
                  color: "var(--text-muted)",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <Target size={14} style={{ color: "var(--accent-amber)" }} />
                <span>Suggested practice problem</span>
              </span>
              <span
                style={{
                  fontSize: "11px",
                  fontFamily: "var(--font-code)",
                  color: "var(--text-muted)",
                  background: "var(--bg-raised)",
                  padding: "2px 8px",
                  borderRadius: "var(--radius-xs)"
                }}
              >
                High interview frequency
              </span>
            </div>

            <h3
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "17px",
                fontWeight: 600,
                color: "var(--text-primary)",
                margin: "0 0 10px",
                lineHeight: 1.3
              }}
            >
              {recommended_question?.title || "Amazon — Top 5 Revenue Product Categories for Q1"}
            </h3>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "14px" }}>
              <span style={{ fontSize: "11px", background: "var(--bg-raised)", color: "var(--accent-sage)", padding: "2px 8px", borderRadius: "var(--radius-xs)", fontFamily: "var(--font-code)" }}>
                {recommended_question?.difficulty?.toLowerCase() || "easy"}
              </span>
              <span style={{ fontSize: "11px", background: "var(--bg-raised)", color: "var(--text-secondary)", padding: "2px 8px", borderRadius: "var(--radius-xs)", fontFamily: "var(--font-code)" }}>
                Tier {recommended_question?.tier || "L1"}
              </span>
              {recommended_question?.companies?.map((comp) => (
                <span key={comp} style={{ fontSize: "11px", background: "var(--bg-raised)", color: "var(--text-secondary)", padding: "2px 8px", borderRadius: "var(--radius-xs)", fontFamily: "var(--font-code)" }}>
                  {comp}
                </span>
              ))}
            </div>

            <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
              Corresponds to LeetCode #{recommended_question?.leetcode_id || 321}. Exercises DENSE_RANK() with PARTITION BY and running aggregation logic over first-quarter product logs.
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
                height: "36px",
                padding: "0 16px",
                background: "var(--accent-amber)",
                color: "var(--accent-amber-text)",
                border: "none",
                borderRadius: "var(--radius-md)",
                fontWeight: 600,
                fontSize: "12px",
                fontFamily: "var(--font-code)",
                cursor: "pointer",
                transition: "opacity 140ms ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <span>Solve problem</span>
              <ArrowRight size={13} />
            </button>

            {recommended_question?.leetcode_url && (
              <a
                href={recommended_question.leetcode_url}
                target="_blank"
                rel="noreferrer"
                style={{
                  height: "36px",
                  padding: "0 14px",
                  background: "var(--bg-raised)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-md)",
                  color: "var(--text-secondary)",
                  fontSize: "12px",
                  fontFamily: "var(--font-code)",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px"
                }}
                title="View original problem on LeetCode"
              >
                <span>LeetCode</span>
                <ExternalLink size={11} />
              </a>
            )}
          </div>
        </div>

        {/* Recommendation 2: Pattern Recommendation */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span
                style={{
                  fontSize: "12px",
                  fontFamily: "var(--font-code)",
                  color: "var(--text-muted)",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <BookmarkCheck size={14} style={{ color: "var(--accent-amber)" }} />
                <span>Recommended pattern</span>
              </span>
              <span
                style={{
                  fontSize: "11px",
                  fontFamily: "var(--font-code)",
                  color: "var(--text-muted)",
                  background: "var(--bg-raised)",
                  padding: "2px 8px",
                  borderRadius: "var(--radius-xs)"
                }}
              >
                Architectural strategy
              </span>
            </div>

            <h3
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "17px",
                fontWeight: 600,
                color: "var(--text-primary)",
                margin: "0 0 10px",
                lineHeight: 1.3
              }}
            >
              {recommended_pattern?.title || "Calculating Funnel Conversion Rates"}
            </h3>

            <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
              <span style={{ fontSize: "11px", background: "var(--bg-raised)", color: "var(--text-secondary)", padding: "2px 8px", borderRadius: "var(--radius-xs)", fontFamily: "var(--font-code)" }}>
                {recommended_pattern?.category || "Advanced analytics"}
              </span>
              <span style={{ fontSize: "11px", background: "var(--bg-raised)", color: "var(--text-muted)", padding: "2px 8px", borderRadius: "var(--radius-xs)", fontFamily: "var(--font-code)" }}>
                Canonical reference
              </span>
            </div>

            <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
              Covers multi-stage sessionization and user drop-off metrics commonly evaluated in product analytics rounds at Uber, DoorDash, and Meta.
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
                height: "36px",
                padding: "0 16px",
                background: "var(--bg-raised)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                color: "var(--text-primary)",
                fontSize: "12px",
                fontFamily: "var(--font-code)",
                cursor: "pointer",
                transition: "border-color 140ms ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(239, 233, 222, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-subtle)";
              }}
            >
              <span>Inspect pattern in Handbook</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>

      </div>

      {/* Recent Activity List */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-lg)",
          padding: "20px 24px"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "14px" }}>
          <h4 style={{ margin: 0, fontFamily: "var(--font-heading)", fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>
            Recent practice activity
          </h4>
          <span style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "var(--font-code)" }}>
            Solo recall vs paired drill
          </span>
        </div>

        {recent_solved && recent_solved.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {recent_solved.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 12px",
                  background: "var(--bg-study)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-subtle)",
                  height: "36px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Check size={13} style={{ color: "var(--accent-sage)" }} />
                  <span style={{ fontSize: "13px", color: "var(--text-primary)", fontWeight: 400 }}>
                    {item.title}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "11px", fontFamily: "var(--font-code)" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Grade {item.grade}</span>
                  <span style={{ color: "var(--text-muted)" }}>{item.mode}</span>
                  {item.wpm > 0 && <span style={{ color: "var(--text-muted)", fontVariantNumeric: "tabular-nums" }}>{item.wpm} wpm</span>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: "16px 0", textAlign: "center", color: "var(--text-muted)", fontSize: "12px", fontFamily: "var(--font-code)" }}>
            No recorded sessions yet. Select a practice problem above to begin.
          </div>
        )}
      </div>

    </div>
  );
}
