import { useNavigate } from "react-router-dom";
import { Card } from "../app/ui/Card";
import { Button } from "../app/ui/Button";
import { useGameStore } from "../app/state/gameStore";

export default function SessionSummary() {
  const nav = useNavigate();
  const { state } = useGameStore();
  const res = state.lastSessionResult;

  if (!res) {
    nav("/starter");
    return null;
  }

  return (
    <div className="screen">
      <Card>
        <h2 className="h2">{res.completed ? "Session Complete!" : "Session Failed"}</h2>

        <div className="stack">
          <div>+{res.xpGained} XP</div>
          <div>+{res.coinsGained} Coins</div>
          {res.usedLongBreakNext && <div className="muted">Long break unlocked (+8 coins bonus)!</div>}
          {res.message && <div className="log">{res.message}</div>}
          {!res.completed && <div className="muted">Your Pokémon took a hit. Try again!</div>}
        </div>

        <div className="stack">
          <Button onClick={() => nav("/break")}>Take Break</Button>
          <Button variant="secondary" onClick={() => nav("/starter")}>
            Start Next Focus
          </Button>
        </div>
      </Card>
    </div>
  );
}
