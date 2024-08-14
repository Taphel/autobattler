// Class imports
import Component from "../Component.js";

export default class Camera extends Component {
    #width;
    #height;
    
    constructor(width, height) {
        super();
        this.#width = width;
        this.#height = height;
    }

    get width() {
        return this.#width;
    }

    get height() {
        return this.#height;
    }
}