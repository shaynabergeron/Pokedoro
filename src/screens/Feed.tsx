import { useNavigate } from "react-router-dom";
import { Card } from "../app/ui/Card";
import { Button } from "../app/ui/Button";
import { ITEMS, type ItemId } from "../app/data/items";
import { useGameStore } from "../app/state/gameStore";

export default function Feed() {
  const nav = useNavigate();
  const { state, dispatch } = useGameStore();

  function useItem(id: ItemId) {
    dispatch({ type: "APPLY_ITEM", itemId: id });
    nav("/break");
  }

  return (
    <div className="screen">
      <Card>
        <h2 className="h2">Feed / Items</h2>

        <div className="stack">
          {ITEMS.map((it) => {
            const count = state.inventory[it.id] ?? 0;
            return (
              <button
                key={it.id}
                className="listItem"
                disabled={count <= 0}
                onClick={() => useItem(it.id)}
              >
                <div>
                  <div className="starterName">{it.name}</div>
                  <div className="muted">{it.desc}</div>
                </div>
                <div className="pill">x{count}</div>
              </button>
            );
          })}
        </div>

        <div className="row">
          <Button variant="secondary" onClick={() => nav("/break")}>Back</Button>
          <Button onClick={() => nav("/shop")}>Go to Shop</Button>
        </div>
      </Card>
    </div>
  );
}
