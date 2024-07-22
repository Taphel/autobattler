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
  const { input, display } = gameEngine;
  function handlePointerUp(event) {
    input.pointerUp();
  }
  
  function handleResize(event) {
    console.log(event);
    display.resize(event.currentTarget.innerWidth, event.currentTarget.innerHeight)
  }

  useEffect(() => {
    display.resize(window.innerWidth, window.innerHeight);
    document.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('resize', handleResize);
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
