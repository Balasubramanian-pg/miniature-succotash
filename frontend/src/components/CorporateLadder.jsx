import React, { useState } from "react";
import { Coffee, BookOpen, ArrowRight } from "lucide-react";

export function CorporateLadder({
  currentTier = "L0",
  xp = 0,
  solvedCount = 0,
  onSelectQuest,
  onOpenHandbook
}) {
  const [hoveredNode, setHoveredNode] = useState(null);

  // Grounded Career Progression Tree for Data Engineers
  const tiers = [
    {
      level: 5,
      id: "god",
      name: "Absolute Data God",
      difficulty: "hard",
      requiredXP: 3000,
      nodes: [
        { id: "god_1", label: "Staff Architect", concept: "Distributed Streaming & Scale", progress: "0/3", difficulty: "hard" }
      ]
    },
    {
      level: 4,
      id: "rockcorp",
      name: "Staff Engineer @ Rock Corp",
      difficulty: "hard",
      requiredXP: 1800,
      nodes: [
        { id: "dist_1", label: "Scale & Skew", concept: "Broadcast Joins & Salting", progress: "0/3", difficulty: "hard" },
        { id: "dist_2", label: "Partitioning", concept: "Pruning & Bucket Joins", progress: "0/3", difficulty: "hard" }
      ]
    },
    {
      level: 3,
      id: "senior",
      name: "Senior Data Engineer",
      difficulty: "medium",
      requiredXP: 800,
      nodes: [
        { id: "swe3_1", label: "Sessionization", concept: "Gaps & Islands Analytics", progress: "0/3", difficulty: "medium" },
        { id: "swe3_2", label: "Cumulative Sums", concept: "Rolling Windows & Bounds", progress: "0/3", difficulty: "medium" }
      ]
    },
    {
      level: 2,
      id: "bookface",
      name: "SWE II @ Bookface",
      difficulty: "medium",
      requiredXP: 300,
      hasBookface: true,
      nodes: [
        { id: "swe2_1", label: "Window Ranking", concept: "DENSE_RANK & QUALIFY", progress: "0/3", difficulty: "medium" },
        { id: "swe2_2", label: "Bookface Office", concept: "Pipeline Decomposition & CTEs", progress: "0/3", difficulty: "medium", isCenter: true },
        { id: "swe2_3", label: "Pivots & Aggs", concept: "Conditional Aggregation", progress: "0/3", difficulty: "medium" }
      ]
    },
    {
      level: 1,
      id: "unemployed",
      name: "Mom's Couch (Unemployed)",
      difficulty: "easy",
      requiredXP: 0,
      hasCouch: true,
      nodes: [
        { id: "un_1", label: "Mom's Living Room", concept: "WHERE vs HAVING & Null Safety", progress: `${Math.min(3, solvedCount)}/3`, difficulty: "easy", isFirst: true },
        { id: "un_2", label: "Relational Traps", concept: "Cartesian Explosion & Anti-Joins", progress: "0/3", difficulty: "easy" },
        { id: "un_3", label: "Date Arithmetic", concept: "Half-Open Date Boundaries", progress: "0/3", difficulty: "easy" },
        { id: "un_4", label: "Aggregation Basics", concept: "GROUP BY Execution Order", progress: "0/3", difficulty: "easy" }
      ]
    }
  ];

  return (
    <div className="ladder-viewport">
      
      {/* SVG Connecting Paths */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
        {/* Tier 1 -> Tier 2 */}
        <line x1="38%" y1="78%" x2="35%" y2="58%" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1.5" strokeDasharray="4 4" />
        <line x1="48%" y1="78%" x2="50%" y2="58%" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1.5" strokeDasharray="4 4" />
        <line x1="62%" y1="78%" x2="65%" y2="58%" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1.5" strokeDasharray="4 4" />

        {/* Tier 2 -> Tier 3 */}
        <line x1="35%" y1="52%" x2="42%" y2="38%" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1.5" strokeDasharray="4 4" />
        <line x1="65%" y1="52%" x2="58%" y2="38%" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1.5" strokeDasharray="4 4" />

        {/* Tier 3 -> Tier 4 & God */}
        <line x1="42%" y1="32%" x2="46%" y2="18%" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1.5" strokeDasharray="4 4" />
        <line x1="58%" y1="32%" x2="54%" y2="18%" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1.5" strokeDasharray="4 4" />

        {/* Subtle Milestone Junction Dots */}
        {[
          { cx: "36.5%", cy: "68%" },
          { cx: "50%", cy: "68%" },
          { cx: "63.5%", cy: "68%" },
          { cx: "43%", cy: "45%" },
          { cx: "57%", cy: "45%" }
        ].map((pt, idx) => (
          <circle key={idx} cx={pt.cx} cy={pt.cy} r="3.5" fill="var(--accent-amber)" opacity="0.6" />
        ))}
      </svg>

      {/* Tech Tree Career Pyramid */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: "940px", zIndex: 10 }}>
        {tiers.map((tier) => (
          <div key={tier.id} className="ladder-tier-row">
            {tier.nodes.map((node) => {
              const isFirstUnemployed = node.isFirst && tier.hasCouch;
              const isCenterSwe2 = node.isCenter && tier.hasBookface;

              return (
                <div
                  key={node.id}
                  className="ladder-step-card active-step"
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => {
                    if (onSelectQuest) {
                      onSelectQuest(node.difficulty);
                    }
                  }}
                >
                  {/* Cozy Hand-Drawn Couch & Coffee Sketch over Mom's Living Room */}
                  {isFirstUnemployed && (
                    <div style={{
                      position: "absolute",
                      top: "-88px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      pointerEvents: "none"
                    }}>
                      <svg width="120" height="75" viewBox="0 0 120 75" fill="none">
                        {/* Cozy Couch */}
                        <path d="M25 45H95V62H25V45Z" fill="#1c1d22" stroke="#d1cbbd" strokeWidth="1.5" />
                        <path d="M20 32H30V62H20V32Z" fill="#1c1d22" stroke="#d1cbbd" strokeWidth="1.5" />
                        <path d="M90 32H100V62H90V32Z" fill="#1c1d22" stroke="#d1cbbd" strokeWidth="1.5" />
                        <path d="M30 26H90V45H30V26Z" fill="#1c1d22" stroke="#d1cbbd" strokeWidth="1.5" />
                        {/* Throw blanket & pillows */}
                        <path d="M36 34C42 30 50 36 46 43" stroke="#d99b43" strokeWidth="1.2" strokeLinecap="round" />
                        {/* Steaming Ceramic Mug on Floor */}
                        <rect x="104" y="54" width="8" height="10" rx="1.5" fill="#ece8e1" stroke="#16171b" strokeWidth="1" />
                        <path d="M106 50C105 46 109 45 107 41M110 50C109 46 113 45 111 41" stroke="#d99b43" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
                      </svg>
                    </div>
                  )}

                  {/* Clean Bookface Office Building over SWE II */}
                  {isCenterSwe2 && (
                    <div style={{
                      position: "absolute",
                      top: "-96px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      pointerEvents: "none"
                    }}>
                      <svg width="110" height="85" viewBox="0 0 110 85" fill="none">
                        {/* Office Building Body */}
                        <rect x="18" y="22" width="74" height="63" rx="2" fill="#1c1d22" stroke="#ece8e1" strokeWidth="1.5" />
                        {/* Roof Sign */}
                        <rect x="26" y="8" width="58" height="16" rx="2" fill="#16171b" stroke="#d99b43" strokeWidth="1.2" />
                        <text x="55" y="19.5" fill="#ece8e1" fontSize="9" fontFamily="'Space Grotesk', sans-serif" fontWeight="600" textAnchor="middle">
                          BOOKFACE
                        </text>
                        {/* Warm Interior Windows */}
                        <rect x="25" y="30" width="16" height="11" rx="1" fill="#d99b43" opacity="0.3" stroke="#ece8e1" strokeWidth="0.8" />
                        <rect x="47" y="30" width="16" height="11" rx="1" fill="#d99b43" opacity="0.7" stroke="#ece8e1" strokeWidth="0.8" />
                        <rect x="69" y="30" width="16" height="11" rx="1" fill="#d99b43" opacity="0.3" stroke="#ece8e1" strokeWidth="0.8" />
                        <rect x="25" y="48" width="16" height="11" rx="1" fill="#d99b43" opacity="0.7" stroke="#ece8e1" strokeWidth="0.8" />
                        <rect x="47" y="48" width="16" height="11" rx="1" fill="#d99b43" opacity="0.3" stroke="#ece8e1" strokeWidth="0.8" />
                        <rect x="69" y="48" width="16" height="11" rx="1" fill="#d99b43" opacity="0.7" stroke="#ece8e1" strokeWidth="0.8" />
                      </svg>
                    </div>
                  )}

                  <div className="step-card-title">{node.label}</div>
                  <div className="step-card-concept">{node.concept}</div>
                  <div className="step-card-progress">{node.progress} Completed</div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Grounded Engineer Study Card (Bottom Left) */}
      <div className="desk-study-card">
        <div className="desk-avatar" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Coffee size={18} style={{ color: "var(--accent-amber)" }} />
        </div>

        <div className="desk-info">
          <div className="desk-tier-name">Career Stage: {currentTier}</div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "1px" }}>
            ${(100500 + xp * 50).toLocaleString()} Comp Target · {solvedCount} Solved
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "4px" }}>
            <span className="desk-streak">Streak: On Track</span>
            {onOpenHandbook && (
              <button
                onClick={onOpenHandbook}
                className="earth-btn"
                style={{ fontSize: "10px", padding: "1px 7px", display: "inline-flex", alignItems: "center", gap: "4px" }}
                title="Open 89 SQL Patterns Handbook (⌘B)"
              >
                <BookOpen size={11} />
                <span>Study Codex (89)</span>
                <ArrowRight size={10} />
              </button>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
