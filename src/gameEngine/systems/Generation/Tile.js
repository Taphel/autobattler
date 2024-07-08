// Class imports
import { TileType } from "../../../data/enums.js";

export default class Tile {
    #id;
    #position
    #type;
    #entity = null;
    #isExplored = false;


    #sprite;

    constructor(id, x, y, type) {
        this.#id = id;
        this.#position = {x: x, y: y};
        this.#type = type;
    }

    get id() {
        return this.#id;
    }

    get position() {
        return this.#position;
    }

    get type() {
        return this.#type;
    }

    get entity() {
        return this.#entity
    }

    get isExplored() {
        return this.#isExplored;
    }

    get sprite() {
        return this.#sprite;
    }

    setEntity(entityId) {
        this.#entity = entityId;
    }

    explore() {
        this.#isExplored = true;
    }

    setSprite(sprite) {
        this.#sprite = sprite;
    }

}