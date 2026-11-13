/** [v1.0-scaffold] Initial Component Architecture **/
import React, { useState, useRef, useEffect, useMemo } from "react";
import { soundEngine } from "../../audio/synthAudio";

export function GroupedAutocomplete({
  items = [],
  placeholder = "Search patterns by name or group (e.g. Window, Pivot, Gaps)...",
  onSelectPattern,
  className = ""
}) {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Group items by category
  const groupedData = useMemo(() => {
    const groups = {};
    const query = value.toLowerCase().trim();

    items.forEach((item) => {
      const titleMatches = item.title.toLowerCase().includes(query);
      const catMatches = item.category.toLowerCase().includes(query);

      if (!query || titleMatches || catMatches) {
        if (!groups[item.category]) {
          groups[item.category] = [];
        }
        groups[item.category].push(item);
      }
    });

    return Object.keys(groups).map((category) => ({
      category,
      items: groups[category]
    }));
  }, [items, value]);

  // Flat list of matching items for keyboard navigation
  const flatMatches = useMemo(() => {
    return groupedData.flatMap((g) => g.items);
  }, [groupedData]);

  // Handle outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      setOpen(true);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, flatMatches.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + flatMatches.length) % Math.max(1, flatMatches.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (flatMatches[selectedIndex]) {
        handleSelectItem(flatMatches[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const handleSelectItem = (item) => {
    soundEngine.playKeyClick();
    setValue(item.title);
    setOpen(false);
    if (onSelectPattern) {
      onSelectPattern(item);
    }
  };

  return (
    <div className={`reui-autocomplete-root ${className}`} style={{ position: "relative", width: "100%" }}>
      {/* Search Input Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "var(--bg-input)",
          border: open ? "1px solid var(--accent-amber)" : "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-sm)",
          padding: "7px 12px",
          transition: "border-color 0.15s ease",
          boxShadow: open ? "0 0 0 2px rgba(217, 155, 67, 0.15)" : "none"
        }}
      >
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--accent-amber)", flexShrink: 0 }}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setOpen(true);
            setSelectedIndex(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "var(--text-parchment)",
            fontFamily: "var(--font-body)",
            fontSize: "12.5px"
          }}
        />

        {value && (
          <button
            type="button"
            onClick={() => {
              setValue("");
              inputRef.current?.focus();
            }}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-dim)",
              cursor: "pointer",
              padding: "2px",
              display: "flex",
              alignItems: "center"
            }}
          >
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown List */}
      {open && (
        <div
          ref={dropdownRef}
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            maxHeight: "340px",
            overflowY: "auto",
            background: "#16171b",
            border: "1px solid var(--accent-amber)",
            borderRadius: "var(--radius-sm)",
            boxShadow: "0 12px 32px rgba(0, 0, 0, 0.7), 0 0 1px rgba(217, 155, 67, 0.4)",
            zIndex: 1000,
            padding: "4px 0"
          }}
        >
          {flatMatches.length === 0 ? (
            <div style={{ padding: "16px", textAlign: "center", color: "var(--text-dim)", fontSize: "12px", fontFamily: "var(--font-code)" }}>
              No matching architectural patterns found.
            </div>
          ) : (
            groupedData.map((group) => (
              <div key={group.category} style={{ marginBottom: "6px" }}>
                {/* Sticky Group Label */}
                <div
                  style={{
