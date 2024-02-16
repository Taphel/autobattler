// Imports
import "./gameManager.css";
import CurrencyUI from "./CurrencyUI/CurrencyUI.jsx";
import BuildUI from "./BuildUI/BuildUI.jsx";
import CombatUI from "./CombatUI/CombatUI.jsx";
import MapManager from "./MapManager/MapManager.jsx";

export default function GameManager() {

    return (
        <div className="gameManager">
            <div className="mainCol">
                <CurrencyUI />
                <CombatUI />
            </div>
            <div className="sideCol">
                <MapManager />
            </div>
            <div className="subCol">
                <BuildUI />
            </div>    
        </div>
    );
}