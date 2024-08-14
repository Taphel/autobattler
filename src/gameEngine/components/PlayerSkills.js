// Class imports
import UnitSkills from "./UnitSkills.js";
import Skill from "./UnitSkills/Skill.js";

export default class PlayerSkills extends UnitSkills {
    #deck = [];

    constructor(attack, skills) {
        super(attack, skills);
        skills?.forEach(skill => {
            const { id, name, tier, level, uses, range, effect, flags } = skill;
            this.#deck.push(new Skill(id, name, tier, level, uses, range, effect, flags))
        });
    }

    get nextSkill() {
        return this.#deck[0];
    }

    update() {

    }
}