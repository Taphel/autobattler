// Class imports
import Component from "../Component.js";

// data import
import { AbilityTarget, AbilityCost, AbilityEffect } from "../../data/enums.js";

class Ability {
    #cost;
    #target;
    #hits;
    #effect;
    #casts = 0

    constructor(ability) {
        const { cost, target, hits, effect } = ability;
        this.#cost = { type: cost.type, base: cost.max, max: cost.max, current: 0 };
        this.#target = target;
        this.#hits = hits;
        this.#effect = effect;
    }

    perform() {

    }
}

export default class Unit extends Component {
    #id;
    #name;
    #sprite;
    #tier;
    #attack;
    #hp;
    #effects;
    #ability;
    #level = 1;

    constructor(unitData, level) {
        super();
        const { id, name, sprite, tier, attack, hp, effects, ability } = unitData;
        this.#id = id;
        this.#name = name;
        this.#sprite = sprite;
        this.#tier = tier,
        this.#attack = { base: attack, current: attack, battle: attack };
        this.#hp = { base: hp, current: 0, battle: 0, damage: 0 };
        this.#effects = { base: effects, current: [], battle: [] };
        this.#ability = new Ability(ability);
        this.#level = level;
    }

    update(actionResult) {
        
    }

    get tier() {
        return this.#tier;
    }

    get sprite() {
        return this.#sprite;
    }
}