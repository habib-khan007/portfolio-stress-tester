// src/components/HoldingRow.jsx
// One row in the portfolio table: ticker | qty | buy price | current price | delete
// The "Fetch" button calls the Finnhub API to fill in the live current price.

import React, { useState } from "react";
import { useFinnhub } from "../hooks/useFinnhub";

export function HoldingRow({ holding, onChange, onRemove }) {
  const { fetchPrice, loading } = useFinnhub();
  const [fetched, setFetched] = useState(false);

  // Handle any field change
  const handle = (field) => (e) => {
    const val = field === "ticker" ? e.target.value.toUpperCase() : parseFloat(e.target.value) || 0;
    onChange({ ...holding, [field]: val });
  };

  // Fetch live price from Finnhub
  const handleFetch = async () => {
    if (!holding.ticker) return;
    const price = await fetchPrice(holding.ticker);
    if (price) {
      onChange({ ...holding, currPrice: price });
      setFetched(true);
      setTimeout(() => setFetched(false), 2000);
    }
  };

  return (
    <div style={styles.row}>
      {/* Ticker */}
      <input
        style={{ ...styles.input, ...styles.ticker }}
        value={holding.ticker}
        onChange={handle("ticker")}
        placeholder="AAPL"
        maxLength={6}
      />

      {/* Quantity */}
      <input
        style={styles.input}
        type="number"
        value={holding.qty || ""}
        onChange={handle("qty")}
        placeholder="Qty"
        min="0"
      />

      {/* Buy Price */}
      <input
        style={styles.input}
        type="number"
        value={holding.buyPrice || ""}
        onChange={handle("buyPrice")}
        placeholder="Buy $"
        min="0"
        step="0.01"
      />

      {/* Current Price + Fetch button */}
      <div style={styles.priceWrap}>
        <input
          style={styles.input}
          type="number"
          value={holding.currPrice || ""}
          onChange={handle("currPrice")}
          placeholder="Now $"
          min="0"
          step="0.01"
        />
        <button
          style={{
            ...styles.fetchBtn,
            background: fetched ? "rgba(16,185,129,0.2)" : "rgba(59,130,246,0.15)",
            color: fetched ? "#10b981" : "#3b82f6",
          }}
          onClick={handleFetch}
          disabled={loading || !holding.ticker}
          title="Fetch live price from Finnhub"
        >
          {loading ? "…" : fetched ? "✓" : "↻"}
        </button>
      </div>

      {/* Remove */}
      <button style={styles.removeBtn} onClick={onRemove} title="Remove holding">
        ×
      </button>
    </div>
  );
}

const styles = {
  row: {
    display: "grid",
    gridTemplateColumns: "56px 1fr 1fr 1fr 24px",
    gap: "4px",
    marginBottom: "6px",
    alignItems: "center",
  },
  input: {
    fontFamily: "'JetBrains Mono', 'Courier New', monospace",
    fontSize: "12px",
    padding: "6px 7px",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "7px",
    background: "rgba(255,255,255,0.05)",
    color: "#e2e8f0",
    width: "100%",
    outline: "none",
  },
  ticker: {
    textTransform: "uppercase",
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: "0.05em",
  },
  priceWrap: {
    display: "flex",
    gap: "3px",
    alignItems: "center",
  },
  fetchBtn: {
    flexShrink: 0,
    width: "26px",
    height: "26px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  removeBtn: {
    background: "none",
    border: "none",
    color: "#4b5563",
    cursor: "pointer",
    fontSize: "18px",
    lineHeight: "1",
    textAlign: "center",
    padding: "0",
    transition: "color 0.15s",
  },
};
