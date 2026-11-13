/** [v1.0-scaffold] Initial Component Architecture **/
import React from "react";
import { soundEngine } from "../audio/synthAudio";
import { ProviderButtons } from "./ui/ProviderButtons";

export function Sidebar({
  activeTab,
  onTabChange,
  isCollapsed,
  onToggleCollapse,
  profile,
  repository,
  onOpenProfile,
  onOpenRepo
}) {
  const navItems = [
    {
      id: "home",
      label: "Home Dashboard",
      tooltip: "Home Dashboard & Chill Zone (⌘H)",
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="9" />
          <rect x="14" y="3" width="7" height="5" />
          <rect x="14" y="12" width="7" height="9" />
          <rect x="3" y="16" width="7" height="5" />
        </svg>
      )
    },
    {
      id: "workspace",
      label: "SQL Workspace",
      tooltip: "LeetCode Practice IDE & DuckDB (⌘K)",
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        </svg>
      )
    },
    {
      id: "handbook",
      label: "Patterns Codex",
      tooltip: "89 Architectural Patterns & Autocomplete (⌘B)",
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      )
    },
    {
      id: "ladder",
      label: "Career Ladder",
      tooltip: "Assassin's Creed Valhalla Skill Progression (⌘L)",
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
          <polyline points="16 7 22 7 22 13" />
        </svg>
      )
    },
    {
      id: "repository",
      label: "Connect Repository",
      tooltip: "GitHub Repositories & Plug-and-Play Metadata",
      badge: repository?.is_custom ? "Custom" : "136",
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="6" y1="3" x2="6" y2="15" />
          <circle cx="18" cy="6" r="3" />
          <circle cx="6" cy="18" r="3" />
          <path d="M18 9a9 9 0 0 1-9 9" />
        </svg>
      )
    }
  ];

  const monitors = [
    {
      label: "DuckDB Engine",
      value: "99.9% Ready",
      icon: "⚡"
    },
    {
      label: "Questions Catalog",
      value: `${repository?.total_questions || 136} Active`,
      icon: "📦"
    }
  ];

  const handleNavClick = (id) => {
    soundEngine.playKeyClick();
    onTabChange(id);
  };

  return (
    <aside
      className={`reui-sidebar ${isCollapsed ? "collapsed" : ""}`}
      style={{
        width: isCollapsed ? "54px" : "240px",
        flexShrink: 0,
        background: "#111215",
        borderRight: "1px solid var(--border-subtle)",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "hidden",
        zIndex: 50,
        userSelect: "none"
      }}
    >
      {/* Brand Header & Toggle Strip */}
      <div
        style={{
          height: "54px",
          display: "flex",
          alignItems: "center",
          justifyContent: isCollapsed ? "center" : "space-between",
          padding: isCollapsed ? "0" : "0 14px",
          borderBottom: "1px solid var(--border-subtle)",
          background: "rgba(22, 23, 27, 0.6)"
        }}
      >
        {!isCollapsed ? (
          <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
            {/* Golden Brand Mark Icon */}
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "6px",
                background: "linear-gradient(135deg, #d99b43 0%, #b87b28 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#111215",
                fontWeight: 900,
                fontSize: "14px",
                boxShadow: "0 2px 8px rgba(217, 155, 67, 0.3)",
                flexShrink: 0
              }}
            >
              R
            </div>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "var(--text-parchment)",
                  letterSpacing: "0.04em",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}
              >
                RAILS // DE
              </div>
              <div style={{ fontSize: "9.5px", fontFamily: "var(--font-code)", color: "var(--accent-amber)" }}>
                Plug & Play Architect
              </div>
            </div>
          </div>
        ) : (
          <div
            title="Expand Navigation (Ctrl+B)"
            onClick={onToggleCollapse}
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "6px",
              background: "linear-gradient(135deg, #d99b43 0%, #b87b28 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#111215",
              fontWeight: 900,
              fontSize: "14px",
              cursor: "pointer"
            }}
          >
            R
          </div>
        )}

        {/* Collapse Button */}
        {!isCollapsed && (
          <button
            type="button"
            onClick={onToggleCollapse}
            title="Collapse Sidebar"
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-dim)",
              cursor: "pointer",
              padding: "4px",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center"
            }}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}
      </div>

      {/* Main Navigation Links */}
      <div style={{ flex: 1, padding: "10px 8px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "4px" }}>
        {!isCollapsed && (
          <div style={{ padding: "4px 8px", fontSize: "10px", fontFamily: "var(--font-code)", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Platform
          </div>
        )}

        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.id)}
              title={isCollapsed ? item.tooltip : undefined}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: isCollapsed ? "center" : "flex-start",
                gap: "10px",
                padding: isCollapsed ? "10px 0" : "8px 10px",
                borderRadius: "var(--radius-sm)",
                background: isActive ? "var(--bg-card)" : "transparent",
                borderLeft: isActive ? "3px solid var(--accent-amber)" : "3px solid transparent",
                border: "none",
                color: isActive ? "var(--text-parchment)" : "var(--text-muted)",
                cursor: "pointer",
                transition: "all 0.12s ease",
                fontFamily: "var(--font-body)",
                fontSize: "12.5px",
                fontWeight: isActive ? 600 : 400,
                width: "100%",
                textAlign: "left"
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = "transparent";
              }}
            >
              <span style={{ color: isActive ? "var(--accent-amber)" : "var(--text-dim)", display: "flex", flexShrink: 0 }}>
                {item.icon}
              </span>

              {!isCollapsed && (
                <>
                  <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {item.label}
                  </span>
                  {item.badge && (
                    <span
                      style={{
                        fontSize: "9.5px",
