// Class imports
import Component from "../Component.js";

export default class UnitSkill extends Component {
    #cost;
    constructor(unitData) {
        super();
        const { cost } = unitData
        this.#cost = cost;
    }

    get cost() {
        return this.#cost;
    }

    update(actionResult) {
        
    }
}