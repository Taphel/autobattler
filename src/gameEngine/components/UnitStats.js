// Class imports
import Component from "../Component.js";

export default class UnitStats extends Component {
    #level;
    #baseAttack;
    #baseHp;
    #damage = 0;
    #effects = [];
    #trait;

    constructor(unitData) {
        super();
        const { level, attack, hp, effects, trait } = unitData;
        this.#level = level;
        this.#baseAttack = attack;
        this.#baseHp = hp;
        for (let effect of effects) {
            this.#effects.push(effect);
        }
        this.#trait = trait;
    }

    get hp() {
        return { current: Math.max(this.#baseHp - this.#damage, 0), max: this.#baseHp };
    }

    get attack() {
        return this.#baseAttack;
    }

    update(actionResult) {
        
    }
}