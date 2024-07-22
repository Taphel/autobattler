// Class imports
import Component from "../Component.js";

export default class MouseDrag extends Component {
    #targetId = null;
    #position;
    constructor() {
        super();
    }

    setTargetId(id) {
        this.#targetId = id;
    }

    setMousePosition(x, y) {
        this.#position = { x: x, y: y };
    }

    get targetId() {
        return this.#targetId;
    }

    get position() {
        return this.#position;
    }
}