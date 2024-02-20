// CSS & sub components imports
import "./combatUI.css";

// Libraries import
import formatNumberString from "../../../libraries/formatNumberString.js";

export default function CombatUI( { props } ) {
    function handleEnemyClick() {
        if (props.encounter.defeated) {
            props.currenciesDispatch({type: "add", currency: "gold", value: props.encounter.enemy.reward});
            props.encounterDispatch({type: "generate_encounter"});
        } else {
            props.encounterDispatch({type: "damage_enemy", value: 5});
        }
    }

    return (
        <div className="component combatUI">
            <div className="dungeonData">
                <h2>{props.encounter.dungeonName}</h2>
                <p>
                    {`Enemies killed: ${props.encounter.killCount}`}
                </p>
            </div>
            <div className="enemyStatus">
                <div className="enemySprite" onClick={handleEnemyClick}></div>
                <div className="progressBar">
                    <p className="progressText">{formatNumberString(props.encounter.enemy.currentHp, "ceil")} / {formatNumberString(props.encounter.enemy.maxHp, "ceil")}</p>
                    <div style={{width: `${Math.round(props.encounter.enemy.currentHp) / Math.round(props.encounter.enemy.maxHp) * 100}%`}}className="progressFill"></div>
                    <div className="progressBackground"></div>
                </div>
            </div>
            <div className="enemyData">
                <h2>{props.encounter.enemy.name}</h2>
                <p>1 DPS</p>
            </div>
        </div>
    );
}