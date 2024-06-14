// Class imports
import Component from "../Component.js";
import Skill from "./UnitSkills/Skill.js";

export default class UnitSkills extends Component {
    #attack;
    #skills = [];

    constructor(attack, skills) {
        super();
        const { id, name, tier, level, uses, range, effect, flags } = attack
        this.#attack = new Skill(id, name, tier, level, uses, range, effect, flags)
        skills?.forEach(skill => {
            const { id, name, tier, level, uses, range, effect, flags } = skill;
            this.#skills.push(new Skill(id, name, tier, level, uses, range, effect, flags))
        });
    }

    get attack() {
        return this.#attack;
    }

    get skills() {
        return this.#skills;
    }

    update() {

    }
}