/** [v1.0-scaffold] Initial Component Architecture **/
import React, { useState, useRef, useEffect } from "react";

export function HoverCard({ trigger, children, openDelay = 100, closeDelay = 150 }) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const openTimeoutRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  const triggerRef = useRef(null);
  const contentRef = useRef(null);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    openTimeoutRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        // Position card to the right or below trigger
        const spaceRight = window.innerWidth - rect.right;
        const left = spaceRight > 320 ? rect.right + 12 : Math.max(16, rect.left - 290);
        const top = Math.min(window.innerHeight - 260, Math.max(16, rect.top - 20));
        setCoords({ top, left });
      }
      setIsOpen(true);
    }, openDelay);
  };

  const handleMouseLeave = () => {
    if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, closeDelay);
  };

  useEffect(() => {
    return () => {
      if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  return (
    <div
      ref={triggerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ position: "relative", display: "inline-block", width: "100%" }}
    >
      {trigger}

      {isOpen && (
        <div
          ref={contentRef}
          onMouseEnter={() => {
            if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
          }}
          onMouseLeave={handleMouseLeave}
          style={{
            position: "fixed",
            top: `${coords.top}px`,
            left: `${coords.left}px`,
            zIndex: 9999,
            width: "300px",
            background: "#16171b",
            border: "1px solid var(--accent-amber)",
            borderRadius: "var(--radius-md)",
            padding: "14px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.6), 0 0 1px rgba(217, 155, 67, 0.4)",
            animation: "reui-fade-in 0.15s ease-out",
            pointerEvents: "auto"
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function PatternHoverCardContent({ pattern }) {
  if (!pattern) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {/* Category Pill & Difficulty */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span
          style={{
            fontSize: "10px",
            fontFamily: "var(--font-code)",
            textTransform: "uppercase",
            color: "var(--accent-amber)",
            background: "rgba(217, 155, 67, 0.12)",
            padding: "2px 8px",
            borderRadius: "10px",
            letterSpacing: "0.04em"
          }}
        >
          {pattern.category || "Design Pattern"}
        </span>
        <span
          style={{
            fontSize: "10px",
            fontFamily: "var(--font-code)",
            color: "#10b981",
            display: "flex",
            alignItems: "center",
            gap: "4px"
          }}
        >
          ● 89 Patterns Codex
        </span>
      </div>

      {/* Title */}
      <div
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "14px",
          fontWeight: 600,
          color: "var(--text-parchment)",
          lineHeight: 1.3
        }}
      >
