// Class imports
import Component from "../Component.js";

// data import
import constants from "../../data/constants.js";

export default class UnitStats extends Component {
    #speed;
    #hp;
    #actionValue = 0;

    constructor(speed, hp) {
        super();
        this.#speed = speed;
        this.#hp = { current: hp, max: hp };
    }

    get hp() {
        return this.#hp;
    }

    get actionValue() {
        return this.#actionValue;
    }

    gainActionValue() {
        this.#actionValue += this.#speed;
    }

    act() {
        this.#actionValue -= constants.actionCost;
    }

    update(actionResult) {
        if (actionResult.damage) {
            if (actionResult.damage >= this.#hp.current) {
                this.#hp.current = 0;
                this.#actionValue = 0;
                console.log(this.#hp.current);
                return true;
            } else {
                this.#hp.current -= actionResult.damage;
                console.log(this.#hp.current);
                return false
            }
        }
    }
}