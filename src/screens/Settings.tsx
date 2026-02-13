import { useNavigate } from "react-router-dom";
import { Card } from "../app/ui/Card";
import { Button } from "../app/ui/Button";
import { useGameStore } from "../app/state/gameStore";
import { ensureNotifyPermission } from "../app/state/notify";

export default function Settings() {
  const nav = useNavigate();
  const { state, dispatch } = useGameStore();
  const s = state.settings;

  return (
    <div className="screen">
      <Card>
        <h2 className="h2">Settings</h2>

        <div className="stack">
          <label className="field">
            Focus Minutes
            <input
              type="number"
              min={1}
              value={s.focusMinutes}
              onChange={(e) =>
                dispatch({ type: "UPDATE_SETTINGS", patch: { focusMinutes: Number(e.target.value) } })
              }
            />
          </label>

          <label className="field">
            Break Minutes
            <input
              type="number"
              min={1}
              value={s.breakMinutes}
              onChange={(e) =>
                dispatch({ type: "UPDATE_SETTINGS", patch: { breakMinutes: Number(e.target.value) } })
              }
            />
          </label>

          <label className="field">
            Long Break Minutes (after 4)
            <input
              type="number"
              min={1}
              value={s.longBreakMinutes}
              onChange={(e) =>
                dispatch({ type: "UPDATE_SETTINGS", patch: { longBreakMinutes: Number(e.target.value) } })
              }
            />
          </label>

          <label className="fieldRow">
            Strict Focus (leaving tab fails)
            <input
              type="checkbox"
              checked={s.strictFocus}
              onChange={(e) =>
                dispatch({ type: "UPDATE_SETTINGS", patch: { strictFocus: e.target.checked } })
              }
            />
          </label>

          <label className="fieldRow">
            Notifications
            <input
              type="checkbox"
              checked={s.notifications}
              onChange={async (e) => {
                if (e.target.checked) await ensureNotifyPermission();
                dispatch({ type: "UPDATE_SETTINGS", patch: { notifications: e.target.checked } });
              }}
            />
          </label>

          <label className="fieldRow">
            Sound (placeholder)
            <input
              type="checkbox"
              checked={s.sound}
              onChange={(e) =>
                dispatch({ type: "UPDATE_SETTINGS", patch: { sound: e.target.checked } })
              }
            />
          </label>
        </div>

        <Button variant="secondary" onClick={() => nav(-1)}>Back</Button>
      </Card>
    </div>
  );
}
