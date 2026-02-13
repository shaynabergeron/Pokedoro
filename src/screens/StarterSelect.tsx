import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { STARTERS, type StarterId } from "../app/data/starters";
import { Card } from "../app/ui/Card";
import { Button } from "../app/ui/Button";
import { PixelSprite } from "../app/ui/PixelSprite";
import { useGameStore } from "../app/state/gameStore";

export default function StarterSelect() {
  const nav = useNavigate();
  const { state, dispatch } = useGameStore();
  const unlocked = state.trainer.unlockedStarters;

  const options = useMemo(() => STARTERS.filter((s) => unlocked[s.id]), [unlocked]);
  const [selected, setSelected] = useState<StarterId>(options[0]?.id ?? "bulbasaur");
  const [nickname, setNickname] = useState("");

  return (
    <div className="screen">
      <Card>
        <h2 className="h2">Choose your starter</h2>

        <div className="grid">
          {options.map((s) => (
            <button
              key={s.id}
              className={["starterCard", selected === s.id ? "starterSelected" : ""].join(" ")}
              onClick={() => setSelected(s.id)}
            >
              <PixelSprite label={s.name} mood={selected === s.id ? "happy" : "idle"} />
              <div className="starterName">{s.name}</div>
              <div className="muted">{s.trait}</div>
            </button>
          ))}
        </div>

        <label className="field" style={{ marginTop: 12 }}>
          Nickname (optional)
          <input value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="e.g., Leafy" />
        </label>

        <div className="row">
          <Button
            onClick={() => {
              dispatch({ type: "START_SESSION", starterId: selected, nickname: nickname.trim() || undefined });
              nav("/focus");
            }}
          >
            Confirm
          </Button>
          <Button variant="secondary" onClick={() => nav("/")}>
            Back
          </Button>
        </div>
      </Card>
    </div>
  );
}
