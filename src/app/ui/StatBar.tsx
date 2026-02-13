import React from "react";

export function StatBar({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color?: string;
}) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="statRow">
      <div className="statLabel">{label}</div>
      <div className="barOuter">
        <div className="barInner" style={{ width: `${pct}%`, background: color ?? "var(--green)" }} />
      </div>
      <div className="statValue">{pct}%</div>
    </div>
  );
}
