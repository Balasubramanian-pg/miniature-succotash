import React, { useEffect, useState } from "react";
import { soundEngine } from "../audio/synthAudio";

export function MascotConveyor({ keystrokeCount, wpm, combo, isTyping }) {
  const [beads, setBeads] = useState([
    { id: 1, x: 22, symbol: "☕" },
    { id: 2, x: 42, symbol: "•" },
    { id: 3, x: 62, symbol: "•" },
    { id: 4, x: 82, symbol: "📜" }
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
      const symbols = ["•", "☕", "•", "📖"];
      const newBead = {
        id: Date.now() + Math.random(),
        x: 4,
        symbol: symbols[Math.floor(Math.random() * symbols.length)]
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

    // Spawn floating heart or focus particle
    const particles = ["🧡 +1 Focus", "✨ Purr...", "🍊 +10 Chill", "♨️ Cozy", "❤️ Good Luck!"];
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
        <span style={{ color: "var(--accent-amber)" }}>●</span>
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
            color: b.symbol === "•" ? "var(--text-dim)" : "var(--accent-amber)",
            userSelect: "none",
            pointerEvents: "none"
          }}
        >
          {b.symbol}
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
            whiteSpace: "nowrap"
          }}
        >
          {p.text}
        </div>
      ))}

      {/* Hand-Drawn Cozy Study Capybara Companion */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handlePet}
        title="Click to pet the study capybara (+1 Focus)"
        style={{
          position: "absolute",
          bottom: "6px",
          left: "50%",
          transform: `translateX(-50%) translateY(${headNod ? "2px" : isPetting ? "-4px" : isHovered ? "-2px" : "0px"}) scale(${isHovered ? "1.06" : "1.0"})`,
          transition: "transform 0.12s ease",
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
            gap: "4px"
          }}>
            <span>🍊</span>
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
            <path d="M38 15C39 17 41 17 42 15" stroke="#3b2012" strokeWidth="1.2" strokeLinecap="round" />
          )}

          {/* Rosy Blush Cheek (shows when hovered / petted) */}
          {(isHovered || isPetting) && (
            <ellipse cx="38" cy="21" rx="3" ry="1.8" fill="rgba(201, 98, 79, 0.45)" />
          )}

          {/* Cute Tiny Ear (wiggles on pet) */}
          <ellipse cx="31" cy="11" rx="2.2" ry="3" fill="#7d4d29" transform={isPetting ? "rotate(-10 31 11)" : "rotate(0)"} />

          {/* Steaming Ceramic Coffee Mug Next to Companion */}
          <rect x="6" y="28" width="9" height="12" rx="1.5" fill="#ece8e1" stroke="#1c1d22" strokeWidth="1" />
          {/* Mug handle */}
          <path d="M6 31H3C2 31 2 37 3 37H6" stroke="#ece8e1" strokeWidth="1" fill="none" />
          
          {/* Rising steam / love hearts from coffee */}
          <path d="M8 24C7 21 11 20 9 16" stroke="var(--accent-amber)" strokeWidth="1" strokeLinecap="round" opacity={isHovered ? "0.9" : "0.5"} />
          <path d="M12 24C11 21 15 20 13 16" stroke="var(--accent-amber)" strokeWidth="1" strokeLinecap="round" opacity={isHovered ? "0.9" : "0.5"} />
        </svg>
      </div>

      {/* Right Stats */}
      <div style={{
        position: "absolute",
        right: "24px",
        bottom: "8px",
        fontSize: "11px",
        color: "var(--text-muted)",
        fontFamily: "var(--font-code)",
        display: "flex",
        alignItems: "center",
        gap: "12px"
      }}>
        {petCount > 0 && (
          <span style={{ color: "var(--accent-amber)" }}>
            Pets: <strong>{petCount}</strong>
          </span>
        )}
        <span>Speed: <strong style={{ color: "var(--text-parchment)" }}>{wpm || 0} WPM</strong></span>
        <span>Fluency: <strong style={{ color: "var(--accent-sage)" }}>98%</strong></span>
      </div>
    </div>
  );
}
