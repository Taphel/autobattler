// Class imports
import Component from "../Component.js";

export default class UnitOverlay extends Component {
    #targetId = null;

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