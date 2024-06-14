// Class imports
import Component from "../Component.js";

export default class Animation extends Component {
    #sprites=[];
    #currentFrame = 0;
    #frameDuration = 0;

    #playOnce;
    
    constructor(sprite, frames, playOnce = false) {
        super();
        if (frames === 1) {
            this.sprites.push(`/sprites/${sprite}.png`)
        } else {
            for (let i = 0; i < frames; i++) {
                this.#sprites.push(`/sprites/${sprite}${i}.png`)
            }
        }
        

        this.#playOnce = playOnce;
    }

    get sprites() {
        return this.#sprites;
    }

    get currentFrame() {
        return this.#currentFrame;
    }

    update(deltaTime) {
        this.#frameDuration += deltaTime;
        if (this.#frameDuration >= 60) {
            this.#currentFrame = (this.#currentFrame  + 1) % this.#sprites.length;
            this.#frameDuration -= 60;
        }

        return {
            playOnce: this.#playOnce,
            lastFrame: this.#currentFrame === this.#sprites.length - 1
        }
        
    }
}