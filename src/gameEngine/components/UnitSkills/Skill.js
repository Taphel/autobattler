export default class Skill {
    // Identification & UI
    #id;
    #name;
    // Game data
    #tier;
    #level;
    #uses;
    #range;
    #effect;
    #flags = [];
    

    constructor(id, name, tier, level, uses, range, effect, flags) {
        this.#id = id;
        this.#name = name;

        this.#tier = tier;
        this.#level = level;
        this.#uses = uses;
        this.#range = range;
        this.#effect = effect;
        flags.forEach(flag => this.#flags.push(flag));
    }

    hasFlag(flag) {
        return this.#flags.includes(flag);
    }

    get range() {
        return this.#range;
    }

    perform() {
        const level = this.#level;
        const targetResults = [];
        const userResults = [];

        if (this.#effect.target) {
            const target = this.#effect.target
            if (target.animation) {
                targetResults.push({animation: target.animation});
            }
            if (target.hits) {
                // Calculate number of hits of the skill then iterate effect for each hit
                for (let i = 0; i < target.hits.base + Math.floor(target.hits.scaling * level); i++) {
                    if (target.damage) {
                        const damage = target.damage.base + Math.floor(target.damage.scaling * level);
                        targetResults.push({damage: damage});
                    }
                }
            }
        }

        return {
            target: targetResults,
            user: userResults
        }
    } 
}