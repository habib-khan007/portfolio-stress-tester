// src/components/DematImport.jsx
// Imports portfolio from Indian demat apps.
// Supports two methods:
//   1. CSV/Excel file export from Zerodha, Groww, Upstox, Angel, etc.
//   2. Paste raw text from any app

import React, { useState, useRef } from "react";

// ── Parsers for each broker's CSV format ──────────────────────────────────────

function parseZerodha(text) {
  // Zerodha Kite CSV: Instrument, Qty, Avg cost, LTP, Cur val, P&L, Net chg, Day chg
  const lines = text.trim().split("\n").slice(1);
  return lines.map(line => {
    const cols = line.split(",").map(c => c.replace(/"/g, "").trim());
    if (cols.length < 4 || !cols[0]) return null;
    const ticker = cols[0].includes(".") ? cols[0] : cols[0] + ".NS";
    return {
      id:        Date.now() + Math.random(),
      ticker:    ticker.toUpperCase(),
      qty:       parseFloat(cols[1]) || 0,
      buyPrice:  parseFloat(cols[2]) || 0,
      currPrice: parseFloat(cols[3]) || 0,
    };
  }).filter(h => h && h.ticker && h.qty > 0);
}

function parseGroww(text) {
  // Groww CSV: Stock Name, Symbol, Quantity, Average Price, Current Price, ...
  const lines = text.trim().split("\n").slice(1);
  return lines.map(line => {
    const cols = line.split(",").map(c => c.replace(/"/g, "").trim());
    if (cols.length < 5 || !cols[1]) return null;
    const ticker = cols[1].includes(".") ? cols[1] : cols[1] + ".NS";
    return {
      id:        Date.now() + Math.random(),
      ticker:    ticker.toUpperCase(),
      qty:       parseFloat(cols[2]) || 0,
      buyPrice:  parseFloat(cols[3]) || 0,
      currPrice: parseFloat(cols[4]) || 0,
    };
  }).filter(h => h && h.ticker && h.qty > 0);
}

function parseUpstox(text) {
  // Upstox CSV: Symbol, ISIN, Qty, Avg Buy Price, LTP, ...
  const lines = text.trim().split("\n").slice(1);
  return lines.map(line => {
    const cols = line.split(",").map(c => c.replace(/"/g, "").trim());
    if (cols.length < 5 || !cols[0]) return null;
    const ticker = cols[0].includes(".") ? cols[0] : cols[0] + ".NS";
    return {
      id:        Date.now() + Math.random(),
      ticker:    ticker.toUpperCase(),
      qty:       parseFloat(cols[2]) || 0,
      buyPrice:  parseFloat(cols[3]) || 0,
      currPrice: parseFloat(cols[4]) || 0,
    };
  }).filter(h => h && h.ticker && h.qty > 0);
}

function parseGeneric(text) {
  // Tries to extract ticker, qty, buy price, current price from any CSV
  // Looks for columns by scanning the header row
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];

  const header = lines[0].toLowerCase().split(",").map(h => h.replace(/"/g, "").trim());

  // Find column indices by keyword matching
  const find = (...keywords) => header.findIndex(h => keywords.some(k => h.includes(k)));
  const tickerIdx = find("symbol", "ticker", "stock", "scrip", "instrument");
  const qtyIdx    = find("qty", "quantity", "shares", "units");
  const buyIdx    = find("avg", "average", "buy price", "purchase", "cost");
  const currIdx   = find("ltp", "current", "market price", "cmp", "last");

  if (tickerIdx === -1 || qtyIdx === -1) return [];

  return lines.slice(1).map(line => {
    const cols = line.split(",").map(c => c.replace(/"/g, "").trim());
    if (!cols[tickerIdx]) return null;
    const ticker = cols[tickerIdx].includes(".") ? cols[tickerIdx] : cols[tickerIdx] + ".NS";
    return {
      id:        Date.now() + Math.random(),
      ticker:    ticker.toUpperCase(),
      qty:       parseFloat(cols[qtyIdx]) || 0,
      buyPrice:  buyIdx  !== -1 ? parseFloat(cols[buyIdx])  || 0 : 0,
      currPrice: currIdx !== -1 ? parseFloat(cols[currIdx]) || 0 : 0,
    };
  }).filter(h => h && h.ticker && h.qty > 0);
}

function parsePastedText(text) {
  // Handles pasted text in format: TICKER QTY BUYPRICE CURRPRICE (space or tab separated)
  // Also handles just TICKER QTY (user can add prices manually)
  const lines = text.trim().split("\n").filter(l => l.trim());
  return lines.map(line => {
    const parts = line.trim().split(/[\s,\t]+/);
    if (parts.length < 2) return null;
    const ticker = parts[0].includes(".") ? parts[0] : parts[0] + ".NS";
    return {
      id:        Date.now() + Math.random(),
      ticker:    ticker.toUpperCase().replace(/[^A-Z0-9.]/g, ""),
      qty:       parseFloat(parts[1]) || 0,
      buyPrice:  parseFloat(parts[2]) || 0,
      currPrice: parseFloat(parts[3]) || 0,
    };
  }).filter(h => h && h.ticker && h.qty > 0);
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function DematImport({ onImport }) {
  const [open,       setOpen]       = useState(false);
  const [broker,     setBroker]     = useState("auto");
  const [pasteText,  setPasteText]  = useState("");
  const [preview,    setPreview]    = useState([]);
  const [error,      setError]      = useState("");
  const [tab,        setTab]        = useState("file"); // "file" or "paste"
  const fileRef = useRef();

  const BROKERS = [
    { id: "auto",    label: "Auto-detect" },
    { id: "zerodha", label: "Zerodha Kite" },
    { id: "groww",   label: "Groww" },
    { id: "upstox",  label: "Upstox" },
    { id: "angel",   label: "Angel One" },
    { id: "other",   label: "Other / Generic" },
  ];

  const parseCSV = (text) => {
    let holdings = [];
    if (broker === "zerodha") holdings = parseZerodha(text);
    else if (broker === "groww") holdings = parseGroww(text);
    else if (broker === "upstox") holdings = parseUpstox(text);
    else holdings = parseGeneric(text); // auto or other
    if (holdings.length === 0) holdings = parseGeneric(text); // fallback
    return holdings;
  };

  const handleFile = (e) => {
    setError("");
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = ev.target.result;
        const holdings = parseCSV(text);
        if (holdings.length === 0) {
          setError("Could not read any holdings from this file. Try pasting the data manually, or select the correct broker format.");
          return;
        }
        setPreview(holdings);
      } catch {
        setError("File could not be read. Make sure it's a CSV file.");
      }
    };
    reader.readAsText(file);
  };

  const handlePaste = () => {
    setError("");
    if (!pasteText.trim()) return;
    const holdings = parsePastedText(pasteText);
    if (holdings.length === 0) {
      setError("Could not read any holdings. Format: TICKER QTY BUYPRICE (one per line). Example:\nRELIANCE.NS 10 2500\nTCS.NS 5 3800");
      return;
    }
    setPreview(holdings);
  };

  const confirmImport = () => {
    onImport(preview);
    setOpen(false);
    setPreview([]);
    setPasteText("");
    setError("");
  };

  return (
    <>
      {/* Trigger button */}
      <button style={styles.triggerBtn} onClick={() => setOpen(true)}>
        ⬆ Import from Demat
      </button>

      {/* Modal overlay */}
      {open && (
        <div style={styles.overlay} onClick={() => setOpen(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>

            {/* Modal header */}
            <div style={styles.modalHeader}>
              <div>
                <div style={styles.modalTitle}>Import from Demat App</div>
                <div style={styles.modalSub}>Supports Zerodha, Groww, Upstox, Angel One, and others</div>
              </div>
              <button style={styles.closeBtn} onClick={() => setOpen(false)}>×</button>
            </div>

            {/* Broker selector */}
            <div style={styles.section}>
              <div style={styles.sectionLabel}>Your broker</div>
              <div style={styles.brokerPills}>
                {BROKERS.map(b => (
                  <button
                    key={b.id}
                    style={{
                      ...styles.pill,
                      background: broker === b.id ? "rgba(59,130,246,0.2)" : "transparent",
                      borderColor: broker === b.id ? "#3b82f6" : "rgba(255,255,255,0.1)",
                      color: broker === b.id ? "#3b82f6" : "#4b5563",
                    }}
                    onClick={() => setBroker(b.id)}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab switcher */}
            <div style={styles.tabRow}>
              {["file", "paste"].map(t => (
                <button
                  key={t}
                  style={{
                    ...styles.tabBtn,
                    borderBottom: tab === t ? "2px solid #3b82f6" : "2px solid transparent",
                    color: tab === t ? "#3b82f6" : "#4b5563",
                  }}
                  onClick={() => { setTab(t); setPreview([]); setError(""); }}
                >
                  {t === "file" ? "📁 Upload CSV file" : "📋 Paste data"}
                </button>
              ))}
            </div>

            {/* File upload tab */}
            {tab === "file" && (
              <div style={styles.section}>
                <div style={styles.howTo}>
                  <div style={styles.sectionLabel}>How to export from your broker:</div>
                  <div style={styles.howToGrid}>
                    <div><strong>Zerodha:</strong> Kite → Portfolio → Holdings → Download (↓ icon top right)</div>
                    <div><strong>Groww:</strong> Portfolio → Holdings → Export Holdings</div>
                    <div><strong>Upstox:</strong> Portfolio → Holdings → Download CSV</div>
                    <div><strong>Angel One:</strong> Portfolio → Holdings → Export</div>
                  </div>
                </div>
                <div
                  style={styles.dropZone}
                  onClick={() => fileRef.current.click()}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => { e.preventDefault(); fileRef.current.files = e.dataTransfer.files; handleFile({ target: fileRef.current }); }}
                >
                  <div style={{ fontSize: "28px", marginBottom: "8px" }}>📂</div>
                  <div style={{ fontSize: "13px", color: "#9ca3af" }}>Click to select CSV file, or drag and drop</div>
                  <div style={{ fontSize: "11px", color: "#4b5563", marginTop: "4px" }}>Supports .csv and .txt files</div>
                  <input ref={fileRef} type="file" accept=".csv,.txt,.xls,.xlsx" style={{ display: "none" }} onChange={handleFile} />
                </div>
              </div>
            )}

            {/* Paste tab */}
            {tab === "paste" && (
              <div style={styles.section}>
                <div style={styles.sectionLabel}>Paste your holdings (one stock per line)</div>
                <div style={styles.formatHint}>
                  Format: <code>TICKER QUANTITY BUY_PRICE</code> — Example: <code>RELIANCE.NS 10 2500</code>
                </div>
                <textarea
                  style={styles.textarea}
                  value={pasteText}
                  onChange={e => setPasteText(e.target.value)}
                  placeholder={"RELIANCE.NS 10 2500\nTCS.NS 5 3800\nHDFCBANK.NS 20 1600\nINFY.NS 15 1450"}
                  rows={6}
                />
                <button style={styles.parseBtn} onClick={handlePaste}>
                  Parse Holdings →
                </button>
              </div>
            )}

            {/* Error */}
            {error && (
              <div style={styles.error}>
                <div style={{ fontWeight: 600, marginBottom: "4px" }}>Could not parse file</div>
                <div style={{ whiteSpace: "pre-wrap" }}>{error}</div>
              </div>
            )}

            {/* Preview */}
            {preview.length > 0 && (
              <div style={styles.preview}>
                <div style={styles.previewHeader}>
                  <div style={styles.sectionLabel}>✓ {preview.length} holdings found — preview</div>
                  <button style={styles.confirmBtn} onClick={confirmImport}>
                    Import {preview.length} holdings →
                  </button>
                </div>
                <div style={styles.previewTable}>
                  <div style={styles.previewRow}>
                    {["Ticker", "Qty", "Buy ₹", "Current ₹"].map(h => (
                      <div key={h} style={styles.previewHead}>{h}</div>
                    ))}
                  </div>
                  {preview.slice(0, 8).map((h, i) => (
                    <div key={i} style={styles.previewRow}>
                      <div style={{ color: "#3b82f6", fontWeight: 600 }}>{h.ticker}</div>
                      <div>{h.qty}</div>
                      <div>{h.buyPrice || "—"}</div>
                      <div>{h.currPrice || "—"}</div>
                    </div>
                  ))}
                  {preview.length > 8 && (
                    <div style={{ fontSize: "11px", color: "#4b5563", padding: "8px 0" }}>
                      + {preview.length - 8} more holdings
                    </div>
                  )}
                </div>
                <div style={styles.previewNote}>
                  Missing prices will show as 0 — click the ↻ button on each row after importing to fetch live prices.
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  triggerBtn: {
    fontFamily: "inherit",
    fontSize: "12px",
    padding: "7px 14px",
    borderRadius: "8px",
    border: "1px solid #3b82f6",
    background: "rgba(59,130,246,0.12)",
    color: "#3b82f6",
    cursor: "pointer",
    width: "100%",
    textAlign: "center",
  },
  overlay: {
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.75)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  modal: {
    background: "#0f1117",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "14px",
    padding: "24px",
    width: "100%",
    maxWidth: "560px",
    maxHeight: "85vh",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  modalTitle: { fontSize: "15px", fontWeight: 700, color: "#e2e8f0" },
  modalSub: { fontSize: "11px", color: "#4b5563", marginTop: "3px" },
  closeBtn: { background: "none", border: "none", color: "#4b5563", fontSize: "22px", cursor: "pointer", lineHeight: 1 },
  section: { display: "flex", flexDirection: "column", gap: "10px" },
  sectionLabel: { fontSize: "10px", letterSpacing: "0.12em", color: "#4b5563", textTransform: "uppercase" },
  brokerPills: { display: "flex", flexWrap: "wrap", gap: "6px" },
  pill: {
    fontFamily: "inherit",
    fontSize: "11px",
    padding: "5px 12px",
    borderRadius: "20px",
    border: "1px solid",
    cursor: "pointer",
    transition: "all 0.15s",
  },
  tabRow: { display: "flex", borderBottom: "1px solid rgba(255,255,255,0.08)", gap: "0" },
  tabBtn: {
    fontFamily: "inherit",
    fontSize: "12px",
    padding: "8px 16px",
    background: "none",
    border: "none",
    cursor: "pointer",
    transition: "all 0.15s",
  },
  howTo: {
    background: "rgba(59,130,246,0.06)",
    border: "1px solid rgba(59,130,246,0.15)",
    borderRadius: "8px",
    padding: "12px",
  },
  howToGrid: { display: "flex", flexDirection: "column", gap: "5px", fontSize: "11px", color: "#9ca3af", marginTop: "8px", lineHeight: 1.6 },
  dropZone: {
    border: "2px dashed rgba(255,255,255,0.1)",
    borderRadius: "10px",
    padding: "28px",
    textAlign: "center",
    cursor: "pointer",
    transition: "border-color 0.15s",
  },
  formatHint: {
    fontSize: "11px",
    color: "#4b5563",
    background: "rgba(255,255,255,0.03)",
    padding: "8px 12px",
    borderRadius: "6px",
  },
  textarea: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "12px",
    padding: "10px",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px",
    background: "rgba(255,255,255,0.04)",
    color: "#e2e8f0",
    resize: "vertical",
    outline: "none",
    width: "100%",
  },
  parseBtn: {
    fontFamily: "inherit",
    fontSize: "12px",
    padding: "8px 18px",
    borderRadius: "8px",
    border: "1px solid #3b82f6",
    background: "rgba(59,130,246,0.15)",
    color: "#3b82f6",
    cursor: "pointer",
    alignSelf: "flex-start",
  },
  error: {
    fontSize: "11px",
    color: "#fca5a5",
    background: "rgba(239,68,68,0.08)",
    border: "1px solid rgba(239,68,68,0.2)",
    borderRadius: "8px",
    padding: "12px",
    lineHeight: 1.6,
  },
  preview: {
    background: "rgba(59,130,246,0.05)",
    border: "1px solid rgba(59,130,246,0.2)",
    borderRadius: "10px",
    padding: "14px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  previewHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" },
  confirmBtn: {
    fontFamily: "inherit",
    fontSize: "12px",
    padding: "7px 16px",
    borderRadius: "8px",
    border: "none",
    background: "#3b82f6",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  },
  previewTable: { display: "flex", flexDirection: "column", gap: "2px" },
  previewRow: { display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "8px", fontSize: "11px", padding: "5px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" },
  previewHead: { color: "#4b5563", fontSize: "10px", letterSpacing: "0.06em" },
  previewNote: { fontSize: "10px", color: "#4b5563", lineHeight: 1.6 },
};
