// src/components/Sidebar.jsx
// The left panel: portfolio input, crash scenario selector, slider, macro shocks,
// and Firebase save/load functionality.

import React, { useState } from "react";
import { HoldingRow }   from "./HoldingRow";
import { DematImport }  from "./DematImport";
import { SCENARIOS }    from "../utils/stockData";
import { usePortfolioStorage } from "../hooks/usePortfolioStorage";

export function Sidebar({
  holdings,
  setHoldings,
  activeScenario,
  setActiveScenario,
  crashPct,
  setCrashPct,
  macroShocks,
  setMacroShocks,
  onLoadExample,
  onReset,
}) {
  const { savePortfolio, loadPortfolio, saving } = usePortfolioStorage();
  const [saveName,    setSaveName]    = useState("");
  const [loadName,    setLoadName]    = useState("");
  const [saveStatus,  setSaveStatus]  = useState("");

  // Add a blank holding row
  const addHolding = () => {
    setHoldings([
      ...holdings,
      { id: Date.now(), ticker: "", qty: 0, buyPrice: 0, currPrice: 0 },
    ]);
  };

  // Update one holding by id
  const updateHolding = (updated) => {
    setHoldings(holdings.map((h) => (h.id === updated.id ? updated : h)));
  };

  // Remove a holding
  const removeHolding = (id) => {
    setHoldings(holdings.filter((h) => h.id !== id));
  };

  // Pick a scenario pill
  const pickScenario = (scenario) => {
    setActiveScenario(scenario.id);
    if (scenario.pct) setCrashPct(scenario.pct);
  };

  // Slider handler
  const onSlider = (val) => {
    setCrashPct(Number(val));
    setActiveScenario("custom");
  };

  // Toggle macro shock
  const toggleShock = (key) => {
    setMacroShocks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Save to Firebase
  const handleSave = async () => {
    if (!saveName.trim()) return;
    const ok = await savePortfolio(saveName, holdings);
    setSaveStatus(ok ? "✓ Saved!" : "✗ Failed");
    setTimeout(() => setSaveStatus(""), 2500);
  };

  // Load from Firebase
  const handleLoad = async () => {
    if (!loadName.trim()) return;
    const loaded = await loadPortfolio(loadName);
    if (loaded) setHoldings(loaded);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

      {/* ── Holdings ── */}
      <Section label="Holdings">
        <div style={styles.holdingHeader}>
          {["TICKER", "QTY", "BUY $", "NOW $", ""].map((c) => (
            <div key={c} style={styles.colLabel}>{c}</div>
          ))}
        </div>
        {holdings.map((h) => (
          <HoldingRow
            key={h.id}
            holding={h}
            onChange={updateHolding}
            onRemove={() => removeHolding(h.id)}
          />
        ))}
        <button style={styles.addBtn} onClick={addHolding}>
          + add holding
        </button>

        {/* Import from demat */}
        <div style={{ marginTop: "8px" }}>
          <DematImport onImport={(imported) => setHoldings(prev => [...prev, ...imported])} />
        </div>
      </Section>

      {/* ── Crash Scenario ── */}
      <Section label="Crash Scenario">
        <div style={styles.pills}>
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              style={{
                ...styles.pill,
                background: activeScenario === s.id ? "#ef4444" : "transparent",
                borderColor: activeScenario === s.id ? "#ef4444" : "rgba(255,255,255,0.12)",
                color: activeScenario === s.id ? "#fff" : "#4b5563",
              }}
              onClick={() => pickScenario(s)}
            >
              {s.label}
              {s.pct ? ` −${s.pct}%` : ""}
            </button>
          ))}
        </div>
      </Section>

      {/* ── Crash Magnitude ── */}
      <Section label="Crash Magnitude">
        <div style={styles.sliderRow}>
          <input
            type="range"
            min={1}
            max={75}
            value={crashPct}
            onChange={(e) => onSlider(e.target.value)}
            style={{ flex: 1, accentColor: "#ef4444" }}
          />
          <span style={styles.sliderVal}>−{crashPct}%</span>
        </div>
        <div style={styles.hint}>drag to set custom crash magnitude</div>
      </Section>

      {/* ── Macro Shocks ── */}
      <Section label="Macro Shocks">
        {[
          { key: "tech", label: "IT sector −15% extra" },
          { key: "rate", label: "RBI rate hike shock" },
          { key: "infl", label: "Inflation shock (+5% CPI)" },
        ].map(({ key, label }) => (
          <label key={key} style={styles.checkRow}>
            <input
              type="checkbox"
              checked={!!macroShocks[key]}
              onChange={() => toggleShock(key)}
              style={{ accentColor: "#ef4444", width: 14, height: 14 }}
            />
            {label}
          </label>
        ))}
      </Section>

      {/* ── Save / Load (Firebase) ── */}
      <Section label="Save / Load Portfolio">
        <div style={styles.saveRow}>
          <input
            style={styles.textInput}
            placeholder="Portfolio name…"
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
          />
          <button style={styles.actionBtn} onClick={handleSave} disabled={saving}>
            {saving ? "…" : "Save"}
          </button>
        </div>
        {saveStatus && <div style={styles.saveStatus}>{saveStatus}</div>}

        <div style={{ ...styles.saveRow, marginTop: "8px" }}>
          <input
            style={styles.textInput}
            placeholder="Load by name…"
            value={loadName}
            onChange={(e) => setLoadName(e.target.value)}
          />
          <button style={styles.actionBtn} onClick={handleLoad}>
            Load
          </button>
        </div>
      </Section>

      {/* ── Quick Actions ── */}
      <div style={{ display: "flex", gap: "8px" }}>
        <button style={styles.ghostBtn} onClick={onLoadExample}>↺ Example</button>
        <button style={styles.ghostBtn} onClick={onReset}>✕ Reset</button>
      </div>

      <div style={styles.disclaimer}>
        ⚠ Simulated data only. Not financial advice.
      </div>
    </div>
  );
}

