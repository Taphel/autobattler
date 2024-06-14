// Class imports
import { TileType } from "../../../data/enums.js";

// Math functions

class Quadrant {
    static north = 0;
    static east = 1;
    static south = 2;
    static west = 3;

    cardinal;
    originX;
    originY;

    constructor(cardinal, origin) {
        this.cardinal = cardinal;
        this.originX = origin.x;
        this.originY = origin.y;
    }

    transform(tile) {
        const { rowDepth, col } = tile;
        switch (this.cardinal) {
            case Quadrant.north:
                return { x: this.originX + col, y: this.originY - rowDepth };
            case Quadrant.south:
                return { x: this.originX + col, y: this.originY + rowDepth };
            case Quadrant.east:
                return { x: this.originX + rowDepth, y: this.originY + col };
            case Quadrant.west:
                return { x: this.originX - rowDepth, y: this.originY + col };
        }
    }
}

class Row {
    depth;
    startSlope;
    endSlope;

    constructor(depth, startSlope, endSlope) {
        this.depth = depth;
        this.startSlope = startSlope;
        this.endSlope = endSlope;
    }

    get tiles() {
        const minCol = Row.roundTiesUp(this.depth * this.startSlope);
        const maxCol = Row.roundTiesDown(this.depth * this.endSlope);

        const tiles = []

        for (let col = minCol; col < maxCol + 1; col++) {
            tiles.push({rowDepth: this.depth, col: col})
        }

        return tiles;
    } 

    get next() {
        return new Row(this.depth + 1, this.startSlope, this.endSlope);
    }

    static roundTiesUp(n) {
        return Math.floor(n + 0.5)
    }
    
    
    static roundTiesDown(n) {
        return Math.ceil(n - 0.5)
    }
}

export default class FieldOfView {
    static scan(origin, grid, range) {
        const visibleTiles = [origin];

        for (let i = 0; i < 4; i++) {
            const quadrant = new Quadrant(i, origin);

            function isWall(tile) {
                if (!tile) {
                    return false;
                }
                const { x, y } = quadrant.transform(tile);
                const matchingTile = grid.find(tile => tile.position.x === x && tile.position.y === y);
                if (matchingTile) {
                    return matchingTile.type !== TileType.floor;
                } else {
                    return false;
                }
            }

            function isFloor(tile) {
                if (!tile) {
                    return false;
                }
                const { x, y } = quadrant.transform(tile);
                const matchingTile = grid.find(tile => tile.position.x === x && tile.position.y === y);
                if (matchingTile) {
                    return matchingTile.type === TileType.floor;
                } else {
                    return false;
                }
            }

            function slope(tile) {
                const { rowDepth, col } = tile;
                return ((2 * col - 1) / (2 * rowDepth));
            }
            
            function isSymmetric(row, tile) {
                const { rowDepth, col } = tile;
                return (col >= (rowDepth * row.startSlope) && col <= (rowDepth * row.endSlope))
            }

            const firstRow = new Row(1, -1, 1);
            const rows = [firstRow];
            let row;
                while (rows.length > 0) {
                    row = rows.pop();
                    let previousTile = null;

                    row.tiles.forEach(tile => {
                        if (tile.rowDepth + Math.abs(tile.col) <= range && tile.rowDepth < range) {
                            if (isWall(tile) || isSymmetric(row, tile)) {
                                visibleTiles.push(quadrant.transform(tile));
                            }

                            if (isWall(previousTile) && isFloor(tile)) {
                                row.startSlope = slope(tile);
                            }

                            if (isFloor(previousTile) && isWall(tile)) {
                                const nextRow = row.next;
                                nextRow.endSlope = slope(tile);
                                rows.push(nextRow);
                            }
                            previousTile = tile;
                        }
                    })
                    if (isFloor(previousTile)) {
                        rows.push(row.next);
                    }
                }
        }
        return visibleTiles;
    } 
}