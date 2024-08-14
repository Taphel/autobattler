// Class imports
import Component from "../Component.js";

export default class AI extends Component {
    #path = null;
    
    constructor() {
        super();
    }

    get path() {
        return this.#path;
    }

    // setting functions
    setPath(path) {
        this.#path = path;
    }

    clearPath() {
        this.#path = null;
    }
}