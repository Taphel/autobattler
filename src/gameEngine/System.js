export default class System { 
    constructor() {
        if (this.constructor.name === "System") {
            throw new Error("System is an abstract class, do not instantiate it");
        }
    }

    update() {

    }
}