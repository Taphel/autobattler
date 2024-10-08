// Class imports
import Component from "../Component.js";

export default class Animation extends Component {
    #sprites=[];
    #currentFrame = 0;
    #frameTime;
    #frameDuration = 0;

    #freeze = false;
    #playOnce;
    
    constructor(sprite, frames, frameTime = 30, playOnce = false) {
        super();
        if (frames === 1) {
            this.#sprites.push(`${sprite}`)
        } else {
            for (let i = 0; i < frames; i++) {
                this.#sprites.push(`${sprite}${i}`)
            }
        }
        
        this.#frameTime = frameTime;
        this.#playOnce = playOnce;
    }

    get sprite() {
        return this.#sprites[this.#currentFrame];
    }

    resetFrame() {
        this.#currentFrame = 0;
    }

    update(deltaTime) {
        this.#frameDuration += deltaTime;
        if (this.#frameDuration >= this.#frameTime) {
            if (this.#currentFrame < this.#sprites.length - 1 || !this.#playOnce) {
                this.#currentFrame = (this.#currentFrame  + 1) % this.#sprites.length;
                this.#frameDuration -= this.#frameTime;
            }
        }

        return {
            playOnce: this.#playOnce,
            lastFrame: this.#currentFrame === this.#sprites.length - 1
        }
    }
}