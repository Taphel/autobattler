// Class imports
import Component from "../Component.js";

export default class Tile extends Component {
    #position;
    #scale;
    #speed;
    #index;

    constructor(x, y, z, scaleX, scaleY, speed, index) {
        super();
        this.#position = { x: x, y: y, z: z };
        this.#scale = { x: scaleX, y: scaleY };
        this.#speed = speed;
        this.#index = index;
    }

    get value() {
        return {
            position: this.#position,
            scale: this.#scale,
            speed: this.#speed,
            index: this.#index
        }
    }
}