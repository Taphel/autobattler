// Class imports
import System from "../System.js";

// data imports
import { UnitFaction } from "../../data/enums.js";

export default class InputSystem extends System { 
    #pointerOverTarget = null;
    #pointerDownTarget = null;
    #pointerPosition;
    #pointerUp = false;
    pointerOut
    
    constructor () {
        super();
        this.pointerOut = () => {
            this.#pointerOverTarget = null;
            console.log("POINTEROUT:", this.#pointerOverTarget)
        }
    }

    pointerOver(target) {
        console.log(target);
        this.#pointerOverTarget = target;
        console.log("POINTEROVER:", this.#pointerOverTarget)
    }

    pointerDown(target) {
        console.log(target);
        this.#pointerDownTarget = target;
        console.log("POINTERDOWN:", this.#pointerDownTarget)
    }

    pointerUp() {
        console.log("POINTERUP");
        this.#pointerUp = true;
    }

    pointerMove(target) {
        console.log(target.x / 32, target.y / 32);
        this.#pointerPosition = target;
    }

    clearPointerInputs() {
        this.#pointerUp = false;
        this.#pointerDownTarget = null;
    }

    update() {
        // Construct the input object for this frame
        return {
            over: this.#pointerOverTarget,
            down: this.#pointerDownTarget,
            up: this.#pointerUp,
            pointerPosition: this.#pointerPosition
        }
    }
}