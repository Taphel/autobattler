// CSS / React / Pixi
import "./gameUI.css";

// React & Redux imports
import { useSelector } from "react-redux";

// Static data imports
export default function GameUI(gameEngine) {
    const { selectedEntity } = useSelector((state) => state.ui);

    if (selectedEntity) {
        return (
            <div className="gameUI">
                <div className="targetStatus">
                    <div className="uiItem target">
                        <div className="targetIcon" style={{backgroundImage: `url("${selectedEntity.sprite}")`}}></div>
                    </div>
                    <div className="hpBar">
                        <p className="hpText">{selectedEntity.hp.current} / {selectedEntity.hp.max}</p>
                    </div>
                </div>
                {/* <div className="buttonBar">
                    <button className="uiItem uiButton skillButton">
                        🔥
                        <div className="manaCost">
                            <p className="manaText"></p>
                        </div>
                    </button>
                    <button className="uiItem uiButton skillButton">
                        💧
                        <div className="manaCost">
                            <p className="manaText"></p>
                        </div>
                    </button>
                    <button className="uiItem uiButton skillButton">
                        ⚔️
                        <div className="manaCost">
                            <p className="manaText"></p>
                        </div>
                    </button>
                    <button className="uiItem uiButton skillButton">
                        🤪
                        <div className="manaCost">
                            <p className="manaText"></p>
                        </div>
                    </button>
                    <button className="uiItem uiButton turnEndButton">⌛</button>
                </div> */}
            </div>
        )
    }   
}