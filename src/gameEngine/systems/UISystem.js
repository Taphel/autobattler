// Redux imports
import store from "../../store/store.js";
import { setUiSprites } from "../../store/slices/battleSlice.js";

// Class imports
import System from "../System.js";

import { MouseOver, MouseDrag } from "../components/EntityTracker.js";
import Transform from "../components/Transform.js";
import Animation from "../components/Animation.js";

// enums import
import { GameState, SpriteLayer } from "../../data/enums.js";

export default class UISystem extends System {
    #mouseDragId;
    #mouseOverId;
    #unitOverlays = [];
    constructor() {
        super();
    }

    init(entities, components, boardSize) {
        const { mouseOver, mouseDrag } = components;

        const mouseOverId = entities.length;
        this.#mouseOverId = mouseOverId;
        entities.push(mouseOverId);
        mouseOver.add(mouseOverId, new MouseOver(0, 0.5, SpriteLayer.tileCursor, "tilecursor", 2, 240));

        const mouseDragId = entities.length;
        this.#mouseDragId = mouseDragId;
        entities.push(mouseDragId);
        mouseDrag.add(mouseDragId, new MouseDrag(SpriteLayer.mouseDrag));

        for (let i = 0; i < boardSize * 2; i++) {
            const unitOverlayId = entities.length;
            this.#unitOverlays.push(unitOverlayId);
            entities.push(unitOverlayId);

            // Overlay component
        }
    }

    update(gameState, entities, components, spriteSize, deltaTime) {
        const { mouseOver, mouseDrag, tile, transform, animation, unitInfo, unitStats, unitSkill } = components;
        const uiDispatchData = [];
        switch (gameState) {
            case GameState.idle:
                entities.forEach(entity => {
                    let entityTransform, entityAnimation;
                    if (mouseOver.has(entity)) {
                        const entityMouseOver = mouseOver.get(entity);
                        const { targetId, offset, z } = entityMouseOver;
                        if (targetId !== null && tile.has(targetId)) {
                            const targetPosition = tile.get(targetId).value.position;

                            // Create or update the transform and animation components for the cursor
                            if (transform.has(entity)) {
                                entityTransform = transform.get(entity);
                                entityTransform.setTarget(targetPosition.x + offset.x, targetPosition.y + offset.y);
                                entityTransform.update(deltaTime);
                            } else {
                                entityTransform = new Transform(targetPosition.x + offset.x, targetPosition.y + offset.y, z, 0, 1, 1);
                                transform.add(entity, entityTransform);
                            }

                            if (animation.has(entity)) {
                                entityAnimation = animation.get(entity);
                                entityAnimation.update(deltaTime);
                            } else {
                                const { path, frames, duration } = entityMouseOver.sprite;
                                entityAnimation = new Animation(path, frames, duration);
                                animation.add(entity, entityAnimation);
                            }
                        } else {
                            transform.remove(entity);
                            animation.remove(entity);
                        }
                    }

                    if (mouseDrag.has(entity)) {
                        const entityMouseDrag = mouseDrag.get(entity);
                        const { targetId, mousePosition, z } = entityMouseDrag;

                        // copy target entity's animation
                        if (targetId !== null && animation.has(targetId)) {
                            entityAnimation = animation.get(targetId);
                        }

                        if (mousePosition) {

                        }
                        if (mousePosition && 'x' in mousePosition && 'y' in mousePosition) {
                            if (transform.has(entity)) {
                                entityTransform = transform.get(entity);
                                entityTransform.setTarget(mousePosition.x / spriteSize, mousePosition.y / spriteSize);
                                entityTransform.update(deltaTime);
                            } else {
                                entityTransform = new Transform(mousePosition.x / spriteSize, mousePosition.y / spriteSize, z, 0, -1, 1);
                                transform.add(entity, entityTransform);
                            }
                        }
                    }

                    if (entityTransform && entityAnimation) {
                        const { x, y, z } = entityTransform.position;
                        const { anchor, scale } = entityTransform;
                        const { sprite } = entityAnimation;
                        uiDispatchData.push({
                            id: entity,
                            x: x,
                            y: y,
                            z: z,
                            sprite: sprite,
                            alpha: 1,
                            scale: scale,
                            anchor: anchor,
                        })
                    }
                })
                store.dispatch(setUiSprites(uiDispatchData));
        }
    }
}