export default class Action {
    #name
    #range;
    #targetEntityFlag;

    constructor(name, minRange, maxRange, targetEntityFlag) {
        this.#name = name;
        this.#range = { min: minRange, max: maxRange };
        this.#targetEntityFlag = targetEntityFlag;
    }

    get range() {
        return this.#range;
    }

    get targetEntityFlag() {
        return this.#targetEntityFlag;
    }

    get name() {
        return this.#name;
    }

    perform() {

    }
}