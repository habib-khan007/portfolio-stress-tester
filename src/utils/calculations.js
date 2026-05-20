// src/utils/calculations.js
// All the math for stress testing. Pure functions — no UI here.

import { STOCK_DB } from "./stockData";

/**
 * Given holdings + crash % + macro shocks, compute all stress test results.
 * Returns null if no valid holdings exist.
 */
export function calcPortfolio(holdings, crashPct, macroShocks = {}) {
  // Filter to holdings that have all required fields
  const valid = holdings.filter(
    (h) => h.ticker && h.qty > 0 && h.currPrice > 0
  );
  if (valid.length === 0) return null;

  const details = valid.map((h) => {
    const sd = STOCK_DB[h.ticker.toUpperCase()] || {
      sector: "Other",
      beta: 1.0,
      vol: 0.3,
    };

    const currVal = h.qty * h.currPrice;
    const buyVal  = h.qty * (h.buyPrice || h.currPrice);

    // Effective crash = base crash × beta, capped at 95%
    let effectiveCrash = Math.min((crashPct / 100) * sd.beta, 0.95);

    // Apply macro shocks on top
    if (macroShocks.tech  && sd.sector === "Tech")    effectiveCrash = Math.min(effectiveCrash + 0.15, 0.95);
    if (macroShocks.rate  && sd.sector === "Finance")  effectiveCrash = Math.min(effectiveCrash + 0.08, 0.95);
    if (macroShocks.infl  && sd.sector === "Energy")   effectiveCrash = Math.max(effectiveCrash - 0.05, 0);

    const simVal  = currVal * (1 - effectiveCrash);
    const loss    = currVal - simVal;

    return { h, sd, currVal, buyVal, simVal, loss, effectiveCrash };
  });

  const totalCurr = details.reduce((s, d) => s + d.currVal, 0);
  const totalSim  = details.reduce((s, d) => s + d.simVal, 0);
  const totalLoss = totalCurr - totalSim;
  const unrealized = details.reduce((s, d) => s + (d.currVal - d.buyVal), 0);

  // Weighted average beta and volatility
  const avgBeta = details.reduce((s, d) => s + d.sd.beta * (d.currVal / totalCurr), 0);
  const avgVol  = details.reduce((s, d) => s + d.sd.vol  * (d.currVal / totalCurr), 0);
  const annVol  = avgVol;

  // Risk score 0–100
  const riskScore = Math.min(
    Math.round((avgBeta - 0.5) * 40 + annVol * 80),
    100
  );

  return {
    details,
    totalCurr,
    totalSim,
    totalLoss,
    unrealized,
    avgBeta,
    annVol,
    riskScore,
  };
}

/**
 * Aggregate holdings by sector.
 * Returns array of [sectorName, totalValue] sorted descending.
 */
export function getSectorData(details, totalCurr) {
  const map = {};
  details.forEach(({ h, sd, currVal }) => {
    const s = sd.sector;
    map[s] = (map[s] || 0) + currVal;
  });
  return Object.entries(map).sort((a, b) => b[1] - a[1]);
}

/**
 * Compute Value-at-Risk table rows.
 * Returns array of [confidenceLabel, zScore].
 */
export const VAR_ROWS = [
  ["95%", 1.645],
  ["99%", 2.326],
  ["99.9%", 3.09],
];

/** Format a number as currency string */
export function fmtCurrency(n) {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1_000)     return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}
