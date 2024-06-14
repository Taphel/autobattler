export default class CellularAutomata {

    constructor() {
        throw new Error("Cellular Automata is an abstract class used for random dungeon generation purposes. Please do not instantiate.");
    }

    static generateGrid(width, height, iterations, wallRate) {
        let floorPercent = 0;
        let grid;
        
        while (floorPercent < 0.4) {
            const gridTemplate = Array(width * height).fill(false);
            grid = this.#seedGrid(gridTemplate, width, height, wallRate);


            for (let i = 0; i < iterations; i++) {
                grid = this.#automataStep(grid, width, height);
            }

            // Cleanup with flood
            grid = this.#floodArea(grid, width, height);

            floorPercent = grid.filter(tile => tile === false).length / (width * height);
            console.log("FLOOR PERCENT :", floorPercent);
        }
        

        return grid;
    }

    static #seedGrid(grid, width, height, wallRate) {

        const emptyColumn = Math.floor(Math.random() * ((width - 4) - 4)) + 4; // Leave a column with 4 <= x < (width - 4 ) empty
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (x === 0 || y === 0 || x === width - 1 || y === height - 1) {
                    grid[x + y * width] = true;
                } else if (x != emptyColumn && Math.random() < wallRate) {
                    grid[x + y * width] = true;
                }
            }
        }

        return grid;
    }

    static #automataStep(grid, width, height) {
        let newGrid = Array(width * height).fill(false);

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (x === 0 || y === 0 || x === width - 1 || y === height - 1) {
                    newGrid[x + y * width] = true;
                } else {
                    newGrid[x + y * width] = this.#neighborLogic(grid, width, height, x, y);
                }
            }
        }

        return newGrid;
    }

    static #neighborLogic(grid, width, height, x, y) {
        return  this.#countAdjacentWalls(grid, width, x, y) >= 5 ||
                this.#countNearbyWalls(grid, width, height, x, y) <= 2;
    }

    static #countAdjacentWalls(grid, width, x, y) {
        // Count walls around the 9x9 area centered on the tile at (x;y)
        let walls = 0;

        for (let gridX = x - 1; gridX <= x + 1; gridX++) {
            for (let gridY = y - 1; gridY <= y + 1; gridY++) {
                if (grid[gridX + gridY * width]) walls++;
            }
        }

        return walls;

    }

    static #countNearbyWalls(grid, width, height, x, y) {
        // Count walls that are within 3 steps of the tile at (x; y);
        let walls = 0;

        for (let gridX = x - 2; gridX <= x + 2; gridX++) {
            for (let gridY = y - 2; gridY <= y + 2; gridY++) {
                if (Math.abs(gridX - x) == 2 && Math.abs(gridY - y) == 2) continue;
                if (gridX < 0 || gridY < 0 || gridX >= width || gridY >= height) continue;

                if (grid[gridX + gridY * width]) walls++
            }
        }

        return walls;
    }

    static #floodArea(grid, width, height) {
        const floodedTiles = [];
        let tilesToFlood = [];

        const floorTiles = this.#getFloorTiles(grid);
        const startTileIndex = floorTiles[Math.floor(Math.random() * floorTiles.length)];

        tilesToFlood.push(startTileIndex);

        
        while (tilesToFlood.length > 0) {
            const nextTilesToFlood = [];
            tilesToFlood.forEach((tile) => {
                // Calculate the coordinates from the list's first tile's index
                const x = tile % width;
                const y = Math.floor(tile / width);

                // Add the tile to the flooded tiles list and remove it from the "to flood" list
                floodedTiles.push(tile);

                // Add the tile's adjacent floor tiles to the "to flood" list
                const adjacentTiles = this.#getAdjacentTiles(floorTiles, floodedTiles, width, x, y)
                adjacentTiles.forEach((adjacentTile) => {
                    if (!nextTilesToFlood.includes(adjacentTile)) {
                        nextTilesToFlood.push(adjacentTile);
                    }
                });
                })
            
                tilesToFlood = nextTilesToFlood;
        }

        // Fill the tiles outside the flooded area with walls
        let newGrid = Array(width * height).fill(false);

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (grid[x + y * width] === true) {
                    newGrid[x + y * width] = true;
                } else {
                    if (!floodedTiles.find((index) => index === x + y * width)) {
                        newGrid[x + y * width] = true;
                    } 
                }
            }
        }
        return newGrid;    
    }

    static #getFloorTiles(grid) {
        const floorTileList = grid.map((tile, index) => {
            return {
                isWall: tile,
                index: index
            }
        })
        .filter((tile) => tile.isWall === false)
        .map((tile) => tile.index);

        return floorTileList;
    }

    static #getAdjacentTiles(floorTiles, floodedTiles, width, x, y) {
        const adjacentTiles = [];
    
        for (let gridX = x - 1; gridX <= x + 1; gridX++) {
            for (let gridY = y - 1; gridY <= y + 1; gridY++) {
                // Get the tile index
                const tileIndex = gridX + gridY * width;
    
                if (floorTiles.includes(tileIndex) && !floodedTiles.includes(tileIndex)) {
                    adjacentTiles.push(tileIndex);
                }
            }
        }
    
        return adjacentTiles;
    }
}