/** Small helper component for labeled sections */
function Section({ label, children }) {
  return (
    <div>
      <div style={sectionLabelStyle}>{label}</div>
      <div style={cardStyle}>{children}</div>
    </div>
  );
}

const sectionLabelStyle = {
  fontSize: "10px",
  letterSpacing: "0.14em",
  color: "#4b5563",
  marginBottom: "8px",
  textTransform: "uppercase",
};

const cardStyle = {
  background: "#0f1117",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "12px",
  padding: "14px",
};

const styles = {
  sidebar: {
    width: "320px",
    minWidth: "280px",
    flexShrink: 0,
    borderRight: "1px solid rgba(255,255,255,0.08)",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    background: "rgba(10,11,16,0.8)",
    overflowY: "auto",
  },
  holdingHeader: {
    display: "grid",
    gridTemplateColumns: "64px 1fr 1fr 1fr 28px",
    gap: "5px",
    marginBottom: "6px",
  },
  colLabel: {
    fontSize: "9px",
    color: "#4b5563",
    letterSpacing: "0.08em",
    textAlign: "center",
  },
  addBtn: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "12px",
    padding: "7px 0",
    border: "1px dashed rgba(255,255,255,0.12)",
    borderRadius: "8px",
    background: "transparent",
    color: "#4b5563",
    cursor: "pointer",
    width: "100%",
    textAlign: "center",
    marginTop: "8px",
  },
  pills: { display: "flex", flexWrap: "wrap", gap: "6px" },
  pill: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "11px",
    padding: "5px 10px",
    borderRadius: "20px",
    border: "1px solid",
    cursor: "pointer",
    letterSpacing: "0.04em",
    transition: "all 0.15s",
  },
  sliderRow: { display: "flex", alignItems: "center", gap: "12px" },
  sliderVal: { fontSize: "18px", fontWeight: "700", color: "#ef4444", minWidth: "52px", textAlign: "right" },
  hint: { fontSize: "10px", color: "#4b5563", marginTop: "6px" },
  checkRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "10px",
    cursor: "pointer",
    fontSize: "12px",
    color: "#9ca3af",
  },
  saveRow: { display: "flex", gap: "8px" },
  textInput: {
    flex: 1,
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "12px",
    padding: "6px 10px",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "7px",
    background: "rgba(255,255,255,0.05)",
    color: "#e2e8f0",
    outline: "none",
  },
  actionBtn: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "12px",
    padding: "6px 14px",
    borderRadius: "7px",
    border: "1px solid #ef4444",
    background: "transparent",
    color: "#ef4444",
    cursor: "pointer",
  },
  saveStatus: { fontSize: "11px", color: "#10b981", marginTop: "4px" },
  ghostBtn: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "12px",
    padding: "6px 14px",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "transparent",
    color: "#4b5563",
    cursor: "pointer",
    flex: 1,
  },
  disclaimer: {
    fontSize: "10px",
    color: "#374151",
    lineHeight: 1.7,
  },
};
