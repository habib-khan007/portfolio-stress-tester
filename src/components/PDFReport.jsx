// src/components/PDFReport.jsx
// Generates a clean, shareable PDF of the stress test report.
// Uses the browser's built-in print functionality — no extra library needed.
// The PDF can be saved and shared on WhatsApp, email, etc.

import React, { useState } from "react";
import { fmtCurrency, getSectorData } from "../utils/calculations";
import { SCENARIOS } from "../utils/stockData";

export function PDFReport({ result, holdings, crashPct, macroShocks }) {
  const [generating, setGenerating] = useState(false);

  const generatePDF = () => {
    if (!result) return;
    setGenerating(true);

    const { totalCurr, totalSim, totalLoss, unrealized, avgBeta, riskScore, annVol, details } = result;
    const drawdownPct = ((totalLoss / totalCurr) * 100).toFixed(1);
    const sectorData  = getSectorData(details, totalCurr);
    const date        = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

    const riskColor = riskScore > 70 ? "#dc2626" : riskScore > 40 ? "#d97706" : "#059669";
    const riskLabel = riskScore > 70 ? "HIGH RISK" : riskScore > 40 ? "MODERATE" : "LOW RISK";

    const scenarioRows = SCENARIOS.filter(s => s.pct).map(s => {
      const loss = totalCurr * (s.pct / 100);
      const post = totalCurr - loss;
      return `
        <tr>
          <td>${s.label}</td>
          <td style="color:#dc2626">−${s.pct}%</td>
          <td>${fmtCurrency(post)}</td>
          <td style="color:#dc2626">−${fmtCurrency(loss)}</td>
        </tr>`;
    }).join("");

    const holdingRows = details.map(d => `
      <tr>
        <td><strong>${d.h.ticker}</strong></td>
        <td>${d.sd.sector}</td>
        <td>${d.h.qty}</td>
        <td>${fmtCurrency(d.currVal)}</td>
        <td style="color:#dc2626">−${fmtCurrency(d.loss)}</td>
        <td>${(d.effectiveCrash * 100).toFixed(1)}%</td>
      </tr>`).join("");

    const sectorRows = sectorData.map(([sector, value]) => `
      <tr>
        <td>${sector}</td>
        <td>${fmtCurrency(value)}</td>
        <td>${((value / totalCurr) * 100).toFixed(1)}%</td>
      </tr>`).join("");

    const activeShocks = Object.entries(macroShocks).filter(([,v]) => v).map(([k]) => k);

    // Build full HTML page for printing
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>Portfolio Stress Test Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a2e; background: #fff; padding: 40px; font-size: 13px; }
    .header { border-bottom: 3px solid #dc2626; padding-bottom: 20px; margin-bottom: 28px; display: flex; justify-content: space-between; align-items: flex-end; }
    .brand { font-size: 22px; font-weight: 800; letter-spacing: 0.05em; }
    .brand span { color: #dc2626; }
    .date { font-size: 11px; color: #6b7280; }
    .badge { background: #dc2626; color: white; font-size: 9px; padding: 2px 8px; border-radius: 3px; letter-spacing: 0.1em; margin-left: 10px; vertical-align: middle; }
    .metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 28px; }
    .metric { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; }
    .metric-label { font-size: 9px; letter-spacing: 0.12em; color: #9ca3af; text-transform: uppercase; margin-bottom: 6px; }
    .metric-value { font-size: 20px; font-weight: 700; font-family: monospace; }
    .metric-sub { font-size: 10px; color: #9ca3af; margin-top: 3px; }
    .section-title { font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: #6b7280; margin-bottom: 10px; margin-top: 24px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th { background: #f1f5f9; padding: 8px 10px; text-align: left; font-size: 10px; letter-spacing: 0.06em; color: #6b7280; text-transform: uppercase; }
    td { padding: 8px 10px; border-bottom: 1px solid #f1f5f9; }
    .risk-box { background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; padding: 16px; display: inline-block; text-align: center; min-width: 160px; }
    .risk-num { font-size: 48px; font-weight: 800; font-family: monospace; }
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    .info-box { background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 14px; margin-top: 24px; font-size: 11px; color: #92400e; line-height: 1.7; }
    .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 10px; color: #9ca3af; display: flex; justify-content: space-between; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>

  <!-- Header -->
  <div class="header">
    <div>
      <div class="brand">PORT<span>FOLIO</span>.STRESS <span class="badge">STRESS TEST REPORT</span></div>
      <div style="font-size:12px; color:#6b7280; margin-top:6px">Indian Equity Portfolio Risk Analysis</div>
    </div>
    <div class="date">Generated: ${date}<br/>Scenario: −${crashPct}% market crash${activeShocks.length ? " + macro shocks" : ""}</div>
  </div>

  <!-- Metrics -->
  <div class="metrics">
    <div class="metric">
      <div class="metric-label">Current Value</div>
      <div class="metric-value" style="color:#1a1a2e">${fmtCurrency(totalCurr)}</div>
      <div class="metric-sub">before scenario</div>
    </div>
    <div class="metric">
      <div class="metric-label">Simulated Value</div>
      <div class="metric-value" style="color:#dc2626">${fmtCurrency(totalSim)}</div>
      <div class="metric-sub">after crash</div>
    </div>
    <div class="metric">
      <div class="metric-label">Total Loss</div>
      <div class="metric-value" style="color:#dc2626">−${fmtCurrency(totalLoss)}</div>
      <div class="metric-sub">${drawdownPct}% drawdown</div>
    </div>
    <div class="metric">
      <div class="metric-label">Unrealized P&L</div>
      <div class="metric-value" style="color:${unrealized >= 0 ? '#059669' : '#dc2626'}">${unrealized >= 0 ? '+' : '−'}${fmtCurrency(Math.abs(unrealized))}</div>
      <div class="metric-sub">before crash</div>
    </div>
  </div>

  <div class="two-col">
    <div>
      <!-- Holdings table -->
      <div class="section-title">Holdings breakdown</div>
      <table>
        <thead><tr><th>Ticker</th><th>Sector</th><th>Qty</th><th>Value</th><th>Loss</th><th>Drawdown</th></tr></thead>
        <tbody>${holdingRows}</tbody>
      </table>

      <!-- Scenario table -->
      <div class="section-title">All crash scenarios</div>
      <table>
        <thead><tr><th>Scenario</th><th>Drop</th><th>Remaining</th><th>Loss</th></tr></thead>
        <tbody>${scenarioRows}</tbody>
      </table>
    </div>

    <div>
      <!-- Risk score -->
      <div class="section-title">Risk profile</div>
      <div class="risk-box">
        <div class="risk-num" style="color:${riskColor}">${riskScore}</div>
        <div style="font-size:11px; color:${riskColor}; letter-spacing:0.12em; font-weight:700; margin-top:4px">${riskLabel}</div>
        <div style="font-size:10px; color:#9ca3af; margin-top:6px">β ${avgBeta.toFixed(2)} · σ ${(annVol*100).toFixed(0)}%/yr</div>
      </div>

      <!-- Sector table -->
      <div class="section-title" style="margin-top:20px">Sector concentration</div>
      <table>
        <thead><tr><th>Sector</th><th>Value</th><th>Weight</th></tr></thead>
        <tbody>${sectorRows}</tbody>
      </table>
    </div>
  </div>

  <!-- Disclaimer -->
  <div class="info-box">
    ⚠️ This report is generated for educational and informational purposes only. It is not financial advice.
    Stress test results are based on historical crash scenarios and statistical models. Past market behavior
    does not guarantee future outcomes. Please consult a SEBI-registered financial advisor before making
    investment decisions.
  </div>

  <div class="footer">
    <span>Portfolio Stress Tester · portfoliostress.app</span>
    <span>Risk calculations based on NSE beta data · Not SEBI regulated</span>
  </div>

</body>
</html>`;

    // Open in new window and trigger print dialog
    const printWindow = window.open("", "_blank", "width=900,height=700");
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      setGenerating(false);
    }, 600);
  };

  return (
    <div style={styles.card}>
      <div style={styles.left}>
        <div style={styles.label}>📄 Share Your Report</div>
        <div style={styles.sub}>
          Download a clean PDF of your full stress test — share it on WhatsApp, email, or save it.
        </div>
      </div>
      <button
        style={{
          ...styles.btn,
          opacity: !result || generating ? 0.6 : 1,
          cursor: !result || generating ? "not-allowed" : "pointer",
        }}
        onClick={generatePDF}
        disabled={!result || generating}
      >
        {generating ? "Generating…" : "⬇ Download PDF"}
      </button>
    </div>
  );
}

const styles = {
  card: {
    background: "#0f1117",
    border: "1px solid rgba(16,185,129,0.3)",
    borderRadius: "12px",
    padding: "18px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
  },
  left: { flex: 1 },
  label: {
    fontSize: "10px",
    letterSpacing: "0.14em",
    color: "#10b981",
    marginBottom: "5px",
    textTransform: "uppercase",
  },
  sub: { fontSize: "12px", color: "#4b5563", lineHeight: 1.6 },
  btn: {
    fontFamily: "inherit",
    fontSize: "13px",
    padding: "10px 22px",
    borderRadius: "8px",
    border: "1px solid #10b981",
    background: "rgba(16,185,129,0.12)",
    color: "#10b981",
    cursor: "pointer",
    whiteSpace: "nowrap",
    flexShrink: 0,
    fontWeight: 600,
  },
};
