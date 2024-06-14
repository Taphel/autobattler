/// Classes
import System from "../System.js";
import CellularAutomata from "./Physics/CellularAutomata.js";
import Tile from "./Physics/Tile.js";

import Entity from "../Entity.js";

/// Components
import EntityFlags from "../components/EntityFlags.js";
import UnitStats from "../components/UnitStats.js";
import UnitSkills from "../components/UnitSkills.js";
import PlayerSkills from "../components/PlayerSkills.js";
import Transform from "../components/Transform.js";
import Vision from "../components/Vision.js";
import AI from "../components/AI.js";
import Animation from "../components/Animation.js";

/// Other files
// enums
import { TileType, EntityFlag } from "../../data/enums.js";

// data
import constants from "../../data/constants.js";
import skillData from "../../data/skillData.js";

// libraries
import shuffleArray from "../../libraries/shuffleArray.js";

class DungeonLevel {
    #grid;
    #width;
    #height;
    #tileset;

    constructor(width, height, iterations, wallRate, tileset) {
        // const booleanGrid = CellularAutomata.generateGrid(width, height, iterations, wallRate);
        const booleanGrid=[]
        for(let gridY = 0; gridY < width; gridY++) {
            for(let gridX = 0; gridX < width; gridX++) {
                if (gridX === 0 || gridX === width - 1 || gridY === 0 || gridY === height - 1) {
                    booleanGrid.push(true);
                } else {
                    booleanGrid.push(false);
                }
            }
        }
        this.#grid = booleanGrid.map((isWall, index) => {
            const x = index % width;
            const y = Math.floor(index / width);

            if (isWall) {
                return new Tile(`TILE_(${x};${y})`, x, y, TileType.wall);
            } else {
                return new Tile(`TILE_(${x};${y})`, x, y, TileType.floor);
            }
        })

        this.#width = width;
        this.#height = height;
        this.#tileset = tileset;
    }

    get grid() {
        return this.#grid;
    }

    get width() {
        return this.#width;
    }

    get height() {
        return this.#height;
    }

    get tileset() {
        return this.#tileset;
    }

    get floorTiles() {
        return this.#grid.filter(tile => tile.type === TileType.floor);
    }

    findTile(x, y) {
        return this.#grid.find(tile => tile.position.x === x && tile.position.y === y);
    }
}


export default class GenerationSystem extends System {

    constructor() {
        super();
    }

    generateLevel(width, height, iterations, wallRate, tileset) {
        return new DungeonLevel(width, height, iterations, wallRate, tileset);
    }
    
    generateLevelContent(dungeonLevel, entities, components) {
    }

    #sliceLevel(dungeonLevel) {
        const levelSlices = [];
        for (let sliceX = 0; sliceX < dungeonLevel.width / constants.sliceWidth; sliceX++) {
            for (let sliceY = 0; sliceY < dungeonLevel.height / constants.sliceHeight; sliceY++) {

                const slice = {
                    x: sliceX,
                    y: sliceY,
                    tiles: []
                };

                for (let x = sliceX * constants.sliceWidth; x < sliceX * constants.sliceWidth + constants.sliceWidth; x++) {
                    for (let y = sliceY * constants.sliceWidth; y < sliceY * constants.sliceHeight + constants.sliceHeight; y++) {
                        const tile = dungeonLevel.findTile(x, y);
                        if (tile.type === TileType.floor) {
                            slice.tiles.push(tile.position);
                        }
                    }
                }

                // Shuffle tiles in the slice and push it
                // slice.tiles = shuffleArray(slice.tiles);
                if (slice.tiles.length > 0) levelSlices.push(slice);
            } 
        }
        return levelSlices;
    }
}