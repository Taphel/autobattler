export default class Component { 
    constructor() {
        if (this.constructor.name === "Component") {
            throw new Error("Component is an abstract class, do not instantiate it");
        }
    }

    update() {

    }
}