import { useNavigate } from "react-router-dom";
import { Card } from "../app/ui/Card";
import { Button } from "../app/ui/Button";
import { ITEMS } from "../app/data/items";
import { STARTERS } from "../app/data/starters";
import { useGameStore } from "../app/state/gameStore";

export default function Shop() {
  const nav = useNavigate();
  const { state, dispatch } = useGameStore();
  const coins = state.trainer.coins;

  return (
    <div className="screen">
      <Card>
        <h2 className="h2">Shop</h2>
        <div className="muted">Coins: {coins}</div>

        <h3 className="h3">Items</h3>
        <div className="stack">
          {ITEMS.filter((x) => (x.costCoins ?? 0) > 0).map((it) => {
            const cost = it.costCoins ?? 0;
            const can = coins >= cost;
            return (
              <div key={it.id} className="shopRow">
                <div>
                  <div className="starterName">{it.name}</div>
                  <div className="muted">{it.desc}</div>
                </div>
                <div className="shopRight">
                  <div className="pill">💰 {cost}</div>
                  <Button
                    variant={can ? "primary" : "secondary"}
                    disabled={!can}
                    onClick={() => dispatch({ type: "SHOP_BUY_ITEM", itemId: it.id, qty: 1 })}
                  >
                    Buy
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <h3 className="h3" style={{ marginTop: 14 }}>Unlock Starters</h3>
        <div className="stack">
          {STARTERS.filter((s) => (s.unlockCostCoins ?? 0) > 0).map((s) => {
            const unlocked = state.trainer.unlockedStarters[s.id];
            const cost = s.unlockCostCoins ?? 0;
            const can = !unlocked && coins >= cost;

            return (
              <div key={s.id} className="shopRow">
                <div>
                  <div className="starterName">{s.name}</div>
                  <div className="muted">{s.trait}</div>
                </div>
                <div className="shopRight">
                  <div className="pill">💰 {cost}</div>
                  <Button
                    variant={unlocked ? "secondary" : "primary"}
                    disabled={unlocked || !can}
                    onClick={() => dispatch({ type: "SHOP_UNLOCK_STARTER", starterId: s.id })}
                  >
                    {unlocked ? "Unlocked" : "Unlock"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="row">
          <Button variant="secondary" onClick={() => nav(-1)}>Back</Button>
          <Button onClick={() => nav("/break")}>Return to Break</Button>
        </div>
      </Card>
    </div>
  );
}
