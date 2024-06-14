// Class imports
import System from "../System.js";
import PathFinder from "./Physics/PathFinder.js";

// data import
import { GameState, EntityFlag, TileType } from "../../data/enums.js";
import constants from "../../data/constants.js";

export default class BattleSystem extends System {
    #pendingActions;
    constructor() {
        super();
    }

    update(dungeonLevel, entities, components, inputs, gameState) {
        const { skip, forceMove, direction } = inputs[0];
        const { entityFlags, unitStats, unitSkills, transform } = components;
        let newDisplayQueue = [];
        let activeEntities = 0;

        switch (gameState) {
            case (GameState.turnStart): {
                // Look if player can act
                const playerId = entities.find(entity => {
                    return entityFlags.has(entity) ? entityFlags.get(entity).hasFlag(EntityFlag.player) : false;
                })

                if (unitStats.get(playerId).actionValue >= constants.actionCost) {
                    // wait for player input
                    if (skip) {
                        // Skip turn button pressed, skip turn
                        unitStats.get(playerId).act();
                        console.log("Skip input, player turn passed");
                        console.log(unitStats.get(playerId).actionValue);
                    } else if (direction) {
                        // valid direction input, look for a valid attack target
                        const playerTransform = transform.get(playerId);
                        const { tilePosition } = playerTransform;

                        const playerAttack = unitSkills.get(playerId).attack;
                        let target = null;
                        
                        if (!forceMove) {
                            // Check for valid attack target ! TBD - harm/noharm flag check !
                            const { range } = playerAttack;

                            let validTargets = [];

                            // Loop through tiles in range and look for a valid attack target
                            let startX, endX, startY, endY

                            if (direction.x && !direction.y) {
                                startX = tilePosition.x + direction.x * range.min;
                                endX = tilePosition.x + direction.x * range.max;

                                startY = tilePosition.y;
                                endY = tilePosition.y;
                            }

                            if (direction.y && !direction.x) {
                                startY = tilePosition.y + direction.y;
                                endY = tilePosition.y + direction.y * range.max;

                                startX = tilePosition.x;
                                endX = tilePosition.x;
                            }

                            console.log(tilePosition, startX, startY, endX, endY);

                            for (let x = startX; x <= endX; x++) {
                                for (let y = startY; y <= endY; y++) {
                                    const targetTile = dungeonLevel.findTile(x, y);
                                    if (targetTile && targetTile?.entity) {
                                        if (entityFlags.has(targetTile.entity) && entityFlags.get(targetTile.entity)?.hasFlag(EntityFlag.enemy)) {
                                            validTargets.push({
                                                id: targetTile.entity,
                                                position: targetTile.position
                                            });
                                        }
                                    }
                                }
                            }

                            console.log(validTargets);

                            if (validTargets.length > 0) target = validTargets.shift();
                            console.log(target);
                        }

                        if (target) {
                            // !! TBD - area skill effect & animation !!
                            unitStats.get(playerId).act();
                            const player = { id: playerId, position: tilePosition };
                            const newAnimations = this.#performAction(player, target, components, dungeonLevel)
                            newAnimations.forEach(animation => newDisplayQueue.push(animation))
                        } else {
                            // check for a free tile in the player direction
                            const endTile = dungeonLevel.findTile(tilePosition.x + direction.x, tilePosition.y + direction.y);

                            if (endTile && endTile?.type === TileType.floor && !endTile?.entity) {
                                unitStats.get(playerId).act();

                                const startTile = dungeonLevel.findTile(tilePosition.x, tilePosition.y)
                                // Move
                                newDisplayQueue.push(this.#moveEntity(playerId, startTile, endTile, components));
                            }
                        }

                        // Check for remaining actions on player, if so, skip to next turn
                        if (unitStats.get(playerId).actionValue >= constants.actionCost) {
                            activeEntities++;
                            break;
                        }
                    }
                }
                /// ! Loop through non-player entities - TBD ! ///
                break;

            }
            case (GameState.turnEnd): {
                // Update action value
                entities.forEach(entity => {
                    if (unitStats.has(entity)) {
                        const stats = unitStats.get(entity);
                        stats.gainActionValue();
                        if (stats.actionValue >= constants.actionCost) activeEntities++;
                    }
                })
                break;
            }
        }

        return {
            gameState: activeEntities ? GameState.turnStart : GameState.turnEnd,
            newDisplayQueue: newDisplayQueue
        }
    }

    #performAction(user, target, components, dungeonLevel) {
        let newAnimations = []
        const { unitSkills, unitStats, transform } = components
        /// ! TBD - handle non-attack skills ! ///
        const action = unitSkills.get(user.id).attack;
        /// !! TBD - area skill effect & animation !! ///  
        const actionResult = action.perform();
        console.log(actionResult);
        let targetDeathCheck, userDeathCheck = false;

        /// !! TBD - forced movement after animation, and before death check !! ///

        actionResult.target.forEach(result => {
            if (result.animation) {
                const { sprite, frames } = result.animation;
                newAnimations.push({
                    animation: {
                        position: target.position,
                        sprite: sprite,
                        frames: frames
                    }
                })
            }

            // Forced movement

            // Death check
            targetDeathCheck = unitStats.get(target.id).update(result);
            if (targetDeathCheck) {
                // Clean target tile
                console.log(transform.get(target.id));
                const { tilePosition } = transform.get(target.id);
                dungeonLevel.findTile(tilePosition.x, tilePosition.y).setEntity(null);

                newAnimations.push({
                    death: {
                        id: target.id
                    }
                });
            }
        });

        actionResult.user.forEach(result => {
            userDeathCheck = unitStats.get(user).update(result);
            if (result.animation) {
                const { sprite, frames } = result.animation;
                newAnimations.push({
                    animation: {
                        position: user.position,
                        sprite: sprite,
                        frames: frames
                    } 
                })
            }

            // Forced movement

            // Death check
            userDeathCheck = unitStats.get(user)?.update(result);
            if (userDeathCheck) {
                // Clean target tile
                const { tilePosition } = transform.get(user.id);
                dungeonLevel.findTile(tilePosition.x, tilePosition.y).setEntity(null);

                newAnimations.push({
                    death: {
                        id: user.id
                    }
                });
            }
        });

        return newAnimations;
    }

    #moveEntity(id, startTile, endTile, components) {
        const { transform, unitStats } = components;
        // Move
        endTile.setEntity(id);
        startTile.setEntity(null);
        transform.get(id).move(endTile.position.x, endTile.position.y);

        return {
            transform: {
                id: id,
                position: endTile.position
            }
        }
    }

    #getDistance(userPos, targetPos) {
        return Math.abs(targetPos.x - userPos.x) + Math.abs(targetPos.y - userPos.y);
    }

}