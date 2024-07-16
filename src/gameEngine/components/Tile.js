// Class imports
import Component from "../Component.js";

export default class Tile extends Component {
    #position;
    #scale;

    constructor(x, y, scaleX, scaleY) {
        this.#position = { x: x, y: y };
        this.#scale = { x: scaleX, y: scaleY };
    }

    get value() {
        return {
            position: this.#position,
            scale: this.#scale
        }
    }
}