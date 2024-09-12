// Class imports
import Component from "../Component.js";

export default class UnitSkill extends Component {
    #mana;
    constructor(unitData) {
        super();
        const { cost } = unitData
        this.#mana = { current: cost, max: cost };
    }

    get mana() {
        return this.#mana;
    }

    update(actionResult) {
        
    }
}