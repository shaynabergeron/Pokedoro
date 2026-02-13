import { Navigate, Route, Routes } from "react-router-dom";
import Splash from "./screens/Splash";
import StarterSelect from "./screens/StarterSelect";
import FocusTimer from "./screens/FocusTimer";
import SessionSummary from "./screens/SessionSummary";
import BreakHub from "./screens/BreakHub";
import Feed from "./screens/Feed";
import Battle from "./screens/Battle";
import TrainerProfile from "./screens/TrainerProfile";
import Settings from "./screens/Settings";
import Shop from "./screens/Shop";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/starter" element={<StarterSelect />} />
      <Route path="/focus" element={<FocusTimer />} />
      <Route path="/summary" element={<SessionSummary />} />
      <Route path="/break" element={<BreakHub />} />
      <Route path="/feed" element={<Feed />} />
      <Route path="/battle" element={<Battle />} />
      <Route path="/trainer" element={<TrainerProfile />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
