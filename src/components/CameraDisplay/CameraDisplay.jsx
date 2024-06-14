// CSS / React / Pixi
import "./cameraDisplay.css";

import "@pixi/events";
import { Stage, Container, Sprite } from '@pixi/react';
import { Assets, Rectangle, Texture } from 'pixi.js';


// React & Redux imports
import { useSelector } from "react-redux";
import { useState, useEffect } from 'react';

// Static data imports

export default function CameraDisplay(gameEngine) {
    const { tiles, entities, cameraWidth, cameraHeight } = useSelector((state) => state.camera);
    const [tileTexture, setTileTexture] = useState(null);
    const [tileSprites, setTileSprites] = useState(null);

    useEffect(() => {
        const fetchTexture = async () => {
            let texture
            try {
                texture = await Assets.load({
                    src: `/sprites/tilesets/tilemap.png`,
                    data: { scaleMode: 'nearest' }
                });
                return texture
            } catch (e) {
                console.log(e);
            }
            
        }

        fetchTexture()
        .then((fetchedTexture) => {
            console.log(fetchedTexture);
            setTileTexture(new Texture(fetchedTexture));
        })
        .catch(e => {
            console.log(e);
        });
    }, [])

    // useEffect(() => {
    //     if (tileTexture) {
    //         const columns = Math.floor(tileTexture.width / 16);
    //     const rows = Math.floor(tileTexture.height / 16);

    //     const tiles = [];
    //     let tileIndex = 0;

    //     for (let i = 0; i < columns; i++) {
    //         for (let j = 0; j < rows; j++) {
    //             tiles[tileIndex] = new Texture({
    //                 source: tileTexture.source,
    //                 frame: new Rectangle(i * 16, j * 16, 16, 16)
    //             });
    //             tileIndex++;
    //         }
    //     }

    //     setTileSprites(tiles);
    //     }
        
    // }, [tileTexture])

    return (
        
        <Stage x={0} y={0} width={cameraWidth * 16} height={cameraHeight * 16} options={{ background: "#140c1c" }}>
            <Container x={0} y={0} sortableChildren={true}>
                {tileTexture && tiles.map((tile) => {
                    return (
                        <Container eventMode={"dynamic"} key={tile.id}>
                            <Sprite image={tile.sprite} x={tile.x} y={tile.y} zIndex={0} scale={1} />
                        </Container>
                    )
                })}
            </Container>
            <Container x={0} y={0} sortableChildren={true}>
                {entities.map((entity) => {
                    if (entity.display) {
                        console.log(entity);
                        return (
                            <Sprite image={entity.sprites[entities.currentFrame]} x={entity.x} y={entity.y} zIndex={entity.z} key={entity.id} scale={1} />
                        )
                    }
                })}
            </Container>
        </Stage>
    )
}