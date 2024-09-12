// Class imports
import System from "../System.js";

// data imports
import { UnitFaction } from "../../data/enums.js";

export default class InputSystem extends System { 
    #pointerOverTarget = null;
    #pointerDownTarget = null;
    #pointerPosition;
    #pointerUp = false;
    #startButtonClicked = false;
    pointerOut;
    
    
    constructor () {
        super();
        this.pointerOut = () => {
            if (!this.#pointerUp) this.#pointerOverTarget = null;
            console.log("POINTEROUT:", this.#pointerOverTarget)
        }
    }

    pointerOver(target) {
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
        this.#pointerPosition = target;
    }

    combatStart() {
        this.#startButtonClicked = true;
    }

    clearInputs() {
        if (this.#pointerUp) {
            this.#pointerUp = false;
            this.#pointerDownTarget = null;
        }

        this.#startButtonClicked = false;
    }

    update() {
        // Construct the input object for this frame
        return {
            over: this.#pointerOverTarget,
            down: this.#pointerDownTarget,
            up: this.#pointerUp,
            pointerPosition: this.#pointerPosition,
            start: this.#startButtonClicked
        }
    }
}