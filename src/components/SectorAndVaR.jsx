// src/components/SectorAndVaR.jsx
// Two side-by-side panels: sector concentration bars + Value at Risk table.

import React from "react";
import { SECTOR_COLORS } from "../utils/stockData";
import { VAR_ROWS, fmtCurrency, getSectorData } from "../utils/calculations";

const CARD = {
  background: "#0f1117",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "12px",
  padding: "18px",
};
const LABEL = {
  fontSize: "10px",
  letterSpacing: "0.14em",
  color: "#4b5563",
  marginBottom: "12px",
  textTransform: "uppercase",
};

export function SectorBars({ details, totalCurr }) {
  const sectorData = getSectorData(details, totalCurr);

  return (
    <div style={CARD}>
      <div style={LABEL}>Sector Concentration</div>
      {sectorData.map(([sector, value]) => {
        const pct = ((value / totalCurr) * 100).toFixed(1);
        const color = SECTOR_COLORS[sector] || SECTOR_COLORS.Other;
        return (
          <div key={sector} style={styles.sectorRow}>
            <div style={styles.sectorName}>{sector}</div>
            <div style={styles.barBg}>
              <div style={{ ...styles.barFill, width: `${pct}%`, background: color }} />
            </div>
            <div style={styles.sectorPct}>{pct}%</div>
          </div>
        );
      })}
    </div>
  );
}

export function VaRTable({ result }) {
  const { totalCurr, annVol, avgBeta } = result;
  // daily vol ≈ annVol / sqrt(252), monthly ≈ daily × sqrt(21)
  const dv = annVol / Math.sqrt(252);
  const mv = dv * Math.sqrt(21);

  return (
    <div style={CARD}>
      <div style={LABEL}>Value at Risk (VaR)</div>
      <table style={styles.table}>
        <thead>
          <tr>
            {["Confidence", "Daily VaR", "Monthly VaR"].map((h) => (
              <th key={h} style={styles.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {VAR_ROWS.map(([conf, z]) => (
            <tr key={conf}>
              <td style={styles.td}>{conf}</td>
              <td style={{ ...styles.td, color: "#ef4444", fontWeight: 600 }}>
                −{fmtCurrency(Math.round(totalCurr * dv * z))}
              </td>
              <td style={{ ...styles.td, color: "#ef4444", fontWeight: 600 }}>
                −{fmtCurrency(Math.round(totalCurr * mv * z))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={styles.note}>
        Based on portfolio β {avgBeta.toFixed(2)} and annualized volatility{" "}
        {(annVol * 100).toFixed(0)}%. Assumes normal distribution.
      </div>
    </div>
  );
}

const styles = {
  sectorRow: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" },
  sectorName: { width: "80px", fontSize: "11px", color: "#9ca3af", textAlign: "right" },
  barBg: { flex: 1, height: "7px", borderRadius: "4px", background: "rgba(255,255,255,0.05)", overflow: "hidden" },
  barFill: { height: "100%", borderRadius: "4px", transition: "width 0.6s ease" },
  sectorPct: { width: "38px", fontSize: "11px", color: "#4b5563" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "12px" },
  th: { fontSize: "10px", color: "#4b5563", textAlign: "left", padding: "4px 8px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontWeight: 500, letterSpacing: "0.06em" },
  td: { padding: "7px 8px", borderBottom: "1px solid rgba(255,255,255,0.04)", color: "#9ca3af" },
  note: { fontSize: "10px", color: "#374151", marginTop: "10px", lineHeight: 1.6 },
};
