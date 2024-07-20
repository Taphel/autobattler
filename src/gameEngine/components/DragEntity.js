// Class imports
import Component from "../Component.js";

export default class DragEntity extends Component {
    #position;
    #scale;
    #speed;
    #frames;

    constructor(speed) {
        super();
        this.#speed = speed;
    }

    get value() {
        return {
            position: this.#position,
            scale: this.#scale,
            speed: this.#speed
        }
    }
}