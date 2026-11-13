import React, { useState, useEffect } from "react";
import { soundEngine } from "../audio/synthAudio";
import { ProviderButtons } from "./ui/ProviderButtons";

export function RepoConnectModal({ isOpen, onClose, onRepoUpdated, onProfileUpdated }) {
  const [activeSubTab, setActiveSubTab] = useState("repo"); // "repo" | "profile"
  const [profile, setProfile] = useState({
    name: "Nadia Rahman",
    role: "Staff Data Engineer",
    target_company: "Meta / Databricks",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&dpr=2&q=80",
    github_username: "nadiarahman"
  });

  const [repoUrl, setRepoUrl] = useState("https://github.com/stratascratch/sql-interview-questions");
  const [repoBranch, setRepoBranch] = useState("main");
  const [selectedPreset, setSelectedPreset] = useState("default");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    fetch("/api/profile")
      .then((res) => res.json())
      .then((p) => setProfile(p))
      .catch((err) => console.error(err));

    fetch("/api/repository/current")
      .then((res) => res.json())
      .then((r) => {
        setRepoUrl(r.url || "");
        setRepoBranch(r.branch || "main");
        setSelectedPreset(r.is_custom ? "custom" : "default");
      })
      .catch((err) => console.error(err));
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveProfile = (e) => {
    e.preventDefault();
    soundEngine.playKeyClick();
    setIsSubmitting(true);

    fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile)
    })
      .then((res) => res.json())
      .then((updated) => {
        setProfile(updated);
        if (onProfileUpdated) onProfileUpdated(updated);
        setSyncStatus("Profile saved successfully!");
        setTimeout(() => setSyncStatus(null), 3000);
      })
      .finally(() => setIsSubmitting(false));
  };

  const handleConnectRepo = (e) => {
    e.preventDefault();
    soundEngine.playKeyClick();
    setIsSubmitting(true);

    fetch("/api/repository/connect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: repoUrl,
        branch: repoBranch,
        preset: selectedPreset
      })
    })
      .then((res) => res.json())
      .then((config) => {
        if (onRepoUpdated) onRepoUpdated(config);
        setSyncStatus(`Connected to ${config.name}! 136 questions indexed & enriched.`);
        setTimeout(() => {
          setSyncStatus(null);
          onClose();
        }, 1500);
      })
      .finally(() => setIsSubmitting(false));
  };

  const handleSelectPreset = (presetKey, url) => {
    soundEngine.playKeyClick();
    setSelectedPreset(presetKey);
    setRepoUrl(url);
  };

  return (
    <div
      className="reui-modal-overlay"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10000,
        padding: "20px"
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="reui-modal-content"
        style={{
          width: "100%",
          maxWidth: "680px",
          background: "#16171b",
          border: "1px solid var(--accent-amber)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.8), 0 0 1px rgba(217, 155, 67, 0.5)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column"
        }}
      >
        {/* Header & Sub-Tabs */}
        <div
          style={{
            padding: "18px 24px 0",
            borderBottom: "1px solid var(--border-subtle)",
            background: "rgba(22, 23, 27, 0.8)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  background: "linear-gradient(135deg, #d99b43 0%, #b87b28 100%)",
                  color: "#111215",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 900
                }}
              >
                ⌘
              </div>
              <div>
                <h3 style={{ margin: 0, fontFamily: "var(--font-heading)", fontSize: "16px", color: "var(--text-parchment)" }}>
                  Plug-and-Play Repository & Profile
                </h3>
                <span style={{ fontSize: "11px", color: "var(--accent-amber)", fontFamily: "var(--font-code)" }}>
                  Bring Your Own Questions • Automated Metadata Enrichment
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-dim)",
                cursor: "pointer",
                fontSize: "18px",
                padding: "4px"
              }}
            >
              ✕
            </button>
          </div>

          {/* Sub-tabs */}
          <div style={{ display: "flex", gap: "16px" }}>
            <button
              type="button"
              onClick={() => setActiveSubTab("repo")}
              style={{
                background: "transparent",
                border: "none",
                borderBottom: activeSubTab === "repo" ? "2px solid var(--accent-amber)" : "2px solid transparent",
                padding: "8px 4px 12px",
                color: activeSubTab === "repo" ? "var(--text-parchment)" : "var(--text-muted)",
                fontSize: "13px",
                fontWeight: activeSubTab === "repo" ? 600 : 400,
                fontFamily: "var(--font-heading)",
                cursor: "pointer"
              }}
            >
              🔗 GitHub Repository Connect
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab("profile")}
              style={{
                background: "transparent",
                border: "none",
                borderBottom: activeSubTab === "profile" ? "2px solid var(--accent-amber)" : "2px solid transparent",
                padding: "8px 4px 12px",
                color: activeSubTab === "profile" ? "var(--text-parchment)" : "var(--text-muted)",
                fontSize: "13px",
                fontWeight: activeSubTab === "profile" ? 600 : 400,
                fontFamily: "var(--font-heading)",
                cursor: "pointer"
              }}
            >
              👤 Profile & Target Goals
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: "24px", maxHeight: "480px", overflowY: "auto" }}>
          {syncStatus && (
            <div
              style={{
                background: "rgba(16, 185, 129, 0.15)",
                border: "1px solid #10b981",
                color: "#10b981",
                padding: "10px 14px",
                borderRadius: "6px",
                fontSize: "12px",
                fontFamily: "var(--font-code)",
                marginBottom: "16px"
              }}
            >
              ✓ {syncStatus}
            </div>
          )}

          {activeSubTab === "repo" ? (
            <form onSubmit={handleConnectRepo} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {/* Presets */}
              <div>
                <label style={{ display: "block", fontSize: "11px", color: "var(--accent-amber)", fontFamily: "var(--font-code)", textTransform: "uppercase", marginBottom: "8px" }}>
                  Select Question Repository Preset
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "8px" }}>
                  {[
                    {
                      id: "default",
                      title: "⭐ StrataScratch Curated Production (136 Questions)",
                      desc: "Full DuckDB schema tables, official test cases, and PySpark solutions",
                      url: "https://github.com/stratascratch/sql-interview-questions"
                    },
                    {
                      id: "leetcode50",
                      title: "🔥 LeetCode SQL 50 & Top Interview Collection",
                      desc: "Top 50 high-frequency SQL interview questions mapped to FAANG",
                      url: "https://github.com/neetcode-gh/leetcode"
                    },
                    {
                      id: "custom",
                      title: "📦 Connect Your Own Custom GitHub Repository",
                      desc: "Bring your own markdown/sql files. Our engine auto-enriches metadata",
                      url: ""
                    }
                  ].map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleSelectPreset(p.id, p.url || repoUrl)}
                      style={{
                        padding: "12px 14px",
                        borderRadius: "6px",
                        background: selectedPreset === p.id ? "rgba(217, 155, 67, 0.1)" : "var(--bg-card)",
                        border: selectedPreset === p.id ? "1px solid var(--accent-amber)" : "1px solid var(--border-subtle)",
                        cursor: "pointer",
                        transition: "all 0.12s ease"
                      }}
                    >
                      <div style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--text-parchment)" }}>
                        {p.title}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--text-dim)", marginTop: "2px" }}>
                        {p.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* GitHub URL Input */}
              <div>
                <label style={{ display: "block", fontSize: "11px", color: "var(--text-dim)", fontFamily: "var(--font-code)", marginBottom: "6px" }}>
                  GitHub Repository URL
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="url"
                    value={repoUrl}
                    onChange={(e) => {
                      setRepoUrl(e.target.value);
                      setSelectedPreset("custom");
                    }}
                    placeholder="https://github.com/username/my-sql-interview-questions"
                    style={{
                      flex: 1,
                      background: "var(--bg-input)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "var(--radius-sm)",
                      padding: "8px 12px",
                      color: "var(--text-parchment)",
                      fontFamily: "var(--font-code)",
                      fontSize: "12px",
                      outline: "none"
                    }}
                  />
                  <input
                    type="text"
                    value={repoBranch}
                    onChange={(e) => setRepoBranch(e.target.value)}
                    placeholder="main"
                    style={{
                      width: "80px",
                      background: "var(--bg-input)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "var(--radius-sm)",
                      padding: "8px 10px",
                      color: "var(--text-parchment)",
                      fontFamily: "var(--font-code)",
                      fontSize: "12px",
                      outline: "none",
                      textAlign: "center"
                    }}
                  />
                </div>
              </div>

              {/* Automated Metadata Engine Feature Card */}
              <div
                style={{
                  background: "rgba(0, 0, 0, 0.4)",
                  border: "1px solid rgba(217, 155, 67, 0.2)",
                  borderRadius: "8px",
                  padding: "14px 16px",
                  fontSize: "11.5px"
                }}
              >
                <div style={{ color: "var(--accent-amber)", fontWeight: 600, fontFamily: "var(--font-code)", marginBottom: "4px" }}>
                  ✨ Automated Metadata Enrichment Engine
                </div>
                <div style={{ color: "var(--text-dim)", lineHeight: 1.5 }}>
                  Even if your questions lack metadata (e.g. only question number or plain SQL filename), RAILS DE automatically detects the corresponding LeetCode ID, matches FAANG target companies (Meta, Google, Amazon), tags the architectural design pattern, and binds DuckDB in-memory test runner.
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "6px" }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    padding: "8px 16px",
                    background: "transparent",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "4px",
                    color: "var(--text-muted)",
                    fontSize: "12px",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="earth-btn earth-btn-primary"
                  style={{ padding: "8px 20px", fontSize: "12px" }}
                >
                  {isSubmitting ? "Connecting & Enriching..." : "Connect & Index Repository →"}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "8px" }}>
                <img
                  src={profile.avatar}
                  alt="Avatar"
                  style={{ width: "56px", height: "56px", borderRadius: "50%", border: "2px solid var(--accent-amber)", objectFit: "cover" }}
                />
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-parchment)" }}>
                    {profile.name}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--accent-amber)", fontFamily: "var(--font-code)" }}>
                    {profile.role}
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", color: "var(--text-dim)", fontFamily: "var(--font-code)", marginBottom: "4px" }}>
                  Display Name
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  style={{
                    width: "100%",
                    background: "var(--bg-input)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "4px",
                    padding: "8px 12px",
                    color: "var(--text-parchment)",
                    fontSize: "12px",
                    outline: "none"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", color: "var(--text-dim)", fontFamily: "var(--font-code)", marginBottom: "4px" }}>
                  Current Role / Title
                </label>
                <input
                  type="text"
                  value={profile.role}
                  onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                  style={{
                    width: "100%",
                    background: "var(--bg-input)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "4px",
                    padding: "8px 12px",
                    color: "var(--text-parchment)",
                    fontSize: "12px",
                    outline: "none"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", color: "var(--text-dim)", fontFamily: "var(--font-code)", marginBottom: "4px" }}>
                  Target Company / Ambition
                </label>
                <input
                  type="text"
                  value={profile.target_company}
                  onChange={(e) => setProfile({ ...profile, target_company: e.target.value })}
                  placeholder="e.g. Meta Staff DE / Databricks"
                  style={{
                    width: "100%",
                    background: "var(--bg-input)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "4px",
                    padding: "8px 12px",
                    color: "var(--text-parchment)",
                    fontSize: "12px",
                    outline: "none"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", color: "var(--text-dim)", fontFamily: "var(--font-code)", marginBottom: "4px" }}>
                  GitHub Username
                </label>
                <input
                  type="text"
                  value={profile.github_username}
                  onChange={(e) => setProfile({ ...profile, github_username: e.target.value })}
                  style={{
                    width: "100%",
                    background: "var(--bg-input)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "4px",
                    padding: "8px 12px",
                    color: "var(--text-parchment)",
                    fontSize: "12px",
                    outline: "none"
                  }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    padding: "8px 16px",
                    background: "transparent",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "4px",
                    color: "var(--text-muted)",
                    fontSize: "12px",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="earth-btn earth-btn-primary"
                  style={{ padding: "8px 20px", fontSize: "12px" }}
                >
                  Save Profile
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
