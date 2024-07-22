// CSS / React / Pixi
import "./mapDisplay.css";

import { Stage, Container, Sprite } from '@pixi/react';
import { Assets } from 'pixi.js';
import '@pixi/events';

// React & Redux imports
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

// Static data imports
import manifest from "../../data/manifest.js";

export default function MapDisplay({ gameEngine }) {
    const { nodes, paths, cursors, screenWidth, screenHeight, xOffset, yOffset, spriteSize } = useSelector((state) => state.map);
    const [mapTextures, setMapTextures] = useState(null);
    const { input } = gameEngine;

    useEffect(() => {
        const mapBundle = manifest.bundles.find(bundle => bundle.name === "map");
        Assets.addBundle(mapBundle.name, mapBundle.assets)

        const loadTextures = async () => {
            const assets = await Assets.loadBundle(mapBundle.name);
            return assets;
        }

        loadTextures().then(value => setMapTextures(value));
    }, [])

    return (
        <Stage
            x={0}
            y={0}
            width={screenWidth * spriteSize}
            height={screenHeight * spriteSize}
            options={{ background: "#181425"}}
        >
            {mapTextures &&
                <Container
                    x={xOffset * spriteSize}
                    y={yOffset * spriteSize}
                    sortableChildren={true}
                >
                    {nodes.map((node) => {
                        return (
                            <Sprite
                                key={node.id}
                                eventMode={"static"}
                                pointerover={() => input.pointerOver(node.gridPosition)}
                                pointerout={input.pointerOut}
                                pointerdown={() => input.pointerDown(node.gridPosition)}
                                texture={mapTextures[node.sprite]}
                                x={node.x * spriteSize}
                                y={node.y * spriteSize}
                                zIndex={2}
                                scale={spriteSize / 32}
                                alpha={node.alpha} 
                            />
                        )
                    })}
                    {paths.map((path) => {
                        return (
                            <Sprite 
                                key={path.id} 
                                texture={mapTextures[path.sprite]}
                                x={path.x * spriteSize} 
                                y={path.y * spriteSize} 
                                zIndex={1} 
                                scale={spriteSize / 32} 
                                alpha={path.alpha} 
                            />
                        )
                    })}
                    {cursors.map((cursor) => {
                        // console.log(cursor);
                        return (
                                <Sprite 
                                key={cursor.id} 
                                texture={mapTextures[cursor.sprite]} 
                                x={cursor.x * spriteSize} 
                                y={cursor.y * spriteSize} 
                                zIndex={cursor.z} 
                                scale={spriteSize / 32}
                                anchor={cursor.anchor}
                                alpha={cursor.alpha} 
                            />
                        )
                    })}
                </Container>
            }


        </Stage>
    )
}