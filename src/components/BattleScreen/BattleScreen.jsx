// CSS / React / Pixi
import "./battleScreen.css";

import { Stage, Container, Sprite } from '@pixi/react';
import { Rectangle, Point } from 'pixi.js';
import '@pixi/events';


// React & Redux imports
import { useSelector } from "react-redux";

// Static data imports

export default function BattleScreen({ gameEngine }) {
    const { tiles, entities, screenWidth, screenHeight, xOffset, yOffset, spriteSize } = useSelector((state) => state.battle);
    const { input } = gameEngine;

    return (
        <Stage x={0} y={0} width={screenWidth * spriteSize} height={screenHeight * spriteSize}  options={{ background: "#181425" }}>
            <Container x={0} y={0} sortableChildren={true} eventMode={'static'} hitArea={ new Rectangle(0, 0, screenWidth * spriteSize, screenHeight * spriteSize) } pointermove={(e) => input.pointerMove(e.global)}>
                {tiles.map((tile) => {
                    if (tile.sprite) return (
                        <Sprite key={tile.id} image={tile.sprite} x={tile.x} y={tile.y} zIndex={2} scale={1} alpha={tile.alpha} />
                    )
                })}
                {entities.map((entity) => {
                    return (
                        <Sprite key={entity.id} eventMode={entity.interactable ? "static" : "none"} pointerdown={() => {input.pointerDown({id: entity.id})}} pointerover={() => input.pointerOver({id: entity.id})} pointerout={input.pointerOut} image={entity.sprite} x={entity.x} y={entity.y} zIndex={entity.z} scale={entity.scale} alpha={entity.alpha} anchor={entity.anchor} />
                    )
                })}
            </Container>
        </Stage>
    )
}