// Class imports
import System from "../System.js";

export default class InputSystem extends System { 
    #up = 0;
    #down = 0;
    #right = 0;
    #left = 0;
    #space = 0;
    #shift = 0;

    #mouseTarget = null;
    #storedInputs = [];
    
    constructor () {
        super();
    }

    get direction() {
        const vectorX = this.#right - this.#left;
        const vectorY = this.#down - this.#up;

        if ((Math.abs(vectorX) && Math.abs(vectorY)) || (!Math.abs(vectorX) && !Math.abs(vectorY))) {
            return null
        } else {
            return { x: vectorX, y: vectorY }
        }
    }

    get mouseTarget() {
        return this.#mouseTarget;
    }

    clearTarget() {
        this.#mouseTarget = null;
    }

    handleTileClick(target) {
        console.log("new target:", target);
        const { x, y } = target;
        this.#mouseTarget = {x: x,  y: y};
    }

    keyDown(event) {
        switch(event.code) {
            case "KeyS":
            case "ArrowDown": 
            case "Numpad2":
                this.#down = 1;
                break;
            case "KeyW":
            case "ArrowUp":
            case "Numpad8":
                this.#up = 1;
                break;
            case "KeyA":
            case "ArrowLeft":
            case "Numpad4":
                this.#left = 1;
                break;
            case "KeyD":
            case "ArrowRight":
            case "Numpad6":
                this.#right = 1;
                break;
            case "Space":
                this.#space = 1;
                break;
        }
    }

    keyUp(event) {
        switch(event.code) {
            case "KeyS":
            case "ArrowDown": 
            case "Numpad2":
                this.#down = 0;
                break;
            case "KeyW":
            case "ArrowUp":
            case "Numpad8":
                this.#up = 0;
                break;
            case "KeyA":
            case "ArrowLeft":
            case "Numpad4":
                this.#left = 0;
                break;
            case "KeyD":
            case "ArrowRight":
            case "Numpad6":
                this.#right = 0;
                break;
            case "Space":
                this.#space = 0;
                break;
        }
    }

    update() {
        // Construct the input object for this frame
        const skip = this.#space;
        const forceMove = this.#shift;
        let direction = null;

        const vectorX = this.#right - this.#left;
        const vectorY = this.#down - this.#up;

        if ((Math.abs(vectorX) && !Math.abs(vectorY)) || (!Math.abs(vectorX) && Math.abs(vectorY))) {
            direction = { x: vectorX, y: vectorY }
        }

        this.#storedInputs.unshift({
            skip: skip,
            forceMove: forceMove,
            direction: direction
        });

        // Clearup array (only keep the last 6 frames)
        while (this.#storedInputs.length > 6) {
            this.#storedInputs.pop();
        }

        return this.#storedInputs;
    }
}