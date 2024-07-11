// Class imports
import Component from "../Component.js";

export default class Transform extends Component {
    #target = null;
    #x;
    #y;
    #z;
    #speed;

    constructor(x = 0, y = 0, z = 0, speed = 0) {
        super();
        this.#x = x;
        this.#y = y;
        this.#z = z;
        this.#speed = speed;
    }

    get position() {
        return { x: this.#x, y: this.#y, z: this.#z };
    }

    get target() {
        return this.#target;
    }

    setTarget(x, y) {
        this.#target = {x: x, y: y};
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
                if (this.#x !== targetX) {
                    const direction = Math.sign(targetX - this.#x);
                    switch (direction) {
                        case 1:
                            this.#x = this.#x + Math.min(this.#speed * deltaTime * direction, targetX - this.#x);
                            break;
                        case -1:
                            this.#x = this.#x + Math.max(this.#speed * deltaTime * direction, targetX - this.#x);
                            break;
                    }
                }
    
                if (this.#y !== targetY) {
                    const direction = Math.sign(targetY - this.#y);
                    switch (direction) {
                        case 1:
                            this.#y = this.#y + Math.min(this.#speed * deltaTime * direction, targetY - this.#y);
                            break;
                        case -1:
                            this.#y = this.#y + Math.max(this.#speed * deltaTime * direction, targetY - this.#y);
                            break;
                    }
                }
                if (this.#x === targetX && this.#y === targetY) this.#target = null;
            }
        }
        
        return ({
                position: this.position,
                target: this.#target
        });
    }
}