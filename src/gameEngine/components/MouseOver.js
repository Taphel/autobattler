// Class imports
import Component from "../Component.js";

export default class MouseOver extends Component {
    #targetId;

    constructor() {
        super();
    }

    setTargetId(id) {
        this.#targetId = id;
    }

    get targetId() {
        return this.#targetId;
    }
}