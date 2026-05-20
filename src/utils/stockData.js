// src/utils/stockData.js
// Top 100 most traded Indian stocks on NSE.
// Use these exact ticker names in the app e.g. RELIANCE.NS
// Any stock NOT in this list will still work — it defaults to sector "Other", beta 1.0
// so users can always enter any stock manually and the stress test still runs fine.

export const STOCK_DB = {

  // ── LARGE CAP — CONGLOMERATES & ENERGY ────────────────────────────────────
  "RELIANCE.NS":     { sector: "Energy",      beta: 0.95, vol: 0.28 },
  "ONGC.NS":         { sector: "Energy",      beta: 0.85, vol: 0.30 },
  "COALINDIA.NS":    { sector: "Energy",      beta: 0.75, vol: 0.28 },
  "BPCL.NS":         { sector: "Energy",      beta: 0.90, vol: 0.32 },
  "IOC.NS":          { sector: "Energy",      beta: 0.80, vol: 0.30 },
  "GAIL.NS":         { sector: "Energy",      beta: 0.80, vol: 0.27 },
  "POWERGRID.NS":    { sector: "Energy",      beta: 0.65, vol: 0.22 },
  "NTPC.NS":         { sector: "Energy",      beta: 0.70, vol: 0.24 },
  "ADANIENT.NS":     { sector: "Energy",      beta: 1.45, vol: 0.50 },
  "ADANIPORTS.NS":   { sector: "Industrial",  beta: 1.20, vol: 0.38 },
  "ADANIGREEN.NS":   { sector: "Energy",      beta: 1.50, vol: 0.55 },
  "ADANITRANS.NS":   { sector: "Energy",      beta: 1.30, vol: 0.45 },

  // ── TECHNOLOGY & IT ───────────────────────────────────────────────────────
  "TCS.NS":          { sector: "Tech",        beta: 0.75, vol: 0.22 },
  "INFY.NS":         { sector: "Tech",        beta: 0.80, vol: 0.24 },
  "WIPRO.NS":        { sector: "Tech",        beta: 0.75, vol: 0.25 },
  "HCLTECH.NS":      { sector: "Tech",        beta: 0.85, vol: 0.26 },
  "TECHM.NS":        { sector: "Tech",        beta: 0.90, vol: 0.28 },
  "LTI.NS":          { sector: "Tech",        beta: 0.95, vol: 0.30 },
  "LTTS.NS":         { sector: "Tech",        beta: 0.95, vol: 0.30 },
  "MPHASIS.NS":      { sector: "Tech",        beta: 0.90, vol: 0.28 },
  "PERSISTENT.NS":   { sector: "Tech",        beta: 1.00, vol: 0.32 },
  "COFORGE.NS":      { sector: "Tech",        beta: 1.00, vol: 0.33 },
  "OFSS.NS":         { sector: "Tech",        beta: 0.70, vol: 0.22 },

  // ── BANKING & FINANCE ─────────────────────────────────────────────────────
  "HDFCBANK.NS":     { sector: "Finance",     beta: 0.85, vol: 0.24 },
  "ICICIBANK.NS":    { sector: "Finance",     beta: 1.00, vol: 0.28 },
  "SBIN.NS":         { sector: "Finance",     beta: 1.10, vol: 0.32 },
  "KOTAKBANK.NS":    { sector: "Finance",     beta: 0.90, vol: 0.26 },
  "AXISBANK.NS":     { sector: "Finance",     beta: 1.10, vol: 0.32 },
  "INDUSINDBK.NS":   { sector: "Finance",     beta: 1.20, vol: 0.38 },
  "BANDHANBNK.NS":   { sector: "Finance",     beta: 1.25, vol: 0.42 },
  "FEDERALBNK.NS":   { sector: "Finance",     beta: 1.05, vol: 0.33 },
  "IDFCFIRSTB.NS":   { sector: "Finance",     beta: 1.20, vol: 0.40 },
  "PNB.NS":          { sector: "Finance",     beta: 1.15, vol: 0.38 },
  "BANKBARODA.NS":   { sector: "Finance",     beta: 1.10, vol: 0.36 },
  "CANBK.NS":        { sector: "Finance",     beta: 1.10, vol: 0.36 },
  "BAJFINANCE.NS":   { sector: "Finance",     beta: 1.20, vol: 0.36 },
  "BAJAJFINSV.NS":   { sector: "Finance",     beta: 1.10, vol: 0.32 },
  "HDFC.NS":         { sector: "Finance",     beta: 0.85, vol: 0.24 },
  "SBILIFE.NS":      { sector: "Finance",     beta: 0.90, vol: 0.26 },
  "HDFCLIFE.NS":     { sector: "Finance",     beta: 0.85, vol: 0.24 },
  "ICICIPRU.NS":     { sector: "Finance",     beta: 0.90, vol: 0.26 },
  "MUTHOOTFIN.NS":   { sector: "Finance",     beta: 1.00, vol: 0.32 },
  "CHOLAFIN.NS":     { sector: "Finance",     beta: 1.10, vol: 0.34 },

  // ── CONSUMER & FMCG ───────────────────────────────────────────────────────
  "HINDUNILVR.NS":   { sector: "Consumer",    beta: 0.55, vol: 0.18 },
  "ITC.NS":          { sector: "Consumer",    beta: 0.65, vol: 0.20 },
  "NESTLEIND.NS":    { sector: "Consumer",    beta: 0.50, vol: 0.17 },
  "BRITANNIA.NS":    { sector: "Consumer",    beta: 0.60, vol: 0.20 },
  "DABUR.NS":        { sector: "Consumer",    beta: 0.55, vol: 0.18 },
  "MARICO.NS":       { sector: "Consumer",    beta: 0.60, vol: 0.20 },
  "COLPAL.NS":       { sector: "Consumer",    beta: 0.55, vol: 0.18 },
  "GODREJCP.NS":     { sector: "Consumer",    beta: 0.65, vol: 0.22 },
  "EMAMILTD.NS":     { sector: "Consumer",    beta: 0.70, vol: 0.24 },
  "VBL.NS":          { sector: "Consumer",    beta: 0.80, vol: 0.26 },
  "TATACONSUM.NS":   { sector: "Consumer",    beta: 0.75, vol: 0.24 },
  "TITAN.NS":        { sector: "Consumer",    beta: 1.00, vol: 0.30 },

  // ── AUTOMOBILES ───────────────────────────────────────────────────────────
  "TATAMOTORS.NS":   { sector: "Auto",        beta: 1.30, vol: 0.40 },
  "MARUTI.NS":       { sector: "Auto",        beta: 0.90, vol: 0.27 },
  "BAJAJ-AUTO.NS":   { sector: "Auto",        beta: 0.85, vol: 0.25 },
  "HEROMOTOCO.NS":   { sector: "Auto",        beta: 0.80, vol: 0.24 },
  "EICHERMOT.NS":    { sector: "Auto",        beta: 0.95, vol: 0.28 },
  "TVSMOTOR.NS":     { sector: "Auto",        beta: 1.00, vol: 0.30 },
  "M&M.NS":          { sector: "Auto",        beta: 1.00, vol: 0.30 },
  "ASHOKLEY.NS":     { sector: "Auto",        beta: 1.10, vol: 0.35 },
  "BOSCHLTD.NS":     { sector: "Auto",        beta: 0.80, vol: 0.24 },
  "MOTHERSON.NS":    { sector: "Auto",        beta: 1.20, vol: 0.38 },

  // ── HEALTHCARE & PHARMA ───────────────────────────────────────────────────
  "SUNPHARMA.NS":    { sector: "Healthcare",  beta: 0.65, vol: 0.22 },
  "DRREDDY.NS":      { sector: "Healthcare",  beta: 0.60, vol: 0.20 },
  "CIPLA.NS":        { sector: "Healthcare",  beta: 0.65, vol: 0.22 },
  "DIVISLAB.NS":     { sector: "Healthcare",  beta: 0.70, vol: 0.24 },
  "APOLLOHOSP.NS":   { sector: "Healthcare",  beta: 0.85, vol: 0.28 },
  "MAXHEALTH.NS":    { sector: "Healthcare",  beta: 0.90, vol: 0.30 },
  "LUPIN.NS":        { sector: "Healthcare",  beta: 0.70, vol: 0.24 },
  "AUROPHARMA.NS":   { sector: "Healthcare",  beta: 0.75, vol: 0.26 },
  "TORNTPHARM.NS":   { sector: "Healthcare",  beta: 0.65, vol: 0.22 },
  "ALKEM.NS":        { sector: "Healthcare",  beta: 0.65, vol: 0.22 },

  // ── INFRASTRUCTURE & INDUSTRIAL ───────────────────────────────────────────
  "LT.NS":           { sector: "Industrial",  beta: 1.00, vol: 0.28 },
  "SIEMENS.NS":      { sector: "Industrial",  beta: 0.95, vol: 0.28 },
  "ABB.NS":          { sector: "Industrial",  beta: 1.00, vol: 0.30 },
  "HAVELLS.NS":      { sector: "Industrial",  beta: 0.95, vol: 0.28 },
  "BHEL.NS":         { sector: "Industrial",  beta: 1.20, vol: 0.40 },
  "BEL.NS":          { sector: "Industrial",  beta: 1.10, vol: 0.36 },
  "HAL.NS":          { sector: "Industrial",  beta: 1.10, vol: 0.35 },
  "GRSE.NS":         { sector: "Industrial",  beta: 1.05, vol: 0.35 },
  "IRFC.NS":         { sector: "Industrial",  beta: 0.85, vol: 0.28 },
  "PFC.NS":          { sector: "Finance",     beta: 0.95, vol: 0.32 },
  "RECLTD.NS":       { sector: "Finance",     beta: 0.95, vol: 0.32 },

  // ── METALS & MATERIALS ────────────────────────────────────────────────────
  "TATASTEEL.NS":    { sector: "Materials",   beta: 1.30, vol: 0.40 },
  "JSWSTEEL.NS":     { sector: "Materials",   beta: 1.25, vol: 0.38 },
  "HINDALCO.NS":     { sector: "Materials",   beta: 1.20, vol: 0.36 },
  "VEDL.NS":         { sector: "Materials",   beta: 1.30, vol: 0.42 },
  "SAIL.NS":         { sector: "Materials",   beta: 1.25, vol: 0.42 },
  "NATIONALUM.NS":   { sector: "Materials",   beta: 1.15, vol: 0.38 },
  "HINDZINC.NS":     { sector: "Materials",   beta: 1.00, vol: 0.32 },
  "APLAPOLLO.NS":    { sector: "Materials",   beta: 1.10, vol: 0.35 },

  // ── TELECOM ───────────────────────────────────────────────────────────────
  "BHARTIARTL.NS":   { sector: "Telecom",     beta: 0.80, vol: 0.24 },
  "IDEA.NS":         { sector: "Telecom",     beta: 1.40, vol: 0.55 },

  // ── REAL ESTATE ───────────────────────────────────────────────────────────
  "DLF.NS":          { sector: "Real Estate", beta: 1.25, vol: 0.40 },
  "GODREJPROP.NS":   { sector: "Real Estate", beta: 1.20, vol: 0.38 },
  "OBEROIRLTY.NS":   { sector: "Real Estate", beta: 1.15, vol: 0.36 },
  "PRESTIGE.NS":     { sector: "Real Estate", beta: 1.20, vol: 0.38 },

  // ── CEMENT ────────────────────────────────────────────────────────────────
  "ULTRACEMCO.NS":   { sector: "Materials",   beta: 0.90, vol: 0.26 },
  "SHREECEM.NS":     { sector: "Materials",   beta: 0.85, vol: 0.25 },
  "ACC.NS":          { sector: "Materials",   beta: 0.90, vol: 0.28 },
  "AMBUJACEM.NS":    { sector: "Materials",   beta: 0.90, vol: 0.28 },

};

