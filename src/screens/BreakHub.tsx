import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TopBar } from "../app/ui/TopBar";
import { Card } from "../app/ui/Card";
import { Button } from "../app/ui/Button";
import { PixelSprite } from "../app/ui/PixelSprite";
import { StatBar } from "../app/ui/StatBar";
import { useGameStore } from "../app/state/gameStore";
import { notify } from "../app/state/notify";

function fmt(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function BreakHub() {
  const nav = useNavigate();
  const { state } = useGameStore();
  const p = state.activePokemon;

  const isLongBreak = state.lastSessionResult?.usedLongBreakNext === true;
  const breakMins = isLongBreak ? state.settings.longBreakMinutes : state.settings.breakMinutes;

  const total = useMemo(() => Math.max(1, breakMins) * 60, [breakMins]);
  const [secs, setSecs] = useState(total);

  useEffect(() => {
    if (!p) nav("/starter");
  }, [p, nav]);

  useEffect(() => {
    if (secs <= 0) return;
    const t = window.setInterval(() => setSecs((x) => x - 1), 1000);
    return () => window.clearInterval(t);
  }, [secs]);

  useEffect(() => {
    if (secs === 30 && state.settings.notifications) {
      notify("Pokemonodoro", "30 seconds left on break.");
    }
    if (secs === 0) nav("/starter");
  }, [secs, nav, state.settings.notifications]);

  if (!p) return null;

  return (
    <div className="screen">
      <TopBar />
      <Card>
        <div className="center">
          <div className="muted">{isLongBreak ? "Long Break" : "Break"}</div>
          <div className="timer">{fmt(secs)}</div>
        </div>

        <div className="center">
          <PixelSprite label={p.nickname} mood={p.mood} />
          <div className="muted">{p.starterId} • Lv {p.level}</div>
        </div>

        <div className="stack">
          <StatBar label="HP" value={p.hp} max={p.maxHp} color="var(--red)" />
          <StatBar label="Hunger" value={100 - p.hunger} max={100} color="var(--yellow)" />
          <StatBar label="Happiness" value={p.happiness} max={100} color="var(--green)" />
        </div>

        <div className="grid2">
          <Button onClick={() => nav("/feed")}>Feed</Button>
          <Button onClick={() => nav("/battle")}>Battle</Button>
          <Button variant="secondary" onClick={() => nav("/shop")}>Shop</Button>
          <Button variant="secondary" onClick={() => nav("/starter")}>End Break</Button>
        </div>
      </Card>
    </div>
  );
}
