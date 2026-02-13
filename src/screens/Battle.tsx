import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../app/ui/Card";
import { Button } from "../app/ui/Button";
import { PixelSprite } from "../app/ui/PixelSprite";
import { useGameStore } from "../app/state/gameStore";
import { getWildEncounter } from "../app/data/wild";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function rollDamage(atk: number, def: number) {
  const base = Math.max(1, atk - Math.floor(def / 2));
  return base + Math.floor(Math.random() * 4); // +0..3
}

export default function Battle() {
  const nav = useNavigate();
  const { state, dispatch } = useGameStore();
  const p = state.activePokemon;

  const wild = useMemo(() => getWildEncounter(state.trainer.currentStreak), [state.trainer.currentStreak]);

  const [enemyHp, setEnemyHp] = useState(wild.hp);
  const [playerHp, setPlayerHp] = useState(p?.hp ?? 1);
  const [log, setLog] = useState<string>(`A wild ${wild.name} appeared!`);
  const [ended, setEnded] = useState(false);

  if (!p) {
    nav("/starter");
    return null;
  }

  function endBattle(won: boolean, hpDelta: number) {
    if (ended) return;
    setEnded(true);

    // Pikachu: tiny luck bonus on wins
    const coinsBonus = p.starterId === "pikachu" && won ? 2 : 0;

    dispatch({
      type: "BATTLE_END",
      won,
      rewardXp: won ? wild.rewardXp : 0,
      rewardCoins: won ? wild.rewardCoins + coinsBonus : 0,
      hpDelta,
    });

    setTimeout(() => nav("/break"), 450);
  }

  function playerTurn(mult: number) {
    if (ended) return;

    const dmg = Math.floor(rollDamage(p.atk, wild.def) * mult);
    const nextEnemy = clamp(enemyHp - dmg, 0, wild.hp);
    setEnemyHp(nextEnemy);

    if (nextEnemy <= 0) {
      setLog(`You hit for ${dmg}. ${wild.name} fainted!`);
      // hpDelta is (playerHp - originalHp) at commit time; we store only delta vs current stored hp
      const hpDelta = playerHp - p.hp;
      endBattle(true, hpDelta);
      return;
    }

    // Enemy retaliates
    const enemyDmg = rollDamage(wild.atk, p.def);
    const nextPlayer = clamp(playerHp - enemyDmg, 0, p.maxHp);
    setPlayerHp(nextPlayer);

    if (nextPlayer <= 0) {
      setLog(`You hit for ${dmg}. ${wild.name} hit back for ${enemyDmg}. You fainted!`);
      const hpDelta = nextPlayer - p.hp;
      endBattle(false, hpDelta);
      return;
    }

    setLog(`You hit ${wild.name} for ${dmg}. It hits back for ${enemyDmg}.`);
  }

  return (
    <div className="screen">
      <Card>
        <h2 className="h2">Battle</h2>

        <div className="battleRow">
          <div className="battleCol">
            <div className="muted">Wild</div>
            <PixelSprite label={wild.name} mood={ended ? "tired" : "idle"} />
            <div className="muted">HP: {enemyHp}/{wild.hp}</div>
          </div>

          <div className="battleCol">
            <div className="muted">You</div>
            <PixelSprite label={p.nickname} mood={playerHp < p.hp ? "sad" : "idle"} />
            <div className="muted">HP: {playerHp}/{p.maxHp}</div>
          </div>
        </div>

        <div className="log">{log}</div>

        <div className="grid2">
          <Button onClick={() => playerTurn(1)} disabled={ended}>Attack</Button>
          <Button onClick={() => playerTurn(1.25)} disabled={ended}>Special</Button>
          <Button variant="secondary" onClick={() => nav("/break")}>Run</Button>
          <Button variant="secondary" onClick={() => nav("/break")}>Back</Button>
        </div>
      </Card>
    </div>
  );
}
