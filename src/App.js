import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import GamesHome from "./pages/GamesHome";
import Game1 from "./pages/Game1";
import Game2 from "./pages/Game2";
import Game3 from "./pages/Game3";
import SpinWheel from "./pages/SpinWheel";
import RabanaGame from "./pages/RabanaGame";
import CatchKavum from "./pages/CatchKavum";
import BreakPot from "./pages/BreakPot";
import Welcome from "./pages/Welcome";
import BackgroundMusic from "./components/BackgroundMusic";

function App() {
  const [player, setPlayer] = useState(null);

  // ✅ Load player from localStorage on refresh
  useEffect(() => {
    const saved = localStorage.getItem("player");
    if (saved) setPlayer(JSON.parse(saved));
  }, []);

  return (
    <>
      {/* <BackgroundMusic /> */}
      <Routes>
        {/* 🔐 If no player → force to welcome */}
        <Route
          path="/"
          element={
            player ? (
              <GamesHome player={player} />
            ) : (
              <GamesHome player={player} />
              //  <Navigate to="/welcome" />
            )
          }
        />

        <Route path="/welcome" element={<Welcome setPlayer={setPlayer} />} />

        <Route path="/spin" element={<SpinWheel player={player} />} />
        <Route path="/game1" element={<Game1 player={player} />} />
        <Route path="/game2" element={<Game2 player={player} />} />
        <Route path="/game3" element={<Game3 player={player} />} />
        <Route path="/rabana" element={<RabanaGame player={player} />} />
        <Route path="/kavum" element={<CatchKavum player={player} />} />
        <Route path="/break" element={<BreakPot player={player} />} />
      </Routes>
    </>
  );
}

export default App;
