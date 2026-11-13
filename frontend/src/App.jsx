import React, { useState, useEffect } from "react";
import "./theme/earthly.css";
import { Sidebar } from "./components/Sidebar";
import { Nav } from "./components/Nav";
import { HomeDashboard } from "./components/HomeDashboard";
import { GhostEditor } from "./components/GhostEditor";
import { SoloEditor } from "./components/SoloEditor";
import { MascotConveyor } from "./components/MascotConveyor";
import { CorporateLadder } from "./components/CorporateLadder";
import { Handbook } from "./components/Handbook";
import { RepoConnectModal } from "./components/RepoConnectModal";
import { CompletionModal } from "./components/CompletionModal";
import { AntiPasteModal, ClankerDrawer } from "./components/ClankerAntiPaste";
import { ExtendDrawer } from "./components/ExtendDrawer";
import { MarkdownViewer } from "./components/MarkdownViewer";
import { QuestionTree } from "./components/ui/QuestionTree";
import { ModeToggleGroup } from "./components/ui/ToggleGroup";

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [activeTab, setActiveTab] = useState("home"); // "home" | "workspace" | "handbook" | "ladder"
  const [editorMode, setEditorMode] = useState("solo"); // "solo" | "pair"
  const [currentLanguage, setCurrentLanguage] = useState("SQL");
  const [workspaceDrawerTab, setWorkspaceDrawerTab] = useState("tree"); // "tree" | "spec"
  
  // Persistent Navigation Sidebar State (@reui/c-sidebar-2)
  const [isNavSidebarCollapsed, setIsNavSidebarCollapsed] = useState(false);
  const [repoModalOpen, setRepoModalOpen] = useState(false);

  // User Profile & Repository Plug-and-Play State
  const [profile, setProfile] = useState({
    name: "Nadia Rahman",
    role: "Staff Data Engineer",
    target_company: "Meta / Databricks",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&dpr=2&q=80",
    github_username: "nadiarahman"
  });

  const [repository, setRepository] = useState({
    name: "StrataScratch Standard (136 FAANG Questions)",
    url: "https://github.com/stratascratch/sql-interview-questions",
    branch: "main",
    total_questions: 136,
    is_custom: false
  });

  // Draggable & Adjustable Workspace Sidebar State
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem("rails_sidebar_width");
    return saved ? parseInt(saved, 10) : 420;
  });
  const [isSidebarDragging, setIsSidebarDragging] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [progress, setProgress] = useState({
    current_tier: "L0",
    current_tier_name: "Unemployed",
    xp: 0,
    solved_count: 0,
    streak_days: 1,
    questions: {}
  });

  // Telemetry for Mascot & Conveyor
  const [keystrokes, setKeystrokes] = useState(0);
  const [currentWpm, setCurrentWpm] = useState(0);
  const [currentCombo, setCurrentCombo] = useState(0);

  // Modals & Drawers
  const [antiPasteOpen, setAntiPasteOpen] = useState(false);
  const [clankerOpen, setClankerOpen] = useState(false);
  const [completionData, setCompletionData] = useState(null);

  // Initial Load: Questions, Progress, Profile, Repository
  const loadQuestionsAndState = () => {
    fetch("/api/questions")
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data);
        if (data.length > 0 && !activeQuestion) {
          selectQuestion(data[0]);
        }
      })
      .catch((err) => console.error("Error loading questions", err));

    fetch("/api/progress")
      .then((res) => res.json())
      .then((data) => setProgress(data))
      .catch((err) => console.error("Error loading progress", err));

    fetch("/api/profile")
      .then((res) => res.json())
      .then((p) => setProfile(p))
      .catch((err) => console.error("Error loading profile", err));

    fetch("/api/repository/current")
      .then((res) => res.json())
      .then((r) => setRepository(r))
      .catch((err) => console.error("Error loading repository", err));
  };

  useEffect(() => {
    loadQuestionsAndState();
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleGlobalKey = (e) => {
      // Ctrl/Cmd + H -> Home Dashboard
      if ((e.ctrlKey || e.metaKey) && (e.key === "h" || e.key === "H")) {
        e.preventDefault();
        setActiveTab("home");
        return;
      }
      // Ctrl/Cmd + K -> Workspace
      if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        setActiveTab("workspace");
        return;
      }
      // Ctrl/Cmd + B -> Architectural Handbook
      if ((e.ctrlKey || e.metaKey) && (e.key === "b" || e.key === "B")) {
        e.preventDefault();
        setActiveTab((prev) => (prev === "handbook" ? "workspace" : "handbook"));
        return;
      }
      // Ctrl/Cmd + L -> Career Ladder
      if ((e.ctrlKey || e.metaKey) && (e.key === "l" || e.key === "L")) {
        e.preventDefault();
        setActiveTab("ladder");
        return;
      }
      // Ctrl/Cmd + R -> Repository Connect Modal
      if ((e.ctrlKey || e.metaKey) && (e.key === "r" || e.key === "R") && !e.shiftKey) {
        e.preventDefault();
        setRepoModalOpen((prev) => !prev);
        return;
      }
      // Ctrl/Cmd + / -> Toggle Pair / Solo Mode
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault();
        setEditorMode((prev) => (prev === "pair" ? "solo" : "pair"));
        return;
      }
      // Ctrl/Cmd + [ -> Previous Question
      if ((e.ctrlKey || e.metaKey) && e.key === "[") {
        e.preventDefault();
        handlePrevQuestion();
        return;
      }
      // Ctrl/Cmd + ] -> Next Question
      if ((e.ctrlKey || e.metaKey) && e.key === "]") {
        e.preventDefault();
        handleNextQuestion();
        return;
      }
      // Escape -> Close any open modal
      if (e.key === "Escape") {
        setRepoModalOpen(false);
        setAntiPasteOpen(false);
        setCompletionData(null);
      }
    };

    window.addEventListener("keydown", handleGlobalKey);
    return () => window.removeEventListener("keydown", handleGlobalKey);
  }, [questions, activeQuestion]);

  // Draggable Splitter Handler for Workspace Sidebar
  useEffect(() => {
    if (!isSidebarDragging) return;

    const handleMouseMove = (e) => {
      const maxW = Math.max(400, window.innerWidth * 0.72);
      const clamped = Math.max(280, Math.min(e.clientX, maxW));
      setSidebarWidth(clamped);
    };

    const handleMouseUp = () => {
      setIsSidebarDragging(false);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
      localStorage.setItem("rails_sidebar_width", sidebarWidth.toString());
    };

    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, [isSidebarDragging, sidebarWidth]);

  const selectQuestion = (qSummary) => {
    setLoadingQuestion(true);
    fetch(`/api/questions/${qSummary.difficulty}/${qSummary.id}`)
      .then((res) => res.json())
      .then((data) => {
        setActiveQuestion(data);
      })
      .catch((err) => console.error("Error loading question details", err))
      .finally(() => setLoadingQuestion(false));
  };

  const handlePrevQuestion = () => {
    if (!activeQuestion || questions.length === 0) return;
    const currentIdx = questions.findIndex((q) => q.id === activeQuestion.id);
    const prevIdx = (currentIdx - 1 + questions.length) % questions.length;
    selectQuestion(questions[prevIdx]);
  };

  const handleNextQuestion = () => {
    setCompletionData(null);
    if (!activeQuestion || questions.length === 0) return;
    const currentIdx = questions.findIndex((q) => q.id === activeQuestion.id);
    const nextIdx = (currentIdx + 1) % questions.length;
    selectQuestion(questions[nextIdx]);
  };

  const handleRandomQuestion = () => {
    if (questions.length === 0) return;
    const unattempted = questions.filter((q) => q.progress?.status !== "completed");
    const pool = unattempted.length > 0 ? unattempted : questions;
    const randomQ = pool[Math.floor(Math.random() * pool.length)];
    selectQuestion(randomQ);
  };

  const handleKeystroke = (wpm, combo) => {
    setKeystrokes((prev) => prev + 1);
    setCurrentWpm(wpm || 50);
    setCurrentCombo(combo || 0);
  };

  const handleCompleteQuestion = (data) => {
    if (!activeQuestion) return;

    fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question_id: activeQuestion.id,
        difficulty: activeQuestion.difficulty,
        mode: data.mode,
        grade: data.grade,
        wpm: data.wpm || 0,
        accuracy: data.accuracy || 100,
        elapsed_seconds: data.elapsedSeconds || 0
      })
    })
      .then((res) => res.json())
      .then((updated) => {
        setProgress(updated);
        setActiveQuestion((prev) => ({
          ...prev,
          user_progress: {
            status: "completed",
            grade: data.grade,
            mode: data.mode
          }
        }));
      });

    // Trigger Grounded Post-Mortem Card
    setCompletionData(data);
  };

  const handleSelectQuestFromLadder = (difficulty) => {
    setActiveTab("workspace");
    const matching = questions.find((q) => q.difficulty === difficulty);
    if (matching) {
      selectQuestion(matching);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        background: "var(--bg-study)",
        color: "var(--text-parchment)",
        overflow: "hidden"
      }}
    >
      {/* Persistent Collapsible App Sidebar (@reui/c-sidebar-2) */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === "repository") {
            setRepoModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        isCollapsed={isNavSidebarCollapsed}
        onToggleCollapse={() => setIsNavSidebarCollapsed((prev) => !prev)}
        profile={profile}
        repository={repository}
        onOpenProfile={() => setRepoModalOpen(true)}
        onOpenRepo={() => setRepoModalOpen(true)}
      />

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflow: "hidden",
          position: "relative"
        }}
      >
        {/* Top Header Navigation Bar */}
        <Nav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          currentLanguage={currentLanguage}
          onLanguageChange={setCurrentLanguage}
          onOpenHandbook={() => setActiveTab("handbook")}
          onOpenSearch={() => setWorkspaceDrawerTab("tree")}
          onOpenRepo={() => setRepoModalOpen(true)}
          repoName={repository?.name?.split(" ")[0] || "StrataScratch"}
          currentTier={progress.current_tier}
          streakDays={progress.streak_days || 1}
        />

        {/* Viewport Swapper */}
        <main style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          
          {/* 1. Home Dashboard & Chill Zone */}
          {activeTab === "home" && (
            <HomeDashboard
              onOpenWorkspace={() => setActiveTab("workspace")}
              onOpenHandbook={() => setActiveTab("handbook")}
              onOpenLadder={() => setActiveTab("ladder")}
              onOpenRepo={() => setRepoModalOpen(true)}
              onSelectQuestion={selectQuestion}
            />
          )}

          {/* 2. Career Ladder Progression Skill Tree */}
          {activeTab === "ladder" && (
            <CorporateLadder
              currentTier={progress.current_tier}
              xp={progress.xp}
              solvedCount={progress.solved_count}
              onSelectQuest={handleSelectQuestFromLadder}
              onOpenHandbook={() => setActiveTab("handbook")}
            />
          )}

          {/* 3. Full-Screen Architectural Handbook Codex */}
          {activeTab === "handbook" && (
            <Handbook onOpenWorkspace={() => setActiveTab("workspace")} />
          )}

          {/* 4. LeetCode Study Workspace */}
          {activeTab === "workspace" && (
            <div className="workspace-shell" style={{ height: "calc(100vh - 54px - 64px)" }}>
              {/* Collapsed Strip if Workspace Drawer is Minimized */}
              {isSidebarCollapsed ? (
                <div
                  onClick={() => setIsSidebarCollapsed(false)}
                  title="Expand Problem Navigator & Tree (Click to open)"
                  style={{
                    width: "38px",
                    background: "var(--bg-desk)",
                    borderRight: "1px solid var(--border-subtle)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    paddingTop: "16px",
                    cursor: "pointer",
                    userSelect: "none",
                    zIndex: 10,
                    transition: "background 0.15s ease"
                  }}
                >
                  <span style={{ fontSize: "12px", color: "var(--accent-amber)" }}>▶</span>
                  <span
                    style={{
                      writingMode: "vertical-rl",
                      textOrientation: "mixed",
                      fontSize: "11px",
                      color: "var(--text-muted)",
                      marginTop: "16px",
                      fontFamily: "var(--font-code)",
                      letterSpacing: "0.1em"
                    }}
                  >
                    TREE // SPEC
                  </span>
                </div>
              ) : (
                <>
                  {/* Left Drawer: Question Tree (@reui/c-tree-3) & Problem Spec */}
                  <div
                    className="workspace-left-drawer"
                    style={{ width: `${sidebarWidth}px`, display: "flex", flexDirection: "column" }}
                  >
                    {/* Drawer Mode Tabs: Tree vs Spec */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "8px 12px",
                        borderBottom: "1px solid var(--border-subtle)",
                        background: "rgba(17, 18, 21, 0.9)"
                      }}
                    >
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          type="button"
                          onClick={() => setWorkspaceDrawerTab("tree")}
                          style={{
                            padding: "4px 10px",
                            borderRadius: "4px",
                            fontSize: "11px",
                            fontFamily: "var(--font-code)",
                            background: workspaceDrawerTab === "tree" ? "var(--bg-card)" : "transparent",
                            border: workspaceDrawerTab === "tree" ? "1px solid var(--accent-amber)" : "1px solid transparent",
                            color: workspaceDrawerTab === "tree" ? "var(--accent-amber)" : "var(--text-muted)",
                            cursor: "pointer"
                          }}
                        >
                          🌲 Tree Navigator
                        </button>
                        <button
                          type="button"
                          onClick={() => setWorkspaceDrawerTab("spec")}
                          style={{
                            padding: "4px 10px",
                            borderRadius: "4px",
                            fontSize: "11px",
                            fontFamily: "var(--font-code)",
                            background: workspaceDrawerTab === "spec" ? "var(--bg-card)" : "transparent",
                            border: workspaceDrawerTab === "spec" ? "1px solid var(--accent-amber)" : "1px solid transparent",
                            color: workspaceDrawerTab === "spec" ? "var(--accent-amber)" : "var(--text-muted)",
                            cursor: "pointer"
                          }}
                        >
                          📜 Problem Spec
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsSidebarCollapsed(true)}
                        className="earth-btn"
                        style={{ fontSize: "10.5px", padding: "3px 8px" }}
                        title="Minimize drawer to expand Editor"
                      >
                        ◀ Minimize
                      </button>
                    </div>

                    {/* Drawer Body */}
                    <div style={{ flex: 1, overflowY: "auto" }}>
                      {workspaceDrawerTab === "tree" ? (
                        <QuestionTree
                          questions={questions}
                          activeQuestion={activeQuestion}
                          onSelectQuestion={(q) => {
                            selectQuestion(q);
                            setWorkspaceDrawerTab("spec");
                          }}
                          onNextQuestion={handleNextQuestion}
                          onPrevQuestion={handlePrevQuestion}
                          onRandomQuestion={handleRandomQuestion}
                        />
                      ) : (
                        <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: "16px" }}>
                          {/* Question Header & LeetCode info */}
                          <div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                              <div style={{ fontSize: "11px", color: "var(--accent-amber)", fontFamily: "var(--font-code)", textTransform: "uppercase" }}>
                                Level: {activeQuestion?.difficulty?.toUpperCase()} · {activeQuestion?.tier_name}
                              </div>
                              {activeQuestion?.leetcode_id && (
                                <a
                                  href={activeQuestion.leetcode_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ fontSize: "10px", color: "var(--accent-amber)", textDecoration: "underline", fontFamily: "var(--font-code)" }}
                                >
                                  LC #{activeQuestion.leetcode_id} ↗
                                </a>
                              )}
                            </div>
                            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", fontWeight: 600, color: "var(--text-parchment)", margin: "4px 0 0", lineHeight: 1.3 }}>
                              {activeQuestion?.title || "Loading..."}
                            </h1>
                            {activeQuestion?.companies && activeQuestion.companies.length > 0 && (
                              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "6px" }}>
                                {activeQuestion.companies.map((c) => (
                                  <span key={c} style={{ fontSize: "10px", background: "rgba(255,255,255,0.05)", color: "var(--text-muted)", padding: "1px 6px", borderRadius: "3px", fontFamily: "var(--font-code)" }}>
                                    {c}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Input Schema Specification */}
                          <div>
                            <div style={{ fontFamily: "var(--font-heading)", fontSize: "12px", color: "var(--text-parchment)", fontWeight: 600, marginBottom: "8px", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "4px" }}>
                              Schema & Example Tables
                            </div>
                            {activeQuestion?.example_input_tables && Object.keys(activeQuestion.example_input_tables).length > 0 ? (
                              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                {Object.entries(activeQuestion.example_input_tables).map(([tblName, tblData]) => (
                                  <div key={tblName} style={{ background: "var(--bg-study)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)", padding: "10px" }}>
                                    <div style={{ fontFamily: "var(--font-code)", fontSize: "11px", color: "var(--accent-amber)", marginBottom: "6px", fontWeight: 500 }}>
                                      Table: {tblName}
                                    </div>
                                    <div style={{ overflowX: "auto" }}>
                                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px", fontFamily: "var(--font-code)" }}>
                                        <thead>
                                          <tr>
                                            {tblData.columns?.map((c, i) => (
                                              <th key={i} style={{ color: "var(--text-muted)", textAlign: "left", padding: "4px 8px", borderBottom: "1px solid var(--border-subtle)" }}>
                                                {c}
                                              </th>
                                            ))}
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {tblData.rows?.slice(0, 3).map((r, ri) => (
                                            <tr key={ri}>
                                              {tblData.columns?.map((c, ci) => (
                                                <td key={ci} style={{ padding: "4px 8px", color: "var(--text-parchment)", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                                                  {String(r[c])}
                                                </td>
                                              ))}
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div style={{ fontFamily: "var(--font-code)", fontSize: "11.5px", color: "var(--text-dim)" }}>
                                <div>in:  schema validated</div>
                                <div>out: relational tuples</div>
                              </div>
                            )}
                          </div>

                          {/* Problem Description Markdown */}
                          <div>
                            <div style={{ fontFamily: "var(--font-heading)", fontSize: "12px", color: "var(--text-parchment)", fontWeight: 600, marginBottom: "8px", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "4px" }}>
                              Problem Description
                            </div>
                            {activeQuestion?.question_markdown ? (
                              <MarkdownViewer content={activeQuestion.question_markdown} />
                            ) : (
                              <p style={{ fontSize: "12.5px", color: "var(--text-muted)", lineHeight: 1.6 }}>
                                {activeQuestion?.problem_statement}
                              </p>
                            )}
                          </div>

                          {/* Post-Solve Reflection */}
                          {activeQuestion && (
                            <ExtendDrawer
                              question={activeQuestion}
                              onSaveNote={() => {}}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Draggable Vertical Splitter Resizer */}
                  <div
                    className={`workspace-resizer ${isSidebarDragging ? "dragging" : ""}`}
                    onMouseDown={() => setIsSidebarDragging(true)}
                    title="Drag to resize problem specification (double-click to reset)"
                    onDoubleClick={() => setSidebarWidth(420)}
                  />
                </>
              )}

              {/* Right Editor Workspace */}
              <div className="workspace-right-editor">
                
                {/* Editor Control Toolbar with Mode Toggle Group (@reui/c-toggle-group-13) */}
                <div
                  style={{
                    padding: "8px 16px",
                    borderBottom: "1px solid var(--border-subtle)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "var(--bg-desk)",
                    flexWrap: "wrap",
                    gap: "8px"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {/* Toggle Group */}
                    <ModeToggleGroup
                      value={editorMode}
                      onChange={setEditorMode}
                      onOpenExtend={() => setClankerOpen(true)}
                    />

                    {/* Prev / Next Quick Jump */}
                    <div style={{ display: "flex", gap: "4px" }}>
                      <button
                        type="button"
                        onClick={handlePrevQuestion}
                        title="Previous Question (Ctrl+[)"
                        className="earth-btn"
                        style={{ fontSize: "10.5px", padding: "4px 8px" }}
                      >
                        ◀ Prev
                      </button>
                      <button
                        type="button"
                        onClick={handleNextQuestion}
                        title="Next Question (Ctrl+])"
                        className="earth-btn"
                        style={{ fontSize: "10.5px", padding: "4px 8px" }}
                      >
                        Next ▶
                      </button>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", color: "var(--text-dim)", fontFamily: "var(--font-code)" }}>
                    <span>DuckDB Engine Active</span>
                    <span className="earth-shortcut-badge">⌘/ Mode</span>
                  </div>
                </div>

                {/* Active Editor */}
                <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
                  {editorMode === "pair" ? (
                    <GhostEditor
                      targetCode={activeQuestion?.canonical_solution}
                      questionId={activeQuestion?.id}
                      difficulty={activeQuestion?.difficulty}
                      onComplete={handleCompleteQuestion}
                      onKeystroke={handleKeystroke}
                      onPasteAttempt={() => setAntiPasteOpen(true)}
                    />
                  ) : (
                    <SoloEditor
                      question={activeQuestion}
                      onComplete={handleCompleteQuestion}
                      onKeystroke={handleKeystroke}
                      onPasteAttempt={() => setAntiPasteOpen(true)}
                    />
                  )}
                </div>

              </div>
            </div>
          )}

        </main>

        {/* Bottom Conveyor with Hand-Drawn Companion */}
        <MascotConveyor
          keystrokeCount={keystrokes}
          wpm={currentWpm}
          combo={currentCombo}
          isTyping={true}
        />
      </div>

      {/* Plug-and-Play Repository Connect & Profile Modal */}
      <RepoConnectModal
        isOpen={repoModalOpen}
        onClose={() => setRepoModalOpen(false)}
        onRepoUpdated={(newRepo) => {
          setRepository(newRepo);
          loadQuestionsAndState();
        }}
        onProfileUpdated={(newProfile) => {
          setProfile(newProfile);
        }}
      />

      {/* Post-Mortem Reflection Modal */}
      <CompletionModal
        isOpen={!!completionData}
        question={activeQuestion}
        stats={completionData}
        completedCode={completionData?.completedCode}
        onClose={() => setCompletionData(null)}
        onNextQuestion={handleNextQuestion}
      />

      {/* Anti-Paste Modal & Clanker Drawer */}
      <AntiPasteModal
        isOpen={antiPasteOpen}
        onClose={() => setAntiPasteOpen(false)}
      />
      
      <ClankerDrawer
        isOpen={clankerOpen}
        onClose={() => setClankerOpen(false)}
      />
    </div>
  );
}
