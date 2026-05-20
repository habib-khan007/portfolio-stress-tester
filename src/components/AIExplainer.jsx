// src/components/AIExplainer.jsx
// Sends your portfolio data to Claude AI and gets a plain-English explanation
// of your risk, what would hurt most in a crash, and what to consider.
// Uses the Anthropic API directly from the browser.

import React, { useState } from "react";
import { fmtCurrency } from "../utils/calculations";

export function AIExplainer({ result, holdings, crashPct, macroShocks }) {
  const [explanation, setExplanation] = useState("");
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");
  const [asked,       setAsked]       = useState(false);

  const generateExplanation = async () => {
    if (!result) return;
    setLoading(true);
    setError("");
    setExplanation("");
    setAsked(true);

    // Build a summary of the portfolio to send to Claude
    const holdingSummary = result.details.map((d) =>
      `${d.h.ticker}: ${d.h.qty} shares @ ₹${d.h.currPrice} (${d.sd.sector}, β${d.sd.beta})`
    ).join("\n");

    const prompt = `You are a friendly financial risk analyst helping an Indian retail investor understand their portfolio stress test results.

Here is their portfolio:
${holdingSummary}

Total current value: ${fmtCurrency(result.totalCurr)}
Simulated value after ${crashPct}% market crash: ${fmtCurrency(result.totalSim)}
Total loss in crash: ${fmtCurrency(result.totalLoss)}
Unrealized P&L: ${fmtCurrency(result.unrealized)}
Portfolio beta: ${result.avgBeta.toFixed(2)}
Risk score: ${result.riskScore}/100
Macro shocks active: ${Object.entries(macroShocks).filter(([,v])=>v).map(([k])=>k).join(", ") || "none"}

Please give a clear, friendly, plain-English explanation covering:
1. What this portfolio's risk profile actually means in simple words
2. Which holding is the biggest danger in a crash and why
3. One thing this investor should seriously consider doing
4. One thing they are doing right

Keep it under 200 words. Use ₹ for currency. Write like you're talking to a regular person, not a finance expert. Do not use bullet points — write in natural paragraphs.`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await response.json();
      const text = data.content?.find((b) => b.type === "text")?.text || "";
      if (text) {
        setExplanation(text);
      } else {
        setError("No response received. Please try again.");
      }
    } catch (err) {
      setError("Could not connect to AI. Check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div>
          <div style={styles.label}>AI Risk Explainer</div>
          <div style={styles.sub}>
            Get a plain-English explanation of your portfolio risk from Claude AI
          </div>
        </div>
        <button
          style={{
            ...styles.btn,
            opacity: loading ? 0.6 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
          onClick={generateExplanation}
          disabled={loading || !result}
        >
          {loading ? "Analysing…" : asked ? "↻ Re-analyse" : "✦ Explain my risk"}
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div style={styles.loadingWrap}>
          <div style={styles.loadingDots}>
            <span style={styles.dot} />
            <span style={{ ...styles.dot, animationDelay: "0.2s" }} />
            <span style={{ ...styles.dot, animationDelay: "0.4s" }} />
          </div>
          <div style={styles.loadingText}>Claude is analysing your portfolio…</div>
        </div>
      )}

      {/* Error */}
      {error && <div style={styles.error}>{error}</div>}

      {/* Explanation */}
      {explanation && !loading && (
        <div style={styles.result}>
          <div style={styles.aiTag}>✦ Claude AI</div>
          <div style={styles.explanation}>{explanation}</div>
          <div style={styles.disclaimer}>
            This is an AI-generated explanation for educational purposes only. Not financial advice.
          </div>
        </div>
      )}

      {/* Placeholder before first click */}
      {!asked && !loading && (
        <div style={styles.placeholder}>
          Click "Explain my risk" and Claude AI will read your portfolio numbers and
          explain what they mean in plain simple language — no finance jargon.
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  card: {
    background: "#0f1117",
    border: "1px solid rgba(139,92,246,0.3)",
    borderRadius: "12px",
    padding: "20px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
    marginBottom: "16px",
    flexWrap: "wrap",
  },
  label: {
    fontSize: "10px",
    letterSpacing: "0.14em",
    color: "#8b5cf6",
    marginBottom: "4px",
    textTransform: "uppercase",
  },
  sub: { fontSize: "12px", color: "#4b5563" },
  btn: {
    fontFamily: "inherit",
    fontSize: "12px",
    padding: "8px 18px",
    borderRadius: "8px",
    border: "1px solid #8b5cf6",
    background: "rgba(139,92,246,0.12)",
    color: "#8b5cf6",
    cursor: "pointer",
    whiteSpace: "nowrap",
    flexShrink: 0,
  },
  loadingWrap: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px",
    background: "rgba(139,92,246,0.06)",
    borderRadius: "8px",
  },
  loadingDots: { display: "flex", gap: "5px" },
  dot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#8b5cf6",
    display: "inline-block",
    animation: "pulse 1s ease-in-out infinite",
  },
  loadingText: { fontSize: "12px", color: "#8b5cf6" },
  error: {
    fontSize: "12px",
    color: "#ef4444",
    padding: "12px",
    background: "rgba(239,68,68,0.08)",
    borderRadius: "8px",
  },
  result: {
    background: "rgba(139,92,246,0.06)",
    border: "1px solid rgba(139,92,246,0.2)",
    borderRadius: "10px",
    padding: "16px",
  },
  aiTag: {
    fontSize: "10px",
    color: "#8b5cf6",
    letterSpacing: "0.1em",
    marginBottom: "10px",
  },
  explanation: {
    fontSize: "13px",
    color: "#e2e8f0",
    lineHeight: 1.8,
    whiteSpace: "pre-wrap",
  },
  disclaimer: {
    fontSize: "10px",
    color: "#374151",
    marginTop: "12px",
    paddingTop: "10px",
    borderTop: "1px solid rgba(255,255,255,0.05)",
  },
  placeholder: {
    fontSize: "12px",
    color: "#374151",
    lineHeight: 1.7,
    padding: "12px",
    background: "rgba(255,255,255,0.02)",
    borderRadius: "8px",
    textAlign: "center",
  },
};
