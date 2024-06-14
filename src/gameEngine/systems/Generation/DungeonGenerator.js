
class DungeonRoom {
    x;
    y;
    tiles = [];
    constructor (x, y, roomWidth, roomHeight) {
        this.x = x;
        this.y = y;

        for (let x = 0; x < roomWidth; x++) {
            for (let y = 0; y < roomHeight; y++) {
                if (x === 0 || y === 0 || x === roomWidth - 1 || y === roomHeight - 1) {
                    this.tiles.push(0);
                } else {
                    this.tiles.push(1);
                }
            }
        }
    }
}

export default class DungeonGenerator {

    constructor() {
        throw new Error("DungeonGenerator is an abstract class used for random dungeon generation purposes. Please do not instantiate.");
    }

    static generateDungeon(roomWidth, roomHeight, roomRows, roomCols, tileSize, areaIndex) {
        const grid = new Array(roomWidth * roomCols * roomHeight * roomRows);
        const rooms = new Array(roomRows * roomCols);
        const spawnY = roomRows - 1;
        const spawnX = Math.floor(Math.random() * roomCols);

        for (let roomX = 0; roomX < roomCols; roomX++) {
            for (let roomY = 0; roomY < roomRows; roomY++) {
                rooms.push(new DungeonRoom(roomX, roomY, roomWidth, roomHeight));
            }
        }

        rooms.forEach(room => {
            const {x, y, tiles} = room;
            tiles.forEach((tile, index) => {
                // index = x + y * width
                const tileX = index % roomWidth;
                const tileY = (index - tileX) / roomWidth;
            })
        })
        

    }
}