// Sector color map — used for charts
export const SECTOR_COLORS = {
  Tech:         "#3b82f6",
  Finance:      "#10b981",
  Energy:       "#f59e0b",
  Healthcare:   "#8b5cf6",
  Consumer:     "#fb923c",
  Auto:         "#06b6d4",
  Industrial:   "#64748b",
  Materials:    "#a78bfa",
  Telecom:      "#22d3ee",
  "Real Estate":"#f472b6",
  Commodities:  "#ec4899",
  Other:        "#6b7280",
};

// Crash scenarios
export const SCENARIOS = [
  { id: "mild",    label: "Mild Correction",  pct: 10   },
  { id: "bear",    label: "Bear Market",      pct: 20   },
  { id: "c2008",   label: "2008 Crash",       pct: 38   },
  { id: "dotcom",  label: "Dot-com Bust",     pct: 45   },
  { id: "ai",      label: "AI Bubble",        pct: 30   },
  { id: "covid",   label: "COVID Crash",      pct: 34   },
  { id: "custom",  label: "Custom",           pct: null },
];

// Example portfolio — Indian stocks shown by default
export const EXAMPLE_PORTFOLIO = [
  { id: 1, ticker: "RELIANCE.NS",   qty: 10,  buyPrice: 2200, currPrice: 2850 },
  { id: 2, ticker: "TCS.NS",        qty: 5,   buyPrice: 3200, currPrice: 3900 },
  { id: 3, ticker: "HDFCBANK.NS",   qty: 20,  buyPrice: 1400, currPrice: 1650 },
  { id: 4, ticker: "INFY.NS",       qty: 15,  buyPrice: 1400, currPrice: 1780 },
  { id: 5, ticker: "TATAMOTORS.NS", qty: 30,  buyPrice: 420,  currPrice: 720  },
];
