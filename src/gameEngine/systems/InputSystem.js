// Class imports
import System from "../System.js";

// data imports
import { UnitFaction } from "../../data/enums.js";

export default class InputSystem extends System { 
    #up = 0;
    #down = 0;
    #right = 0;
    #left = 0;
    #space = 0;
    #shift = 0;
    #pointerOverTarget = null;
    #pointerDownTarget = null;
    #pointerPosition;
    pointerOut;
    pointerUp;
    #storedInputs = [];
    
    constructor () {
        super();
        this.pointerOut = () => {
            this.#pointerOverTarget = null;
            console.log("POINTEROUT:", this.#pointerOverTarget)
        }
        this.pointerUp = () => {
            this.#pointerDownTarget = null;
            console.log("POINTERUP", this.#pointerDownTarget);
        }
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

    pointerMove(target) {
        this.#pointerPosition = target;
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
        return {
            over: this.#pointerOverTarget,
            down: this.#pointerDownTarget,
            position: this.#pointerPosition
        }
    }
}