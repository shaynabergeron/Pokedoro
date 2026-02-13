import React from "react";
import { Link } from "react-router-dom";
import { useGameStore } from "../state/gameStore";

export function TopBar() {
  const { state } = useGameStore();
  return (
    <div className="topbar">
      <Link className="topLink" to="/trainer">
        Trainer Lv {state.trainer.level} • 💰 {state.trainer.coins}
      </Link>
      <div className="topbarRight">
        <Link className="topLink" to="/shop">🛒</Link>
        <Link className="topLink" to="/settings">⚙</Link>
      </div>
    </div>
  );
}
