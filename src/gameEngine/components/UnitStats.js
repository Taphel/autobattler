// Class imports
import Component from "../Component.js";

export default class UnitStats extends Component {
    #baseAttack;
    #baseHp;
    #damage = 0;
    #buffs = [];
    #trait;

    constructor(unitData) {
        super();
        const { attack, hp, buffs, trait } = unitData;
        this.#baseAttack = attack;
        this.#baseHp = hp;
        for (let buff of buffs) {
            this.#buffs.push(buff);
        }
        this.#trait = trait;
    }

    get hp() {
        return this.#baseHp - this.#damage;
    }

    get attack() {
        return this.#baseAttack;
    }



    update(actionResult) {
        
    }
}