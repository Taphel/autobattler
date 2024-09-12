// CSS / React / Pixi
import "./battleScreen.css";

import { Stage, Container, Sprite, Text, BitmapText } from '@pixi/react';
import { Rectangle, Assets, TextStyle, BitmapFont, SCALE_MODES } from 'pixi.js';
import '@pixi/events';

// React & Redux imports
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

// Static data imports
import manifest from "../../data/manifest.js";

export default function BattleScreen({ gameEngine }) {
    const { tiles, entities, uiElements, unitOverlays, screenWidth, screenHeight, spriteSize, displayUI } = useSelector((state) => state.battle);
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

        BitmapFont.from('OverlayFont', new TextStyle({
            fontFamily: 'Arial',
            fontSize: 32,
            stroke: '#000000',
            strokeThickness: 4,
            fill: '#ffffff',
            wordWrap: true,
        }), { scaleMode: SCALE_MODES.NEAREST, chars: [...BitmapFont.ALPHANUMERIC, '^', '?', 'é'] })
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
                                eventMode={displayUI ? "static" : "none"}
                                pointerdown={() => { input.pointerDown({ id: entity.id }) }}
                                pointerover={() => { input.pointerOver({ id: entity.id }) }}
                                pointerout={input.pointerOut}
                                texture={battleTextures[entity.sprite]}
                                x={entity.x * spriteSize}
                                y={entity.y * spriteSize}
                                zIndex={entity.z}
                                scale={{ x: entity.scale.x * (spriteSize / 32), y: spriteSize / 32 }}
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
                            scale={{ x: element.scale.x * (spriteSize / 32), y: spriteSize / 32 }}
                            alpha={element.alpha}
                            anchor={element.anchor}
                        />)

                    })}
                    {unitOverlays.map((overlay) => {
                        return (<Container
                            key={overlay.id}
                            x={overlay.x * spriteSize}
                            y={overlay.y * spriteSize}
                            zIndex={overlay.z}
                            anchor={overlay.anchor}
                            sortableChildren={true}
                            eventMode={"none"}
                        >
                            <Sprite
                                texture={battleTextures['statoverlay']}
                                x={0}
                                y={0}
                                zIndex={overlay.z}
                                anchor={0}
                                scale={{ x: spriteSize / 32, y: spriteSize / 32 }}
                                alpha={1}
                            />
                            <Sprite
                                texture={battleTextures['health']}
                                x={spriteSize / 32 * 2}
                                y={spriteSize / 32 * 3}
                                zIndex={overlay.z - 1}
                                anchor={0}
                                scale={{ x: spriteSize / 32 * overlay.health, y: spriteSize / 32 }}
                                alpha={1}
                            />
                            <Sprite
                                texture={battleTextures['mana']}
                                x={spriteSize / 32 * 4}
                                y={spriteSize / 32 * 7}
                                zIndex={5}
                                anchor={0}
                                scale={{ x: spriteSize / 32 * overlay.mana, y: spriteSize / 32 }}
                                alpha={1}
                            />
                        </Container>)
                    })}

                    { displayUI && 
                        <Container
                        x={spriteSize * 13}
                        y={spriteSize * 5}
                        zIndex={5}
                        sortableChildren={true}
                        eventMode={"static"}
                        pointerdown={() => input.combatStart()}
                        >
                            <Sprite
                                texture={battleTextures['startbutton']}
                                x={0}
                                y={0}
                                zIndex={5}
                                anchor={0}
                                scale={{ x: spriteSize / 32, y: spriteSize / 32 }}
                                alpha={1}
                            />
                            <BitmapText
                                text="FIGHT"
                                x={spriteSize}
                                y={spriteSize / 32 * 14}
                                zIndex={6}
                                anchor={0.5}
                                scale={spriteSize / 64}
                                style={{
                                    fontName: 'OverlayFont',
                                    letterSpacing: 2
                                }}
                            />
                        </Container>
                    }
                    
                    <Container
                        x={spriteSize / 2}
                        y={spriteSize * (screenHeight - 2.5)}
                        zIndex={5}
                        sortableChildren={true}
                        eventMode={"static"}
                    >
                        <Sprite
                            texture={battleTextures['menuwindow']}
                            x={0}
                            y={0}
                            zIndex={5}
                            anchor={0}
                            scale={{ x: spriteSize / 32, y: spriteSize / 32 }}
                            alpha={1}
                        />
                        <BitmapText
                            text="Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test "
                            x={spriteSize / 4}
                            y={spriteSize / 4}
                            width={spriteSize * 15}
                            height={spriteSize * 4}
                            zIndex={6}
                            anchor={0}
                            scale={spriteSize / 64}
                            style={{
                                fontName: 'OverlayFont',
                                letterSpacing: 2,
                                maxWidth: 960
                            }}
                        />
                    </Container>
                </Container>
            }
        </Stage>
    )
}