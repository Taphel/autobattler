// Redux imports
import store from "../../store/store.js";
import { setSelectedEntity } from "../../store/slices/uiSlice.js";

// Class imports
import System from "../System.js";

// enums import
import { GameState, EntityFlag } from "../../data/enums.js";

export default class UISystem extends System {
    constructor() {
        super();
    }

    update(gameState, mouseTarget, dungeonLevel, entities) {
        switch(gameState) {
            case GameState.idle: 
                if (mouseTarget) {
                    const { x, y } = mouseTarget;
                    // Look for unit on that tile
                    const tileUnitId = dungeonLevel.findTile(x, y).entity;
                    console.log(dungeonLevel.findTile(x, y));
                    if (tileUnitId) {
                        const tileUnit = entities.find(entity => entity.id === tileUnitId);
                        if (tileUnit) {
                            const unitSprite = tileUnit.getComponent("Animation").sprites[0];
                            const unitHp = tileUnit.getComponent("UnitStats").hp;

                            store.dispatch(setSelectedEntity({sprite: unitSprite, hp: unitHp}));
                        }
                    } else {
                        store.dispatch(setSelectedEntity(null));
                    }

                }
                break;
        }
    }
}