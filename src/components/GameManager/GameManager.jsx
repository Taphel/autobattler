// CSS & sub components imports
import "./gameManager.css";
import CurrencyUI from "./CurrencyUI/CurrencyUI.jsx";
import BuildUI from "./BuildUI/BuildUI.jsx";
import CombatUI from "./CombatUI/CombatUI.jsx";
import MapManager from "./MapManager/MapManager.jsx";

// Static data imports

export default function GameManager() {

    return (
        <div className="gameManager">
            <div className="mainCol">
                <CombatUI />
            </div>
            <div className="sideCol">
            </div>
            <div className="subCol">
            </div>    
        </div>
    );
}