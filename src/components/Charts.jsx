// src/components/Charts.jsx
// All the Recharts visualizations in one place.
// Recharts is a React-friendly chart library — no canvas manipulation needed.

import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { SECTOR_COLORS } from "../utils/stockData";
import { fmtCurrency } from "../utils/calculations";

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

/** Before vs After bar chart */
export function BeforeAfterChart({ totalCurr, totalSim }) {
  const data = [
    { name: "Before", value: totalCurr, fill: "#3b82f6" },
    { name: "After",  value: totalSim,  fill: "#ef4444" },
  ];
  return (
    <div style={CARD}>
      <div style={LABEL}>Before vs. After</div>
      <ResponsiveContainer width="100%" height={150}>
        <BarChart data={data} barSize={36}>
          <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip
            formatter={(v) => fmtCurrency(v)}
            contentStyle={{ background: "#13141b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px" }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((d, i) => <Cell key={i} fill={d.fill} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Portfolio allocation pie chart */
export function AllocationPie({ details, totalCurr }) {
  const data = details.map((d) => ({
    name:  d.h.ticker,
    value: d.currVal,
    color: SECTOR_COLORS[d.sd.sector] || SECTOR_COLORS.Other,
  }));

  return (
    <div style={CARD}>
      <div style={LABEL}>Allocation</div>
      <ResponsiveContainer width="100%" height={150}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={65}
            dataKey="value"
            nameKey="name"
          >
            {data.map((d, i) => <Cell key={i} fill={d.color} />)}
          </Pie>
          <Tooltip
            formatter={(v) => fmtCurrency(v)}
            contentStyle={{ background: "#13141b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px" }}
          />
          <Legend
            wrapperStyle={{ fontSize: "10px", color: "#9ca3af" }}
            iconSize={8}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Loss contribution horizontal bar chart */
export function LossChart({ details }) {
  const data = details
    .map((d) => ({ name: d.h.ticker, loss: Math.round(d.loss) }))
    .sort((a, b) => b.loss - a.loss);

  return (
    <div style={CARD}>
      <div style={LABEL}>Loss Contribution by Holding</div>
      <ResponsiveContainer width="100%" height={Math.max(120, data.length * 34)}>
        <BarChart data={data} layout="vertical" barSize={14}>
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            width={44}
            tick={{ fill: "#9ca3af", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(v) => ["−" + fmtCurrency(v), "Loss"]}
            contentStyle={{ background: "#13141b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px" }}
          />
          <Bar dataKey="loss" fill="#ef4444" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Scenario comparison bar chart (for the Scenarios tab) */
export function ScenarioCompareChart({ totalCurr, scenarios }) {
  const data = scenarios
    .filter((s) => s.pct)
    .map((s) => ({
      name:  s.label,
      after: Math.round(totalCurr * (1 - s.pct / 100)),
      loss:  Math.round(totalCurr * (s.pct / 100)),
    }));

  return (
    <div style={CARD}>
      <div style={LABEL}>Simulated Loss by Crash Scenario</div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} barSize={28}>
          <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip
            formatter={(v, name) => [fmtCurrency(v), name === "after" ? "Remaining" : "Loss"]}
            contentStyle={{ background: "#13141b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px" }}
          />
          <Bar dataKey="after" fill="#3b82f6" radius={[4, 4, 0, 0]} name="after" />
          <Bar dataKey="loss"  fill="#ef4444" radius={[4, 4, 0, 0]} name="loss" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
