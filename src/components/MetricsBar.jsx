// src/components/MetricsBar.jsx
// The 4 big number cards at the top of the dashboard.

import React from "react";
import { fmtCurrency } from "../utils/calculations";

export function MetricsBar({ result }) {
  if (!result) return null;
  const { totalCurr, totalSim, totalLoss, unrealized } = result;
  const drawdownPct = ((totalLoss / totalCurr) * 100).toFixed(1);
  const pnlColor = unrealized >= 0 ? "#10b981" : "#ef4444";

  const metrics = [
    {
      label: "CURRENT VALUE",
      value: fmtCurrency(totalCurr),
      sub: "before scenario",
      color: "#f1f5f9",
    },
    {
      label: "SIMULATED VALUE",
      value: fmtCurrency(totalSim),
      sub: "after crash",
      color: "#ef4444",
    },
    {
      label: "TOTAL LOSS",
      value: "−" + fmtCurrency(totalLoss),
      sub: `${drawdownPct}% drawdown`,
      color: "#ef4444",
    },
    {
      label: "UNREALIZED P&L",
      value: (unrealized >= 0 ? "+" : "−") + fmtCurrency(Math.abs(unrealized)),
      sub: "before crash",
      color: pnlColor,
    },
  ];

  return (
    <div style={styles.grid}>
      {metrics.map((m) => (
        <div key={m.label} style={styles.card}>
          <div style={styles.label}>{m.label}</div>
          <div style={{ ...styles.value, color: m.color }}>{m.value}</div>
          <div style={styles.sub}>{m.sub}</div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "12px",
  },
  card: {
    background: "rgba(15,15,20,0.7)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    padding: "14px 18px",
  },
  label: {
    fontSize: "10px",
    letterSpacing: "0.12em",
    color: "#4b5563",
    marginBottom: "6px",
  },
  value: {
    fontSize: "22px",
    fontWeight: "700",
    fontFamily: "'JetBrains Mono', monospace",
  },
  sub: {
    fontSize: "11px",
    color: "#4b5563",
    marginTop: "3px",
  },
};
