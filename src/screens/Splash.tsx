import { useNavigate } from "react-router-dom";
import { Button } from "../app/ui/Button";
import { Card } from "../app/ui/Card";
import { useGameStore } from "../app/state/gameStore";

export default function Splash() {
  const nav = useNavigate();
  const { dispatch } = useGameStore();

  return (
    <div className="screen">
      <Card>
        <h1 className="title">Pokemonodoro</h1>
        <p className="muted">
          Pomodoro + Tamagotchi vibes — pick a Gen 1-ish starter every session, care for it on breaks, and battle for rewards.
        </p>

        <div className="stack">
          <Button onClick={() => nav("/starter")}>Start Session</Button>
          <Button
            variant="secondary"
            onClick={() => {
              dispatch({ type: "RESET" });
              nav("/");
            }}
          >
            Reset Data
          </Button>
        </div>

        <div className="muted small" style={{ marginTop: 10 }}>
          Tip: enable Strict Focus in Settings for maximum accountability.
        </div>
      </Card>
    </div>
  );
}
