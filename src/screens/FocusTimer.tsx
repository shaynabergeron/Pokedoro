import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TopBar } from "../app/ui/TopBar";
import { Card } from "../app/ui/Card";
import { Button } from "../app/ui/Button";
import { PixelSprite } from "../app/ui/PixelSprite";
import { StatBar } from "../app/ui/StatBar";
import { useGameStore } from "../app/state/gameStore";
import { ensureNotifyPermission, notify } from "../app/state/notify";

function fmt(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function FocusTimer() {
  const nav = useNavigate();
  const { state, dispatch } = useGameStore();
  const p = state.activePokemon;

  const total = useMemo(() => Math.max(1, state.settings.focusMinutes) * 60, [state.settings.focusMinutes]);
  const [secs, setSecs] = useState(total);
  const [paused, setPaused] = useState(false);
  const [warned, setWarned] = useState(false);

  const leftRef = useRef(false);

  useEffect(() => {
    if (!p) nav("/starter");
  }, [p, nav]);

  useEffect(() => {
    if (!state.settings.notifications) return;
    ensureNotifyPermission().catch(() => {});
  }, [state.settings.notifications]);

  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === "hidden") {
        leftRef.current = true;
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    if (paused) return;
    if (secs <= 0) return;

    const t = window.setInterval(() => setSecs((x) => x - 1), 1000);
    return () => window.clearInterval(t);
  }, [secs, paused]);

  useEffect(() => {
    if (secs === 30 && state.settings.notifications) {
      notify("Pokemonodoro", "30 seconds left — finish strong!");
    }
    if (secs !== 0) return;

    // Strict Focus: leaving tab fails
    if (state.settings.strictFocus && leftRef.current) {
      dispatch({ type: "FAIL_FOCUS", reason: "Left the app during focus (Strict Focus enabled)." });
      nav("/summary");
      return;
    }

    // Not strict: leaving tab just gives a warning + small penalty via reason message
    if (!state.settings.strictFocus && leftRef.current) {
      dispatch({ type: "COMPLETE_FOCUS", reason: "Completed — but you left the app once (no Strict Focus)." });
      nav("/summary");
      return;
    }

    dispatch({ type: "COMPLETE_FOCUS" });
    nav("/summary");
  }, [secs, dispatch, nav, state.settings.strictFocus, state.settings.notifications]);

  if (!p) return null;

  useEffect(() => {
    if (!state.settings.strictFocus) return;
    if (!leftRef.current) return;
    if (warned) return;
    setWarned(true);
  }, [state.settings.strictFocus, warned]);

  return (
    <div className="screen">
      <TopBar />
      <Card>
        <div className="center">
          <PixelSprite label={p.nickname} mood={warned ? "sad" : "idle"} />
          <div className="muted">{p.starterId} • Lv {p.level}</div>
        </div>

        <div className="stack">
          <StatBar label="HP" value={p.hp} max={p.maxHp} color="var(--red)" />
          <StatBar label="Hunger" value={100 - p.hunger} max={100} color="var(--yellow)" />
          <StatBar label="Happiness" value={p.happiness} max={100} color="var(--green)" />
        </div>

        <div className="timer">{fmt(secs)}</div>
        <div className="muted center">
          Focus • Set {state.trainer.pomodorosInSet + 1}/4
          {state.settings.strictFocus ? " • Strict Focus ON" : " • Strict Focus OFF"}
        </div>

        {warned && state.settings.strictFocus && (
          <div className="log" style={{ marginTop: 10 }}>
            You left the app. In Strict Focus, this session will fail at the end.
          </div>
        )}

        <div className="row">
          <Button variant="secondary" onClick={() => setPaused((x) => !x)}>
            {paused ? "Resume" : "Pause"}
          </Button>
          <Button
            onClick={() => {
              dispatch({ type: "FAIL_FOCUS", reason: "Gave up early." });
              nav("/summary");
            }}
          >
            Give Up
          </Button>
        </div>
      </Card>
    </div>
  );
}
