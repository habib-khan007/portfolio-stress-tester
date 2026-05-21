// src/App.jsx
import React, { useState, useMemo } from "react";
import "./responsive.css";
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
import { calcPortfolio }           from "./utils/calculations";
import { EXAMPLE_PORTFOLIO, SCENARIOS } from "./utils/stockData";

export default function App() {
  const [holdings,       setHoldings]      = useState(EXAMPLE_PORTFOLIO);
  const [activeTab,      setActiveTab]     = useState("dashboard");
  const [activeScenario, setActiveScenario]= useState("mild");
  const [crashPct,       setCrashPct]      = useState(10);
  const [macroShocks,    setMacroShocks]   = useState({ tech: false, rate: false, infl: false });
  const [sidebarOpen,    setSidebarOpen]   = useState(true);

  const result = useMemo(
    () => calcPortfolio(holdings, crashPct, macroShocks),
    [holdings, crashPct, macroShocks]
  );

  const loadExample = () => setHoldings(EXAMPLE_PORTFOLIO);
  const resetAll = () => {
    setHoldings([]);
    setCrashPct(10);
    setActiveScenario("mild");
    setMacroShocks({ tech: false, rate: false, infl: false });
  };

  return (
    <div style={S.app}>

      {/* ── NAV ── */}
      <nav className="pst-nav">
        <div className="pst-brand">
          PORT<span style={{ color: "#ef4444" }}>FOLIO</span>.STRESS{" "}
          <span style={S.liveBadge}>LIVE SIM</span>
        </div>

        {/* Mobile sidebar toggle */}
        <button
          className="pst-mobile-toggle"
          onClick={() => setSidebarOpen(o => !o)}
        >
          {sidebarOpen ? "✕ Hide Panel" : "☰ Portfolio"}
        </button>

        <div className="pst-tabs">
          {["dashboard", "scenarios", "about"].map(tab => (
            <button
              key={tab}
              className="pst-tab-btn"
              style={{
                background: activeTab === tab ? "rgba(239,68,68,0.15)" : "transparent",
                color:      activeTab === tab ? "#ef4444" : "#4b5563",
              }}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </nav>

      {/* ── BODY ── */}
      <div className="pst-layout">

        {/* ── SIDEBAR ── */}
        <div className={`pst-sidebar${sidebarOpen ? "" : " collapsed"}`}>
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
        </div>

        {/* ── MAIN CONTENT ── */}
        <div className="pst-content">

          {/* ── DASHBOARD ── */}
          {activeTab === "dashboard" && (
            <>
              {!result ? (
                <EmptyState onLoadExample={loadExample} />
              ) : (
                <>
                  <div className="pst-metrics">
                    <MetricsBar result={result} />
                  </div>

                  <div className="pst-charts3">
                    <BeforeAfterChart totalCurr={result.totalCurr} totalSim={result.totalSim} />
                    <AllocationPie details={result.details} totalCurr={result.totalCurr} />
                    <RiskMeter riskScore={result.riskScore} avgBeta={result.avgBeta} annVol={result.annVol} />
                  </div>

                  <LossChart details={result.details} />

                  <div className="pst-charts2">
                    <SectorBars details={result.details} totalCurr={result.totalCurr} />
                    <VaRTable result={result} />
                  </div>

                  <InsightsPanel result={result} macroShocks={macroShocks} />

                  <AIExplainer result={result} holdings={holdings} crashPct={crashPct} macroShocks={macroShocks} />

                  <PDFReport result={result} holdings={holdings} crashPct={crashPct} macroShocks={macroShocks} />
                </>
              )}
            </>
          )}

          {/* ── SCENARIOS ── */}
          {activeTab === "scenarios" && (
            <>
              <div style={S.tabTitle}>Scenario Comparison</div>
              <div style={S.tabSub}>How much would you lose under each crash scenario?</div>
              {result ? (
                <>
                  <ScenarioCompareChart totalCurr={result.totalCurr} scenarios={SCENARIOS} />
                  <div className="pst-scenario-grid">
                    {SCENARIOS.filter(s => s.pct).map(s => {
                      const loss = result.totalCurr * (s.pct / 100);
                      const post = result.totalCurr - loss;
                      return (
                        <div key={s.id} style={{
                          ...S.scCard,
                          borderColor: activeScenario === s.id ? "#ef4444" : "rgba(255,255,255,0.08)",
                        }}>
                          <div style={S.scLabel}>{s.label}</div>
                          <div style={S.scPct}>−{s.pct}%</div>
                          <div style={S.scDrops}>Portfolio drops to</div>
                          <div style={S.scVal}>${(post/1000).toFixed(1)}K</div>
                          <div style={S.scLoss}>−${(loss/1000).toFixed(1)}K</div>
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

          {/* ── ABOUT ── */}
          {activeTab === "about" && <AboutTab />}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onLoadExample }) {
  return (
    <div style={S.emptyState}>
      <div style={{ fontSize: "50px", opacity: 0.2 }}>📊</div>
      <div style={S.emptyTitle}>Add holdings to begin</div>
      <div style={S.emptySub}>
        Enter your portfolio on the left, or load the example portfolio to see the stress test in action.
      </div>
      <button style={S.loadBtn} onClick={onLoadExample}>Load example portfolio</button>
    </div>
  );
}

function AboutTab() {
  const stats = [
    { num: "73%",  text: "of retail investors underestimate their portfolio's downside risk during bear markets" },
    { num: "2008", text: "crash wiped out $10T+ in global equity wealth — most investors had no stress-test process" },
    { num: "3.7×", text: "better Sharpe ratios reported by investors who model downside scenarios before crashes" },
  ];
  return (
    <div style={{ maxWidth: "680px", width: "100%" }}>
      <div style={{ fontSize: "20px", fontWeight: 700, color: "#e2e8f0", marginBottom: "8px" }}>Why this matters</div>
      <div style={{ fontSize: "13px", color: "#9ca3af", lineHeight: 1.9, marginBottom: "24px" }}>
        Most retail investors optimize for gains and ignore downside risk — until it's too late.
      </div>
      {stats.map(s => (
        <div key={s.num} style={S.aboutStat}>
          <div style={S.aboutNum}>{s.num}</div>
          <div style={{ fontSize: "13px", color: "#9ca3af", lineHeight: 1.65 }}>{s.text}</div>
        </div>
      ))}
      <div style={S.aboutBox}>
        <div style={{ fontSize: "14px", fontWeight: 700, color: "#e2e8f0", marginBottom: "8px" }}>Built as a PM portfolio project</div>
        <div style={{ fontSize: "12px", color: "#9ca3af", lineHeight: 1.8 }}>
          This tool demonstrates fintech UX thinking, risk analysis literacy, scenario-based product design,
          and data visualization judgment — core competencies for a Product Manager in financial services.
        </div>
      </div>
    </div>
  );
}

const S = {
  app: {
    background: "#08090d",
    color: "#e2e8f0",
    fontFamily: "'JetBrains Mono','Cascadia Code','Courier New',monospace",
    fontSize: "13px",
    minHeight: "100vh",
    overflowX: "hidden",
  },
  liveBadge: {
    background: "#ef4444", color: "#fff", fontSize: "9px",
    letterSpacing: "0.12em", padding: "2px 7px", borderRadius: "3px",
    marginLeft: "8px", verticalAlign: "middle",
  },
  tabTitle: { fontSize: "16px", fontWeight: 700, color: "#e2e8f0" },
  tabSub:   { fontSize: "12px", color: "#4b5563" },
  scCard:   { background: "#0f1117", border: "1px solid", borderRadius: "12px", padding: "14px" },
  scLabel:  { fontSize: "10px", color: "#4b5563", marginBottom: "4px" },
  scPct:    { fontSize: "22px", fontWeight: 700, color: "#ef4444", fontFamily: "monospace" },
  scDrops:  { fontSize: "11px", color: "#9ca3af", marginTop: "8px" },
  scVal:    { fontSize: "16px", fontWeight: 600, fontFamily: "monospace" },
  scLoss:   { fontSize: "11px", color: "#ef4444", marginTop: "4px" },
  emptyState: {
    display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", gap: "14px", padding: "60px 20px", color: "#4b5563",
  },
  emptyTitle: { fontSize: "16px", fontWeight: 600, color: "#4b5563" },
  emptySub:   { fontSize: "13px", color: "#374151", textAlign: "center", maxWidth: "280px", lineHeight: 1.7 },
  loadBtn: {
    fontFamily: "inherit", fontSize: "13px", padding: "9px 22px",
    borderRadius: "8px", border: "1px solid #ef4444", background: "transparent",
    color: "#ef4444", cursor: "pointer",
  },
  aboutStat: {
    display: "flex", gap: "16px", alignItems: "center",
    padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", flexWrap: "wrap",
  },
  aboutNum: { fontSize: "28px", fontWeight: 800, color: "#ef4444", fontFamily: "monospace", minWidth: "70px" },
  aboutBox: {
    marginTop: "24px", padding: "18px",
    background: "rgba(239,68,68,0.06)", borderRadius: "12px",
    border: "1px solid rgba(239,68,68,0.15)",
  },
};
