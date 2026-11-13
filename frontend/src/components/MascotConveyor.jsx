import React, { useEffect, useState } from "react";
import { soundEngine } from "../audio/synthAudio";
import { Coffee, FileText, BookOpen, Sparkles, Activity, Heart } from "lucide-react";

export function MascotConveyor({ keystrokeCount, wpm, combo, isTyping }) {
  const [beads, setBeads] = useState([
    { id: 1, x: 22, type: "coffee" },
    { id: 2, x: 42, type: "dot" },
    { id: 3, x: 62, type: "dot" },
    { id: 4, x: 82, type: "doc" }
  ]);
  const [headNod, setHeadNod] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [petCount, setPetCount] = useState(0);
  const [isPetting, setIsPetting] = useState(false);
  const [floatingParticles, setFloatingParticles] = useState([]);

  useEffect(() => {
    if (keystrokeCount === 0) return;

    // Gentle head nod to typing cadence
    setHeadNod(true);
    const timer = setTimeout(() => setHeadNod(false), 90);

    // Roll new study beads occasionally
    if (keystrokeCount % 6 === 0) {
      const types = ["dot", "coffee", "dot", "book"];
      const newBead = {
        id: Date.now() + Math.random(),
        x: 4,
        type: types[Math.floor(Math.random() * types.length)]
      };
      setBeads(prev => [...prev.slice(-10), newBead]);
    }

    return () => clearTimeout(timer);
  }, [keystrokeCount]);

  // Gentle, smooth bead motion along the rail
  useEffect(() => {
    let animId;
    const moveBeads = () => {
      setBeads(prev =>
        prev
          .map(b => ({
            ...b,
            x: b.x + 0.25 + Math.min((wpm || 30) * 0.012, 1.0)
          }))
          .filter(b => b.x <= 96)
      );
      animId = requestAnimationFrame(moveBeads);
    };
    animId = requestAnimationFrame(moveBeads);
    return () => cancelAnimationFrame(animId);
  }, [wpm]);

  // Handle petting the capybara
  const handlePet = (e) => {
    e.stopPropagation();
    soundEngine.playPetPurr();
    const nextCount = petCount + 1;
    setPetCount(nextCount);
    setIsPetting(true);
    setTimeout(() => setIsPetting(false), 220);

    // Spawn floating focus particle
    const particles = ["+1 Focus", "Purr...", "+10 Chill", "Cozy Warm", "Good Luck!"];
    const text = particles[Math.floor(Math.random() * particles.length)];
    const newParticle = {
      id: Date.now() + Math.random(),
      text,
      x: (Math.random() - 0.5) * 30
    };

    setFloatingParticles(prev => [...prev, newParticle]);
    setTimeout(() => {
      setFloatingParticles(prev => prev.filter(p => p.id !== newParticle.id));
    }, 1200);
  };

  const renderBead = (type) => {
    switch (type) {
      case "coffee":
        return <Coffee size={11} />;
      case "doc":
        return <FileText size={11} />;
      case "book":
        return <BookOpen size={11} />;
      default:
        return <span>•</span>;
    }
  };

  return (
    <div className="study-conveyor-bar">
      {/* Subtle Hairline Rail */}
      <div className="study-track-rail" />

      {/* Left Desk Mark */}
      <div style={{
        position: "absolute",
        left: "24px",
        bottom: "8px",
        fontSize: "11px",
        color: "var(--text-dim)",
        fontFamily: "var(--font-code)",
        display: "flex",
        alignItems: "center",
        gap: "6px"
      }}>
        <Activity size={12} style={{ color: "var(--accent-amber)" }} />
        <span>Study Cadence</span>
      </div>

      {/* Rolling Study Tokens along the Rail */}
      {beads.map(b => (
        <div
          key={b.id}
          style={{
            position: "absolute",
            left: `${b.x}%`,
            bottom: "8px",
            fontSize: "11px",
            color: b.type === "dot" ? "var(--text-dim)" : "var(--accent-amber)",
            userSelect: "none",
            pointerEvents: "none",
            display: "flex",
            alignItems: "center"
          }}
        >
          {renderBead(b.type)}
        </div>
      ))}

      {/* Floating Pet Particles */}
      {floatingParticles.map(p => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            bottom: "48px",
            left: `calc(50% + ${p.x}px)`,
            transform: "translateX(-50%)",
            fontSize: "11px",
            fontFamily: "var(--font-code)",
            color: "var(--accent-amber)",
            background: "rgba(22, 23, 27, 0.95)",
            border: "1px solid var(--accent-amber)",
            padding: "2px 8px",
            borderRadius: "12px",
            pointerEvents: "none",
            animation: "floatUp 1.2s ease-out forwards",
            zIndex: 110,
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center",
            gap: "4px"
          }}
        >
          <Sparkles size={11} />
          <span>{p.text}</span>
        </div>
      ))}

      {/* Interactive Capybara Desk Mascot */}
      <div
        className="capy-mascot-container"
        onClick={handlePet}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title="Study Companion Capybara · Click to pet (+1 Focus)"
        style={{
          position: "absolute",
          left: "50%",
          bottom: "2px",
          transform: `translateX(-50%) scale(${isPetting ? 1.08 : 1})`,
          transition: "transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          cursor: "pointer",
          userSelect: "none",
          padding: "4px 8px"
        }}
      >
        {/* Interactive Speech / Petting Tooltip */}
        {isHovered && (
          <div style={{
            position: "absolute",
            top: "-22px",
            fontFamily: "var(--font-code)",
            fontSize: "10px",
            color: "var(--accent-amber)",
            background: "var(--bg-desk)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "4px",
            padding: "2px 8px",
            whiteSpace: "nowrap",
            boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            gap: "5px"
          }}>
            <Sparkles size={10} style={{ color: "var(--accent-amber)" }} />
            <span>{petCount > 0 ? `Petted ${petCount}x · ~ purr ~` : "Click to pet (+1 Focus)"}</span>
          </div>
        )}

        {/* Combo Multiplier Overhead */}
        {combo > 5 && !isHovered && (
          <div style={{
            fontFamily: "var(--font-code)",
            fontSize: "10px",
            color: "var(--accent-amber)",
            background: "var(--accent-amber-dim)",
            borderRadius: "3px",
            padding: "1px 6px",
            marginBottom: "2px"
          }}>
            {combo}x streak
          </div>
        )}

        <svg width="56" height="46" viewBox="0 0 56 46" fill="none">
          {/* Japanese Hot-Spring Yuzu Orange on Head (Appears when hovered or petted) */}
          {(isHovered || petCount > 0) && (
            <g transform="translate(34, 2)" style={{ transition: "all 0.2s ease" }}>
              {/* Yuzu Citrus Body */}
              <circle cx="5" cy="5" r="4.2" fill="#f49d37" stroke="#d97706" strokeWidth="0.6" />
              {/* Highlight */}
              <circle cx="4" cy="3.8" r="1.2" fill="#fef08a" opacity="0.7" />
              {/* Stem */}
              <path d="M5 1.5 C5 0.5 6 0 7 0" stroke="#4a7c59" strokeWidth="1" strokeLinecap="round" />
              {/* Leaf */}
              <ellipse cx="7" cy="0.5" rx="1.6" ry="0.9" fill="#5e9373" transform="rotate(-15 7 0.5)" />
            </g>
          )}

          {/* Capybara Body */}
          <path d="M14 30C14 22 22 20 32 20C42 20 46 26 46 34C46 40 40 42 30 42C20 42 14 38 14 30Z" fill="#a47148" />
          
          {/* Head */}
          <path d="M28 16C28 11 34 9 40 9C45 9 48 13 48 19C48 25 44 27 38 27C32 27 28 22 28 16Z" fill="#b07d53" />
          
          {/* Snout / Nose */}
          <ellipse cx="46" cy="19" rx="2.2" ry="3.2" fill="#6d4327" />
          
          {/* Eyes: Sleepy slit normally, Happy joyful smiling curved arc (^ ^) when hovered/petted */}
          {isHovered || isPetting ? (
            <path d="M37 15 Q39 12 42 15" stroke="#3b2012" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          ) : (
            <line x1="37" y1="15" x2="42" y2="15" stroke="#3b2012" strokeWidth="1.4" strokeLinecap="round" />
          )}

          {/* Ears */}
          <ellipse cx="32" cy="12" rx="2.2" ry="3.5" fill="#8c5a34" />
          <ellipse cx="32" cy="12" rx="1.2" ry="2" fill="#59341a" />

          {/* Cute Little Paws resting on desk rail */}
          <ellipse cx="36" cy="38" rx="3.5" ry="2" fill="#8c5a34" />
          <ellipse cx="43" cy="38" rx="3" ry="1.8" fill="#8c5a34" />

          {/* Rosy blushing cheek when petted */}
          {(isHovered || isPetting) && (
            <circle cx="41" cy="20" r="2.2" fill="#e06c75" opacity="0.4" />
          )}
        </svg>

        {/* Small Nameplate */}
        <span style={{
          fontSize: "9px",
          fontFamily: "var(--font-code)",
          color: isHovered ? "var(--accent-amber)" : "var(--text-dim)",
          marginTop: "-2px",
          letterSpacing: "0.05em"
        }}>
          BARA // DE
        </span>
      </div>

      {/* Right Telemetry */}
      <div style={{
        position: "absolute",
        right: "24px",
        bottom: "8px",
        fontSize: "11px",
        fontFamily: "var(--font-code)",
        color: "var(--text-dim)",
        display: "flex",
        alignItems: "center",
        gap: "12px"
      }}>
        {wpm > 0 && (
          <span>
            Cadence: <strong style={{ color: "var(--accent-amber)" }}>{wpm}</strong> WPM
          </span>
        )}
        <span>
          Drill: <span style={{ color: "var(--text-parchment)" }}>{keystrokeCount}</span> chars
        </span>
      </div>
    </div>
  );
}
