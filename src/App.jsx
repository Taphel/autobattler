// CSS / React / Pixi
import './App.css'
import MapDisplay from "./components/MapDisplay/MapDisplay.jsx";
import BattleScreen from "./components/BattleScreen/BattleScreen.jsx";
import GameUI from "./components/GameUI/GameUI.jsx"

import { useEffect } from 'react';
import { useSelector } from "react-redux";

// Enums
import { GameState } from "./data/enums.js";

function App({ gameEngine }) {
  const { gameState } = useSelector((state) => state.gameState);
  const { input } = gameEngine;
  function handlePointerUp(event) {
    console.log(event);
    input.pointerUp(event);
  }
  
  function handleKeyUp(event) {
    console.log(event);
    input.keyUp(event);
  }

  useEffect(() => {
    document.addEventListener('pointerup', handlePointerUp);
  }, [])

  return (
    <main onContextMenu={(event) => { event.preventDefault(); }}>
      { (gameState === GameState.mapStart || gameState === GameState.map || gameState === GameState.roomStart) && 
        <MapDisplay gameEngine={gameEngine}/>
      }
      { gameState === GameState.idle &&
        <BattleScreen gameEngine={gameEngine} />
      }
    </main>
  );
}
export default App
