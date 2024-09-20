// Class imports
import Component from "../Component.js";

export default class UnitAI extends Component {
    #actionQueue = []
    constructor() {
        super();
    }

    clearActions() {
        this.#actionQueue = [];
    }

    get actionQueue() {
        return this.#actionQueue;
    }
}