// src/components/InsightsPanel.jsx
// Generates smart, contextual risk insight cards based on the portfolio analysis.

import React from "react";
import { getSectorData } from "../utils/calculations";

export function InsightsPanel({ result, macroShocks }) {
  const { details, totalCurr, avgBeta, riskScore } = result;
  const sectorData = getSectorData(details, totalCurr);
  const techPct = (sectorData.find(([s]) => s === "Tech")?.[1] / totalCurr) * 100 || 0;

  const items = [];

  if (techPct > 60)
    items.push({
      icon: "⚠️",
      title: "Dangerous tech concentration",
      body: `${Math.round(techPct)}% of your portfolio is in tech — well above the recommended 30–40% max. A sector-specific correction could cause outsized losses.`,
      tag: "CONCENTRATION",
      cls: "danger",
    });

  if (riskScore > 70)
    items.push({
      icon: "🔥",
      title: "Aggressive growth profile",
      body: "Your portfolio behaves like an aggressive growth ETF. Expect 1.5–2× market amplification in both directions during volatile periods.",
      tag: "HIGH BETA",
      cls: "danger",
    });

  if (avgBeta > 1.3)
    items.push({
      icon: "📊",
      title: "Elevated market beta",
      body: `Portfolio beta of ${avgBeta.toFixed(2)} means a 10% market drop could hit you ~${(avgBeta * 10).toFixed(0)}%.`,
      tag: `β ${avgBeta.toFixed(2)}`,
      cls: "warn",
    });

  const sectors = new Set(details.map((d) => d.sd.sector));
  if (sectors.size < 3)
    items.push({
      icon: "🧩",
      title: "Low sector diversification",
      body: "You are exposed to fewer than 3 sectors. Adding Healthcare, Utilities, or Consumer Staples can reduce drawdowns significantly.",
      tag: "DIVERSIFY",
      cls: "info",
    });
  else
    items.push({
      icon: "✅",
      title: "Decent sector spread",
      body: `Holdings span ${sectors.size} sectors. Consider adding uncorrelated assets like bonds or gold to further reduce volatility.`,
      tag: "BALANCED",
      cls: "ok",
    });

  if (macroShocks.tech || macroShocks.rate || macroShocks.infl)
    items.push({
      icon: "📡",
      title: "Macro shock amplifiers active",
      body: "Sector/macro shocks reflect tail-risk scenarios where correlations spike and diversification breaks down.",
      tag: "MACRO RISK",
      cls: "warn",
    });

  items.push({
    icon: "🧠",
    title: "Behavioral finance reminder",
    body: "Investors typically panic-sell near market bottoms. Stress testing now helps you pre-commit to a plan before the crash happens.",
    tag: "BEHAVIORAL",
    cls: "info",
  });

  const tagColors = {
    danger: { bg: "#450a0a", text: "#fca5a5", border: "#7f1d1d" },
    warn:   { bg: "#422006", text: "#fcd34d", border: "#78350f" },
    info:   { bg: "#0c1a2e", text: "#7dd3fc", border: "#1e3a5f" },
    ok:     { bg: "#052e16", text: "#86efac", border: "#14532d" },
  };

  return (
    <div style={styles.card}>
      <div style={styles.label}>Risk Insights</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {items.map((item, i) => {
          const tc = tagColors[item.cls];
          return (
            <div key={i} style={styles.insight}>
              <div style={styles.icon}>{item.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={styles.titleRow}>
                  <span style={styles.title}>{item.title}</span>
                  <span style={{ ...styles.tag, background: tc.bg, color: tc.text, border: `1px solid ${tc.border}` }}>
                    {item.tag}
                  </span>
                </div>
                <div style={styles.body}>{item.body}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "#0f1117",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    padding: "18px",
  },
  label: {
    fontSize: "10px",
    letterSpacing: "0.14em",
    color: "#4b5563",
    marginBottom: "12px",
    textTransform: "uppercase",
  },
  insight: {
    display: "flex",
    gap: "14px",
    padding: "14px 16px",
    background: "rgba(15,15,20,0.5)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "10px",
  },
  icon: { fontSize: "20px", marginTop: "1px" },
  titleRow: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" },
  title: { fontSize: "13px", fontWeight: 600, color: "#e2e8f0" },
  tag: { fontSize: "10px", padding: "2px 8px", borderRadius: "10px", letterSpacing: "0.07em" },
  body: { fontSize: "12px", color: "#9ca3af", lineHeight: 1.65 },
};
