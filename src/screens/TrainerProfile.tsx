import { useNavigate } from "react-router-dom";
import { Card } from "../app/ui/Card";
import { Button } from "../app/ui/Button";
import { useGameStore } from "../app/state/gameStore";

export default function TrainerProfile() {
  const nav = useNavigate();
  const { state } = useGameStore();
  const t = state.trainer;

  return (
    <div className="screen">
      <Card>
        <h2 className="h2">Trainer Profile</h2>
        <div className="stack">
          <div>Level: {t.level}</div>
          <div>Total Pomodoros: {t.totalPomodoros}</div>
          <div>Best Streak: {t.bestStreak}</div>
          <div>Current Streak: {t.currentStreak}</div>
          <div>Set Progress: {t.pomodorosInSet}/4</div>
          <div>Coins: {t.coins}</div>
        </div>

        <Button variant="secondary" onClick={() => nav(-1)}>Back</Button>
      </Card>
    </div>
  );
}
