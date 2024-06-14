// Class imports
import Component from "../Component.js";

export default class Vision extends Component {
    #fieldOfView
    #visionRange
    
    constructor(visionRange) {
        super();
        this.#visionRange = visionRange;
    }

    get fieldOfView() {
        return this.#fieldOfView;    
    }

    get visionRange() {
        return this.#visionRange;
    }

    update(fieldOfView) {
        this.#fieldOfView = fieldOfView;
    }
}