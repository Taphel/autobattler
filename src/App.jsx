// CSS / React / Pixi
import './App.css'
import CameraDisplay from "./components/CameraDisplay/CameraDisplay.jsx";
import GameUI from "./components/GameUI/GameUI.jsx"

import { useEffect } from 'react';



function App({ gameEngine }) {
  const { input } = gameEngine;
  console.log(input);
  function handleKeyDown(event) {
    console.log(event);
    input.keyDown(event);
  }
  
  function handleKeyUp(event) {
    console.log(event);
    input.keyUp(event);
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
  }, [])

  return (
    <main onContextMenu={(event) => { event.preventDefault(); }}>
      <CameraDisplay />
      <GameUI />
    </main>
  );
}
export default App
