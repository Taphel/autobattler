// CSS / React / Pixi
import "./mapDisplay.css";

import { Stage, Container, Sprite } from '@pixi/react';
import '@pixi/events';


// React & Redux imports
import { useSelector } from "react-redux";

// Static data imports

export default function MapDisplay({ gameEngine }) {
    const { nodes, paths, cursors, screenWidth, screenHeight, xOffset, yOffset, spriteSize } = useSelector((state) => state.map);
    const { input } = gameEngine;

    return (
        <Stage x={0} y={0} width={screenWidth * spriteSize} height={screenHeight * spriteSize} options={{ background: "#181425" }}>
            <Container x={xOffset * spriteSize} y={yOffset * spriteSize} sortableChildren={true}>
                {nodes.map((node) => {
                    return (
                        <Sprite key={node.id} eventMode={"static"} pointerover={() => input.pointerOver(node.gridPosition)} pointerout={input.pointerOut} pointerdown={() => input.pointerDown(node.gridPosition)} image={node.sprite} x={node.x} y={node.y} zIndex={2} scale={1} alpha={node.alpha} />
                    )
                })}
                {paths.map((path) => {
                    return (
                        <Sprite key={path.id} image={path.sprite} x={path.x} y={path.y} zIndex={1} scale={1} alpha={path.alpha}/>
                    )
                })}
                {cursors.map((cursor) => {
                    // console.log(cursor);
                    return (
                        <Sprite key={cursor.id} image={cursor.sprite} x={cursor.x} y={cursor.y} zIndex={cursor.z} scale={1} alpha={cursor.alpha} />
                    )
                })}
            </Container>
        </Stage>
    )
}