// src/components/RiskMeter.jsx
// The circular risk score indicator in the top-right of the dashboard.

import React from "react";

export function RiskMeter({ riskScore, avgBeta, annVol }) {
  const color =
    riskScore > 70 ? "#ef4444" :
    riskScore > 40 ? "#f59e0b" :
    "#10b981";

  const label =
    riskScore > 70 ? "HIGH RISK" :
    riskScore > 40 ? "MODERATE" :
    "LOW RISK";

  return (
    <div style={styles.card}>
      <div style={styles.sectionLabel}>Risk Score</div>
      <div style={{ ...styles.num, color }}>{riskScore}</div>
      <div style={{ ...styles.label, color }}>{label}</div>
      <div style={styles.barOuter}>
        <div
          style={{
            ...styles.barInner,
            width: `${riskScore}%`,
            background: `linear-gradient(90deg, #10b981, ${color})`,
          }}
        />
      </div>
      <div style={styles.meta}>
        β {avgBeta.toFixed(2)} · σ {(annVol * 100).toFixed(0)}%/yr
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
    textAlign: "center",
  },
  sectionLabel: {
    fontSize: "10px",
    letterSpacing: "0.14em",
    color: "#4b5563",
    marginBottom: "8px",
    textTransform: "uppercase",
  },
  num: {
    fontSize: "52px",
    fontWeight: "800",
    fontFamily: "'JetBrains Mono', monospace",
    lineHeight: 1,
  },
  label: {
    fontSize: "10px",
    letterSpacing: "0.15em",
    marginBottom: "10px",
    marginTop: "4px",
  },
  barOuter: {
    height: "8px",
    borderRadius: "4px",
    background: "rgba(255,255,255,0.07)",
    overflow: "hidden",
    maxWidth: "180px",
    margin: "0 auto 8px",
  },
  barInner: {
    height: "100%",
    borderRadius: "4px",
    transition: "width 0.7s ease",
  },
  meta: {
    fontSize: "11px",
    color: "#4b5563",
  },
};
