// Class imports
import Component from "../Component.js";

export default class EntityFlags extends Component {
    #flags = [];
    
    constructor(...flags) {
        super();
        flags.forEach(flag => this.#flags.push(flag));
    }

    hasFlag(flag) {
        return this.#flags.includes(flag);
    }
}