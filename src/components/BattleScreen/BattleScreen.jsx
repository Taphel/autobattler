// CSS / React / Pixi
import "./battleScreen.css";

import { Stage, Container, Sprite } from '@pixi/react';
import { Rectangle, Assets } from 'pixi.js';
import '@pixi/events';

// React & Redux imports
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

// Static data imports
import manifest from "../../data/manifest.js";

export default function BattleScreen({ gameEngine }) {
    const { tiles, entities, uiElements, screenWidth, screenHeight, spriteSize } = useSelector((state) => state.battle);
    const [battleTextures, setBattleTextures] = useState(null);
    const { input } = gameEngine;

    useEffect(() => {
        const battleBundle = manifest.bundles.find(bundle => bundle.name === "battle");
        Assets.addBundle(battleBundle.name, battleBundle.assets)
        const loadTextures = async () => {
            const assets = await Assets.loadBundle(battleBundle.name);
            return assets;
        }
        loadTextures().then(value => setBattleTextures(value));
    }, [])

    return (
        <Stage
            x={0}
            y={0}
            width={screenWidth * spriteSize}
            height={screenHeight * spriteSize}
            options={{ background: "#181425" }}
        >
            {battleTextures &&
                <Container
                    x={0}
                    y={0}
                    eventMode={'static'}
                    sortableChildren={true}
                    pointermove={(e) => input.pointerMove(e.global)}
                >
                    {tiles.map((tile) => {
                        if (tile.sprite) return (
                            <Sprite
                                key={tile.id}
                                texture={battleTextures[tile.sprite]}
                                x={tile.x * spriteSize}
                                y={tile.y * spriteSize}
                                zIndex={tile.z}
                                scale={spriteSize / 32}
                                alpha={tile.alpha}
                            />
                        )
                    })}
                    {entities.map((entity) => {
                        return (
                            <Sprite
                                key={entity.id}
                                eventMode={entity.interactable ? "static" : "none"}
                                pointerdown={() => { input.pointerDown({ id: entity.id })} }
                                pointerover={() => { input.pointerOver({ id: entity.id })} }
                                pointerout={input.pointerOut}
                                texture={battleTextures[entity.sprite]}
                                x={entity.x * spriteSize}
                                y={entity.y * spriteSize}
                                zIndex={entity.z}
                                scale={{x: entity.scale.x * (spriteSize / 32), y: spriteSize / 32}}
                                alpha={entity.alpha}
                                anchor={entity.anchor}
                            />
                        )
                    })}
                    {uiElements.map((element) => {
                        return (<Sprite
                            key={element.id}
                            eventMode={"none"}
                            texture={battleTextures[element.sprite]}
                            x={element.x * spriteSize}
                            y={element.y * spriteSize}
                            zIndex={element.z}
                            scale={{x: element.scale.x * (spriteSize / 32), y: spriteSize / 32}}
                            alpha={element.alpha}
                            anchor={element.anchor}
                        />)
                        
                    })}
                </Container>
            }
        </Stage>
    )
}