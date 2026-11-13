import React, { useEffect, useRef } from "react";
import { Marked } from "marked";
import mermaid from "mermaid";

// Initialize Mermaid with dark theme and strictly suppressed internal error popups
try {
  mermaid.initialize({
    startOnLoad: false,
    suppressErrorRendering: true,
    theme: "dark",
    themeVariables: {
      darkMode: true,
      background: "#16171b",
      primaryColor: "#1c1d22",
      primaryTextColor: "#ece8e1",
      primaryBorderColor: "#d99b43",
      lineColor: "#d99b43",
      secondaryColor: "#24262d",
      tertiaryColor: "#111215",
      fontFamily: "'Google Sans', sans-serif"
    },
    securityLevel: "loose"
  });

  if (typeof mermaid.setParseErrorHandler === "function") {
    mermaid.setParseErrorHandler(() => {});
  }
  mermaid.parseError = () => {};
} catch (e) {
  // Initialization fallback
}

// Global Zero-Tolerance MutationObserver to instantly eradicate any Mermaid error bomb or SVG
if (typeof window !== "undefined" && !window.__mermaidBombObserverInstalled) {
  window.__mermaidBombObserverInstalled = true;
  const eradicateNode = (node) => {
    if (!node || node.nodeType !== 1) return;
    const isBomb =
      (node.id && (node.id.startsWith("dmermaid") || node.id.startsWith("mermaid-error"))) ||
      node.classList?.contains("error-icon") ||
      node.getAttribute?.("aria-roledescription") === "error" ||
      (node.textContent && node.textContent.includes("Syntax error in text"));
    if (isBomb) {
      try {
        node.remove();
      } catch (err) {}
    }
  };

  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const added of m.addedNodes) {
        eradicateNode(added);
        if (added.querySelectorAll) {
          added.querySelectorAll("[id^='dmermaid'], [id^='mermaid-error'], .error-icon, svg[aria-roledescription='error']").forEach(eradicateNode);
        }
      }
    }
  });

  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
  } else {
    window.addEventListener("DOMContentLoaded", () => {
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }
}

// Configure Marked parser
const markdownParser = new Marked({
  gfm: true,
  breaks: true
});

markdownParser.use({
  renderer: {
    code(...args) {
      const firstArg = args[0];
      const text = typeof firstArg === "object" ? (firstArg?.text || "") : String(firstArg || "");
      const lang = (typeof firstArg === "object" ? (firstArg?.lang || "") : (args[1] || "")).toLowerCase().trim();

      if (lang === "mermaid") {
        return `<div class="mermaid-diagram-wrap"><div class="mermaid-diagram" data-mermaid="${encodeURIComponent(text)}"></div></div>`;
      }
      return `<pre class="code-block" style="background: #131417; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 12px; overflow-x: auto; margin: 12px 0;"><code class="language-${lang || 'text'}" style="font-family: var(--font-code); font-size: 12px; color: var(--text-parchment);">${text}</code></pre>`;
    }
  }
});

// Purge any mermaid error elements or bombs from DOM
function purgeMermaidBombs() {
  if (typeof document === "undefined") return;
  const bombs = document.querySelectorAll(
    "[id^='dmermaid'], [id^='mermaid-error'], .error-icon, div.mermaid > svg, svg[aria-roledescription='error']"
  );
  bombs.forEach(el => {
    try {
      el.remove();
    } catch (e) {}
  });

  // Check body children directly
  Array.from(document.body.children).forEach(child => {
    if (
      (child.id && (child.id.startsWith("dmermaid") || child.id.startsWith("mermaid-error"))) ||
      (child.tagName === "svg" && child.textContent?.includes("Syntax error in text"))
    ) {
      try {
        child.remove();
      } catch (e) {}
    }
  });
}

// Robust Sanitizer: Replaces unquoted & reserved chars in Mermaid graphs
function sanitizeMermaid(raw) {
  if (!raw) return "";
  const lines = raw.split(/\r?\n/);
  let inGraph = false;

  const cleaned = lines.map(line => {
    const trimmed = line.trim();
    if (!trimmed) return "";

    if (/^(flowchart|graph|sequenceDiagram|stateDiagram|classDiagram|erDiagram|xychart|pie|gitGraph)/i.test(trimmed)) {
      inGraph = true;
      if (/^flowchart\s*$/i.test(trimmed)) return "flowchart TD";
      if (/^graph\s*$/i.test(trimmed)) return "graph TD";
      return line;
    }
    if (!inGraph) {
      inGraph = true;
      return "flowchart TD\n" + line;
    }

    // Convert unicode em-dashes and arrows like ──> or → to standard ascii -->
    let l = line
      .replace(/[─—–]{2,}>/g, "-->")
      .replace(/[─—–]{2,}/g, "---")
      .replace(/→/g, "-->")
      .replace(/⟶/g, "-->");

    // Clean node brackets: NodeID[...]
    l = l.replace(/(\b[A-Za-z0-9_]+)\s*\[([^\]\n]+)\]/g, (match, id, text) => {
      let inner = text.trim();
      if ((inner.startsWith('"') && inner.endsWith('"')) || (inner.startsWith("'") && inner.endsWith("'"))) {
        inner = inner.slice(1, -1);
      }
      const safe = inner
        .replace(/"/g, "'")
        .replace(/&/g, "and")
        .replace(/\|/g, "/")
        .replace(/~/g, "-")
        .trim();
      return `${id}["${safe}"]`;
    });

    // Clean node curly braces: NodeID{...}
    l = l.replace(/(\b[A-Za-z0-9_]+)\s*\{([^\}\n]+)\}/g, (match, id, text) => {
      let inner = text.trim();
      if ((inner.startsWith('"') && inner.endsWith('"')) || (inner.startsWith("'") && inner.endsWith("'"))) {
        inner = inner.slice(1, -1);
      }
      const safe = inner
        .replace(/"/g, "'")
        .replace(/&/g, "and")
        .replace(/\|/g, "/")
        .replace(/~/g, "-")
        .trim();
      return `${id}{"${safe}"}`;
    });

    // Clean node parentheses: NodeID(...)
    l = l.replace(/(\b[A-Za-z0-9_]+)\s*\(([^\)\n]+)\)/g, (match, id, text) => {
      let inner = text.trim();
      if ((inner.startsWith('"') && inner.endsWith('"')) || (inner.startsWith("'") && inner.endsWith("'"))) {
        inner = inner.slice(1, -1);
      }
      const safe = inner
        .replace(/"/g, "'")
        .replace(/&/g, "and")
        .replace(/\|/g, "/")
        .replace(/~/g, "-")
        .trim();
      return `${id}("${safe}")`;
    });

    // Clean edge labels: -->|Label|
    l = l.replace(/-->\|([^|\n]+)\|/g, (match, label) => {
      const safeLabel = label.replace(/"/g, "'").replace(/\|/g, "/").trim();
      return `-->|${safeLabel}|`;
    });

    return l;
  });

  return cleaned.join("\n");
}

// Fallback Visual Flowchart renderer for complex diagrams
function renderVisualFallback(code) {
  const lines = code.split(/\r?\n/).filter(l => l.trim() && !l.trim().startsWith("flowchart") && !l.trim().startsWith("graph"));
  const nodes = [];

  lines.forEach(l => {
    // Extract node text and transitions
    const match = l.match(/\["([^"]+)"\]|\{([^\}]+)\}|\[([^\]]+)\]/);
    if (match) {
      const text = match[1] || match[2] || match[3];
      if (text && !nodes.includes(text)) {
        nodes.push(text);
      }
    }
  });

  if (nodes.length === 0) {
    return `<pre style="margin: 0; color: #a1a1aa; overflow-x: auto; line-height: 1.5; font-family: 'Google Sans', sans-serif;">${code}</pre>`;
  }

  return `
    <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 12px 0;">
      ${nodes.map((node, i) => `
        <div style="background: #1c1d22; border: 1px solid var(--accent-amber); border-radius: 6px; padding: 8px 16px; font-family: 'Google Sans', sans-serif; font-size: 11px; color: var(--text-parchment); max-width: 90%; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
          ${node}
        </div>
        ${i < nodes.length - 1 ? `<div style="color: var(--accent-amber); font-size: 14px; line-height: 1;">↓</div>` : ""}
      `).join("")}
    </div>
  `;
}

export function MarkdownViewer({ content }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !content) return;

    purgeMermaidBombs();

    // Strip yaml frontmatter if present
    let rawContent = content;
    if (rawContent.startsWith("---")) {
      const parts = rawContent.split("---", 3);
      if (parts.length >= 3) {
        rawContent = parts[2].trim();
      }
    }

    try {
      const rawHtml = markdownParser.parse(rawContent);
      containerRef.current.innerHTML = rawHtml;
    } catch (parseErr) {
      console.warn("Markdown parse warning:", parseErr);
      containerRef.current.innerText = rawContent;
      return;
    }

    // Render Mermaid diagrams safely
    const mermaidNodes = containerRef.current.querySelectorAll(".mermaid-diagram");
    mermaidNodes.forEach(async (node, idx) => {
      const rawCode = decodeURIComponent(node.getAttribute("data-mermaid") || "");
      const sanitized = sanitizeMermaid(rawCode);
      const uniqueId = `mermaid_diag_${Date.now()}_${idx}_${Math.floor(Math.random() * 10000)}`;

      try {
        const { svg } = await mermaid.render(uniqueId, sanitized);
        node.innerHTML = svg;
      } catch (err) {
        purgeMermaidBombs();

        // Render clean earthly visual flowchart fallback
        node.innerHTML = `
          <div style="background: #16171b; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 16px; margin: 8px 0; text-align: left;">
            <div style="color: var(--accent-amber); font-size: 10px; margin-bottom: 10px; text-transform: uppercase; font-family: 'Space Grotesk', sans-serif; letter-spacing: 0.05em; font-weight: 600;">
              Execution Flow Architecture
            </div>
            ${renderVisualFallback(sanitized || rawCode)}
          </div>
        `;
      } finally {
        purgeMermaidBombs();
      }
    });

    return () => {
      purgeMermaidBombs();
    };
  }, [content]);

  return (
    <div
      ref={containerRef}
      className="markdown-rendered-body"
      style={{
        lineHeight: 1.7,
        fontSize: "0.875rem",
        color: "var(--text-parchment)",
        overflowWrap: "break-word"
      }}
    />
  );
}
