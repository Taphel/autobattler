import './App.css'

import GameManager from "./components/GameManager/GameManager.jsx";

function App() {
  return (
    <main onContextMenu={(event) => {event.preventDefault();}}>
      <GameManager />
    </main>
  );
}

export default App
