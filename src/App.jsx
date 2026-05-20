// src/App.jsx
// The root component. Manages all app state and renders the layout.
// Think of this as the "manager" that connects all the pieces.

import React, { useState, useMemo } from "react";
import { Sidebar }       from "./components/Sidebar";
import { MetricsBar }    from "./components/MetricsBar";
import { RiskMeter }     from "./components/RiskMeter";
import { InsightsPanel } from "./components/InsightsPanel";
import { SectorBars, VaRTable } from "./components/SectorAndVaR";
import { AIExplainer }   from "./components/AIExplainer";
import { PDFReport }     from "./components/PDFReport";
import {
  BeforeAfterChart,
  AllocationPie,
  LossChart,
  ScenarioCompareChart,
} from "./components/Charts";
import { calcPortfolio }    from "./utils/calculations";
import { EXAMPLE_PORTFOLIO, SCENARIOS } from "./utils/stockData";

export default function App() {
  // ── State ─────────────────────────────────────────────────────────────────
  const [holdings,       setHoldings]       = useState(EXAMPLE_PORTFOLIO);
  const [activeTab,      setActiveTab]       = useState("dashboard");
  const [activeScenario, setActiveScenario]  = useState("mild");
  const [crashPct,       setCrashPct]        = useState(10);
  const [macroShocks,    setMacroShocks]     = useState({ tech: false, rate: false, infl: false });

  // ── Derived data (recalculates automatically when inputs change) ──────────
  const result = useMemo(
    () => calcPortfolio(holdings, crashPct, macroShocks),
    [holdings, crashPct, macroShocks]
  );

  // ── Handlers ─────────────────────────────────────────────────────────────
  const loadExample = () => setHoldings(EXAMPLE_PORTFOLIO);
  const resetAll    = () => {
    setHoldings([]);
    setCrashPct(10);
    setActiveScenario("mild");
    setMacroShocks({ tech: false, rate: false, infl: false });
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={styles.app}>

      {/* ── NAV ── */}
      <nav style={styles.nav}>
        <div style={styles.brand}>
          PORT<span style={{ color: "#ef4444" }}>FOLIO</span>.STRESS{" "}
          <span style={styles.liveBadge}>LIVE SIM</span>
        </div>

        <div style={styles.tabs}>
          {["dashboard", "scenarios", "about"].map((tab) => (
            <button
              key={tab}
              style={{
                ...styles.tabBtn,
                background: activeTab === tab ? "rgba(239,68,68,0.15)" : "transparent",
                color: activeTab === tab ? "#ef4444" : "#4b5563",
              }}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </nav>

      {/* ── BODY ── */}
      <div style={styles.layout}>

        {/* ── SIDEBAR ── */}
        <Sidebar
          holdings={holdings}
          setHoldings={setHoldings}
          activeScenario={activeScenario}
          setActiveScenario={setActiveScenario}
          crashPct={crashPct}
          setCrashPct={setCrashPct}
          macroShocks={macroShocks}
          setMacroShocks={setMacroShocks}
          onLoadExample={loadExample}
          onReset={resetAll}
        />

        {/* ── MAIN CONTENT ── */}
        <div style={styles.content}>

          {/* ── DASHBOARD TAB ── */}
          {activeTab === "dashboard" && (
            <>
              {!result ? (
                <EmptyState onLoadExample={loadExample} />
              ) : (
                <>
                  {/* Top metrics */}
                  <MetricsBar result={result} />

                  {/* Charts row */}
                  <div style={styles.charts3}>
                    <BeforeAfterChart
                      totalCurr={result.totalCurr}
                      totalSim={result.totalSim}
                    />
                    <AllocationPie
                      details={result.details}
                      totalCurr={result.totalCurr}
                    />
                    <RiskMeter
                      riskScore={result.riskScore}
                      avgBeta={result.avgBeta}
                      annVol={result.annVol}
                    />
                  </div>

                  {/* Loss contribution */}
                  <LossChart details={result.details} />

                  {/* Sector + VaR */}
                  <div style={styles.charts2}>
                    <SectorBars
                      details={result.details}
                      totalCurr={result.totalCurr}
                    />
                    <VaRTable result={result} />
                  </div>

                  {/* Insights */}
                  <InsightsPanel result={result} macroShocks={macroShocks} />

                  {/* AI Explainer */}
                  <AIExplainer
                    result={result}
                    holdings={holdings}
                    crashPct={crashPct}
                    macroShocks={macroShocks}
                  />

                  {/* PDF Share */}
                  <PDFReport
                    result={result}
                    holdings={holdings}
                    crashPct={crashPct}
                    macroShocks={macroShocks}
                  />
                </>
              )}
            </>
          )}

          {/* ── SCENARIOS TAB ── */}
          {activeTab === "scenarios" && (
            <>
              <div style={styles.tabTitle}>Scenario Comparison</div>
              <div style={styles.tabSub}>
                How much would you lose under each crash scenario?
              </div>
              {result ? (
                <>
                  <ScenarioCompareChart
                    totalCurr={result.totalCurr}
                    scenarios={SCENARIOS}
                  />
                  <div style={styles.scenarioGrid}>
                    {SCENARIOS.filter((s) => s.pct).map((s) => {
                      const loss = result.totalCurr * (s.pct / 100);
                      const post = result.totalCurr - loss;
                      return (
                        <div
                          key={s.id}
                          style={{
                            ...styles.scCard,
                            borderColor:
                              activeScenario === s.id
                                ? "#ef4444"
                                : "rgba(255,255,255,0.08)",
                          }}
                        >
                          <div style={styles.scLabel}>{s.label}</div>
                          <div style={styles.scPct}>−{s.pct}%</div>
                          <div style={styles.scDrops}>Portfolio drops to</div>
                          <div style={styles.scVal}>
                            ${(post / 1000).toFixed(1)}K
                          </div>
                          <div style={styles.scLoss}>
                            −${(loss / 1000).toFixed(1)}K
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div style={{ color: "#4b5563", fontSize: "13px" }}>
                  Add holdings on the left to see scenario comparisons.
                </div>
              )}
            </>
          )}

          {/* ── ABOUT TAB ── */}
          {activeTab === "about" && <AboutTab />}

        </div>
      </div>
    </div>
  );
}

/** Empty state when no valid holdings exist */
function EmptyState({ onLoadExample }) {
  return (
    <div style={styles.emptyState}>
      <div style={{ fontSize: "60px", opacity: 0.2 }}>📊</div>
      <div style={styles.emptyTitle}>Add holdings to begin</div>
      <div style={styles.emptySub}>
        Enter your portfolio positions on the left, or load the example portfolio
        to see the stress test in action.
      </div>
      <button style={styles.loadBtn} onClick={onLoadExample}>
        Load example portfolio
      </button>
    </div>
  );
}

/** About tab content */
function AboutTab() {
  const stats = [
    { num: "73%",  text: "of retail investors underestimate their portfolio's downside risk during bear markets" },
    { num: "2008", text: "crash wiped out $10T+ in US equity wealth — most investors had no stress-test process" },
    { num: "3.7×", text: "better Sharpe ratios reported by investors who actively model downside scenarios before crashes" },
  ];
  return (
    <div style={{ maxWidth: "680px" }}>
      <div style={{ fontSize: "22px", fontWeight: 700, color: "#e2e8f0", marginBottom: "8px" }}>
        Why this matters
      </div>
      <div style={{ fontSize: "13px", color: "#9ca3af", lineHeight: 1.9, marginBottom: "24px" }}>
        Most retail investors optimize for gains and ignore downside risk — until it's too late.
        Portfolio Stress Tester was built to change that by making risk visualization as intuitive
        as checking a stock price.
      </div>
      {stats.map((s) => (
        <div key={s.num} style={styles.aboutStat}>
          <div style={styles.aboutNum}>{s.num}</div>
          <div style={{ fontSize: "13px", color: "#9ca3af", lineHeight: 1.65 }}>{s.text}</div>
        </div>
      ))}
      <div style={styles.aboutBox}>
        <div style={{ fontSize: "14px", fontWeight: 700, color: "#e2e8f0", marginBottom: "8px" }}>
          Built as a PM portfolio project
        </div>
        <div style={{ fontSize: "12px", color: "#9ca3af", lineHeight: 1.8 }}>
          This tool demonstrates fintech UX thinking, risk analysis literacy, scenario-based product
          design, and data visualization judgment — core competencies for a Product Manager in
          financial services.
        </div>
      </div>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = {
  app: {
    background: "#08090d",
    color: "#e2e8f0",
    fontFamily: "'JetBrains Mono', 'Cascadia Code', 'Courier New', monospace",
    fontSize: "13px",
    minHeight: "100vh",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 24px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(8,9,13,0.97)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  brand: { fontSize: "15px", fontWeight: 700, letterSpacing: "0.1em" },
  liveBadge: {
    background: "#ef4444",
    color: "#fff",
    fontSize: "9px",
    letterSpacing: "0.12em",
    padding: "2px 7px",
    borderRadius: "3px",
    marginLeft: "10px",
    verticalAlign: "middle",
  },
  tabs: { display: "flex", gap: "4px" },
  tabBtn: {
    fontFamily: "inherit",
    fontSize: "12px",
    padding: "6px 14px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    letterSpacing: "0.04em",
    transition: "all 0.15s",
  },
  layout: {
    display: "flex",
    minHeight: "calc(100vh - 53px)",
  },
  content: {
    flex: 1,
    padding: "24px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  charts3: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 220px",
    gap: "16px",
  },
  charts2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "14px",
    padding: "80px 20px",
    color: "#4b5563",
  },
  emptyTitle: { fontSize: "16px", fontWeight: 600, color: "#4b5563" },
  emptySub: { fontSize: "13px", color: "#374151", textAlign: "center", maxWidth: "280px", lineHeight: 1.7 },
  loadBtn: {
    fontFamily: "inherit",
    fontSize: "13px",
    padding: "9px 22px",
    borderRadius: "8px",
    border: "1px solid #ef4444",
    background: "transparent",
    color: "#ef4444",
    cursor: "pointer",
  },
  tabTitle: { fontSize: "16px", fontWeight: 700, color: "#e2e8f0" },
  tabSub: { fontSize: "12px", color: "#4b5563" },
  scenarioGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "12px",
  },
  scCard: {
    background: "#0f1117",
    border: "1px solid",
    borderRadius: "12px",
    padding: "16px",
  },
  scLabel: { fontSize: "11px", color: "#4b5563", marginBottom: "4px" },
  scPct: { fontSize: "24px", fontWeight: 700, color: "#ef4444", fontFamily: "monospace" },
  scDrops: { fontSize: "12px", color: "#9ca3af", marginTop: "8px" },
  scVal: { fontSize: "18px", fontWeight: 600, fontFamily: "monospace" },
  scLoss: { fontSize: "11px", color: "#ef4444", marginTop: "4px" },
  aboutStat: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    padding: "16px 0",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  aboutNum: { fontSize: "32px", fontWeight: 800, color: "#ef4444", fontFamily: "monospace", minWidth: "80px" },
  aboutBox: {
    marginTop: "24px",
    padding: "20px",
    background: "rgba(239,68,68,0.06)",
    borderRadius: "12px",
    border: "1px solid rgba(239,68,68,0.15)",
  },
};
