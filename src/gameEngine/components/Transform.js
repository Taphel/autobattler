// Class imports
import Component from "../Component.js";

export default class Transform extends Component {
    #tileX;
    #tileY;
    #target = null;
    #x;
    #y;
    #z;
    #speed;

    constructor(x, y, z, speed) {
        super();
        this.#tileX = x;
        this.#x = x * 32;
        this.#tileY = y;
        this.#y = y * 32;
        this.#z = z;
        this.#speed = speed;
    }

    get tilePosition() {
        return { x: this.#tileX, y: this.#tileY };
    }

    get position() {
        return { x: this.#x, y: this.#y, z: this.#z };
    }

    get target() {
        return this.#target;
    }

    setTarget(targetPosition) {
        this.#target = targetPosition;
    }

    move(x, y) {
        this.#tileX = x;
        this.#tileY = y;
    }

    update(deltaTime) {
        // Update canvas position
        if (this.#target) {
            const targetX = this.#target?.x * 32;
            const targetY = this.#target?.y * 32;
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
        
        return ({
                position: this.position,
                target: this.#target
        });
    }
}