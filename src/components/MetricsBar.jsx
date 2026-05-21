// src/components/MetricsBar.jsx
import React from "react";
import { fmtCurrency } from "../utils/calculations";

export function MetricsBar({ result }) {
  if (!result) return null;
  const { totalCurr, totalSim, totalLoss, unrealized } = result;
  const drawdownPct = ((totalLoss / totalCurr) * 100).toFixed(1);
  const pnlColor = unrealized >= 0 ? "#10b981" : "#ef4444";

  const metrics = [
    { label: "CURRENT VALUE",   value: fmtCurrency(totalCurr),                                          sub: "before scenario", color: "#f1f5f9" },
    { label: "SIMULATED VALUE", value: fmtCurrency(totalSim),                                           sub: "after crash",     color: "#ef4444" },
    { label: "TOTAL LOSS",      value: "−" + fmtCurrency(totalLoss),                                   sub: `${drawdownPct}% drawdown`, color: "#ef4444" },
    { label: "UNREALIZED P&L",  value: (unrealized >= 0 ? "+" : "−") + fmtCurrency(Math.abs(unrealized)), sub: "before crash",  color: pnlColor  },
  ];

  // Renders as 4 individual cards — parent grid handles layout
  return (
    <>
      {metrics.map(m => (
        <div key={m.label} style={styles.card}>
          <div style={styles.label}>{m.label}</div>
          <div style={{ ...styles.value, color: m.color }}>{m.value}</div>
          <div style={styles.sub}>{m.sub}</div>
        </div>
      ))}
    </>
  );
}

const styles = {
  card: {
    background: "rgba(15,15,20,0.7)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    padding: "12px 14px",
    minWidth: 0,
  },
  label: { fontSize: "9px", letterSpacing: "0.12em", color: "#4b5563", marginBottom: "5px" },
  value: { fontSize: "18px", fontWeight: "700", fontFamily: "'JetBrains Mono',monospace", wordBreak: "break-all" },
  sub:   { fontSize: "10px", color: "#4b5563", marginTop: "3px" },
};
