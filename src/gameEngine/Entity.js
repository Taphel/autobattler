export default class Entity {
    #id
    #components = [];

    constructor(id, ...components) {
        this.#id = id;
        components.forEach(component => this.#components.push(component));
    }

    get id() {
        return this.#id
    }

    getComponent(componentClass) {
        return this.#components.find(component => component.constructor.name === componentClass);
    }
}