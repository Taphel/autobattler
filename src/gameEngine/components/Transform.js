// Class imports
import Component from "../Component.js";

export default class Transform extends Component {
    #target = null;
    #x;
    #y;
    #z;
    #speed;
    #scale;
    #anchor = { x: 0.5, y: 0.5 }

    constructor(x = 0, y = 0, z = 0, speed = 0, scaleX = 1, scaleY = 1) {
        super();
        this.#x = x + this.#anchor.x;
        this.#y = y + this.#anchor.y;
        this.#z = z;
        this.#speed = speed;
        this.#scale = { x: scaleX, y: scaleY };
    }

    get position() {
        return { x: this.#x, y: this.#y, z: this.#z };
    }

    get scale() {
        return this.#scale;
    }

    get anchor() {
        return this.#anchor;
    }

    get target() {
        return this.#target;
    }

    setTarget(x, y) {
        this.#target = {x: x + this.#anchor.x, y: y + this.#anchor.y};
    }
    
    update(deltaTime) {
        // Update canvas position
        if (this.#target) {
            const targetX = this.#target?.x
            const targetY = this.#target?.y;

            if (this.#speed === 0) {
                this.#x = targetX;
                this.#y = targetY;
            } else {
                this.#x += Math.sign(targetX - this.#x) * Math.min(this.#speed * deltaTime, Math.abs(targetX - this.#x));
                this.#y += Math.sign(targetY - this.#y) * Math.min(this.#speed * deltaTime, Math.abs(targetY - this.#y));
                if (this.#x === targetX && this.#y === targetY) this.#target = null;
            }
        }
    }
}