/** [v1.0-scaffold] Initial Component Architecture **/
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
