// Class imports
import { current } from "@reduxjs/toolkit";
import { RoomType } from "../../../data/enums.js";

// Libraries import
import shuffleArray from "../../../libraries/shuffleArray.js";

class DungeonRoom {
    #x;
    #y;
    #type = RoomType.empty;
    #parents = [];
    #children = [];

    constructor(x, y) {
        this.#x = x;
        this.#y = y;
    }

    get position() {
        return { x: this.#x, y: this.#y }
    }

    setRoomType(roomType) {
        this.#type = roomType;
    }

    get type() {
        return this.#type;
    }

    get parents() {
        return this.#parents;
    }

    addParent(node) {
        if (!this.#parents.find(parent => node.position.x === parent.position.x && node.position.y === parent.position.y)) {
            this.#parents.push(node);
        }
    }

    get children() {
        return this.#children;
    }

    addChild(node) {
        // Prevent duplicates
        if (!this.#children.find(child => node.position.x === child.position.x && node.position.y === child.position.y)) {
            this.#children.push(node);
        }
    }
}

export default class DungeonLevel {
    #tier;
    #currentRoom;
    #floors;
    #floorWidth;
    #rooms;



    constructor(floors, floorWidth, pathCount, tier = 1) {
        this.#floors = floors;
        this.#floorWidth = floorWidth;
        this.#tier = tier;

        // Create the map of room nodes, filled with empty nodes;
        this.#rooms = new Array(floors * floorWidth);
        for (let x = 0; x < floorWidth; x++) {
            for (let y = 0; y < floors; y++) {
                this.#rooms[x + y * floorWidth] = new DungeonRoom(x, y);
            }
        }

        // Create node paths;
        const paths = new Array(pathCount);
        for (let i = 0; i < pathCount; i++) {
            paths[i] = [];
            // Choose a random node on the first floor;
            let firstNodeX = Math.floor(floorWidth / 2);
            while (this.#rooms[firstNodeX].children.length > 0) {
                firstNodeX = Math.floor(Math.random() * floorWidth);
            }
            paths[i][0] = this.#rooms[firstNodeX];
            // Start connecting paths on next floors
            for (let y = 0; y < floors - 1; y++) {
                const { x } = paths[i][y].position;
                if (y !== 0 && y !== floors - 2) {
                    let minNodeX = Math.max(0, x - 1);
                    let maxNodeX = Math.min(floorWidth - 1, x + 1)
                    if (i > 0) {
                        // Check if the node on top of current node has parents
                        const topNodeParents = this.#rooms[x + (y + 1) * floorWidth].parents;
                        if (topNodeParents.length > 0) {
                            // Look for coordinates of parents
                            topNodeParents.forEach(parent => {
                                if (parent.position.x === x - 1) minNodeX = x;
                                if (parent.position.x === x + 1) maxNodeX = x;
                            })
                        }
                    }

                    // Roll for the child node X
                    const nodeX = Math.round(Math.random() * (maxNodeX - minNodeX)) + minNodeX;
                    // Update child / parent reference
                    const nextPathRoom = this.#rooms[nodeX + (y + 1) * floorWidth];
                    const parentRoom = this.#rooms[x + y * floorWidth];

                    nextPathRoom.addParent(parentRoom);
                    parentRoom.addChild(nextPathRoom);
                    paths[i][y + 1] = nextPathRoom;

                } else {
                    const nextPathRoom = this.#rooms[x + (y + 1) * floorWidth];
                    const parentRoom = this.#rooms[x + y * floorWidth];

                    nextPathRoom.addParent(parentRoom);
                    parentRoom.addChild(nextPathRoom);
                    paths[i][y + 1] = nextPathRoom;
                }
            }
        }

        // Set up node types
        const roomsToRandomize = []
        this.#rooms.forEach((room, index) => {
            if (room.parents.length > 0 || room.children.length > 0) {
                if (room.position.y === 0) {
                    room.setRoomType(RoomType.combat)
                } else if (room.position.y === 4) {
                    room.setRoomType(RoomType.treasure);
                } else if (room.position.y === floors - 1) {
                    room.setRoomType(RoomType.boss);
                } else {
                    // Register the room index to the randomized pool
                    roomsToRandomize.push(index);
                }
            }
        })
            // Loop through the unassigned rooms and give them one at random
            for (let i = 0; i < roomsToRandomize.length; i++) {
                const targetRoom = this.#rooms[roomsToRandomize[i]];
                let chosenRoomType = this.#rollRoomType();

                // Prevent elites from spawning before floor 6, and altars / shops before room 3
                const bannedRoomTypes = []
                if (targetRoom.position.y < 3) bannedRoomTypes.push(RoomType.altar, RoomType.shop);
                if (targetRoom.position.y < 5) bannedRoomTypes.push(RoomType.elite);
                
                // Prevent consecutive non-combat room types and same room type among siblings
                targetRoom.parents.forEach(parent => {
                    if (parent.type !== RoomType.combat && parent.type !== RoomType.empty && parent.type !== RoomType.event) bannedRoomTypes.push(parent.type);
                    parent.children.forEach(child => bannedRoomTypes.push(child.type))
                })

                let validRoomType = false;
                while (!validRoomType) {
                    let roomTypeMatch = 0;
                    for (let i = 0; i < bannedRoomTypes.length; i++) {
                        if (chosenRoomType === bannedRoomTypes[i]) roomTypeMatch++;
                    }
                    if (roomTypeMatch) {
                        chosenRoomType = this.#rollRoomType();
                    } else {
                        validRoomType = true;
                    }
                }

                targetRoom.setRoomType(chosenRoomType);
            }
    }

    #rollRoomType() {
        const eventOdds = 0.15;
        const shopOdds = 0.1;
        const altarOdds = 0.1;
        const treasureOdds = 0.05;

        const eliteRoll = 0.15;
        const eventRoll = eliteRoll + eventOdds;
        const shopRoll = eventRoll + shopOdds;
        const altarRoll = shopRoll + altarOdds;
        const treasureRoll = altarRoll + treasureOdds;

        const roomTypeRoll = Math.random();
        if (roomTypeRoll < treasureRoll) {
            if (roomTypeRoll < altarRoll) {
                if (roomTypeRoll < shopRoll) {
                    if (roomTypeRoll < eventRoll) {
                        if (roomTypeRoll < eliteRoll) {
                            return RoomType.elite;
                        } else return RoomType.event;
                    } else return RoomType.shop;
                } else return RoomType.altar
            } else return RoomType.treasure;
        } else return RoomType.combat;
    }

    get rooms() {
        return this.#rooms;
    }

    get floors() {
        return this.#floors;
    }

    get floorWidth() {
        return this.#floorWidth;
    }

    get currentRoom() {
        return this.#currentRoom;
    }

    get tier() {
        return this.#tier;
    }

    setCurrentRoom(position) {
        const { x, y } = position;
        this.#currentRoom = this.#rooms[x + y * this.floorWidth];
    }
}