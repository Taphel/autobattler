// CSS & sub components imports
import "./gameManager.css";
import DungeonMap from "../DungeonMap/DungeonMap.jsx";

// Static data imports
export default function GameManager() {
    return (
        <div className="gameManager">
            <DungeonMap />
        </div>
    );
}