// React / Redux Imports
import { useSelector } from 'react-redux';

// gameLogic functions imports 
import { changeEncounterLevel } from '../../../gameLogic/managers/encounterManager.js';

// CSS & sub components imports
import "./combatUI.css";

// Libraries import
import formatNumberString from "../../../libraries/formatNumberString.js";

export default function CombatUI() {
    const { dungeonName, level, maxLevel, killCount, outcome, isBoss, enemyName, currentHp, maxHp, timer } = useSelector(state => state.encounter);

    let playerStyle = {backgroundImage: `url("/sprites/player.png")`};
    let enemyStyle = {backgroundImage: `url("/sprites/enemy.png")`};

    if (outcome) {
        if (outcome === "win") {
            playerStyle = {backgroundImage: `url("/sprites/playerwin.png")`};
            enemyStyle = {backgroundImage: `url("/sprites/enemywin.png")`};
        }
        if (outcome === "loss") {
            playerStyle = {backgroundImage: `url("/sprites/playerloss.png")`};
            enemyStyle = undefined;
        }
    }

    const hpBarFillStyle = {width: `${Math.round(currentHp) / Math.round(maxHp) * 100}%`, transition: (currentHp === maxHp) ? undefined : "width 300ms linear"};
    const timerBarFillStyle = {width: `${timer / 30 * 100}%`, transition: (timer === 30) ? undefined : "width 300ms linear" };
    // Event handlers
    function handleDungeonLevelButtonClick(type) {
        changeEncounterLevel(type);
    }

    return (
        <div className="component combatUI">
            <div className="dungeonData">
                {level > 1 ?
                    <button onClick={() => handleDungeonLevelButtonClick("previous")} className="previousLevelButton">ᐊ</button> :
                    <button className="previousLevelButton"></button>}
                <h2>{dungeonName}</h2>
                {level < maxLevel ?
                    <button onClick={() => handleDungeonLevelButtonClick("next")} className="nextLevelButton">ᐅ</button> :
                    <button className="nextLevelButton"></button>
                }
                {timer > 0 ?
                    <div className="progressBar">
                        <p className="progressText">{timer.toFixed(1)}s</p>
                        <div style={timerBarFillStyle} className="progressFill"></div>
                        <div className="progressBackground"></div>
                    </div> :
                    <h5>
                        {`Level ${level}`}
                        {((level === maxLevel) && !isBoss) && ` (${killCount} / 10)`}
                    </h5>
                }

            </div>
            <div className="combatStatus">
                <div className="combatScene">
                    <div className="playerSprite" style={playerStyle}></div>
                    <div className="enemySprite" style={enemyStyle}></div>
                </div>
                <div className="progressBar">
                            <p className="progressText">{formatNumberString(Math.round(currentHp))} / {formatNumberString(Math.round(maxHp))}</p>
                            <div style={hpBarFillStyle} className="progressFill"></div>
                            <div className="progressBackground"></div>
                </div>
            </div>
            <div className="enemyData">
                <h3>{enemyName}</h3>
                <p>??? DPS</p>
            </div>
        </div>
    );
}