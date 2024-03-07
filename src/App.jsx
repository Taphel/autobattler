import './App.css'

import GameManager from "./components/GameManager/GameManager.jsx";

function App() {
  return (
    <main onContextMenu={(event) => {event.preventDefault();}}>
      <header>
        <h1>Guildle</h1>
      </header>
      <GameManager />
    </main>
  );
}

export default App
