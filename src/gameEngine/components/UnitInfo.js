// Class imports
import Component from "../Component.js";

export default class UnitInfo extends Component {
    #id;
    #name;
    #sprite;
    #tier;

    constructor(unitData) {
        super();
        const { id, name, sprite, tier} = unitData;
        this.#id = id;
        this.#name = name;
        this.#sprite = sprite;
        this.#tier = tier
    }

    update(actionResult) {
        
    }

    get id() {
        return this.#id;
    }

    get name() {
        return this.#name;
    }

    get sprite() {
        return this.#sprite;
    }

    get tier() {
        return this.#tier;
    }
}