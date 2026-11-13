/** [v1.0-scaffold] Initial Component Architecture **/
import React from "react";

export function Skeleton({ className = "", style = {} }) {
  return (
    <div
      className={`reui-skeleton ${className}`}
      style={{
        background: "linear-gradient(90deg, rgba(255, 255, 255, 0.03) 25%, rgba(255, 255, 255, 0.08) 50%, rgba(255, 255, 255, 0.03) 75%)",
        backgroundSize: "200% 100%",
        animation: "reui-shimmer 1.8s infinite ease-in-out",
        borderRadius: "4px",
        ...style
      }}
    />
  );
}

// Skeleton-7: Card with Avatar & Multiple text lines
export function SkeletonCard({ lines = 3, hasAvatar = true, className = "" }) {
  return (
    <div
      className={`reui-skeleton-card ${className}`}
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-md)",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {hasAvatar && (
          <Skeleton style={{ width: "36px", height: "36px", borderRadius: "50%", flexShrink: 0 }} />
        )}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
          <Skeleton style={{ width: "60%", height: "14px" }} />
          <Skeleton style={{ width: "40%", height: "10px" }} />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            style={{
              width: i === lines - 1 ? "75%" : "100%",
              height: "12px"
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Skeleton-8: Tree / List Row Item
export function SkeletonTreeItem({ count = 5 }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "8px" }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "6px 8px" }}>
          <Skeleton style={{ width: "16px", height: "16px", borderRadius: "3px" }} />
          <Skeleton style={{ width: `${55 + (i * 11) % 35}%`, height: "13px" }} />
          <Skeleton style={{ width: "38px", height: "16px", borderRadius: "10px", marginLeft: "auto" }} />
        </div>
      ))}
    </div>
  );
}

// Skeleton-9: Query Table Result Skeleton
export function SkeletonTable({ rows = 4, cols = 4 }) {
  return (
