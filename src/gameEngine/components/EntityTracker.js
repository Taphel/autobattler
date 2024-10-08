// Class imports
import Component from "../Component.js";

class EntityTracker extends Component {
    #targetId = null;

    constructor() {
        super();
    }

    setTargetId(id) {
        this.#targetId = id;
    }

    get targetId() {
        return this.#targetId;
    }
}

export class UnitOverlayUI extends EntityTracker {
    #offset;
    #z;
    #healthRate = 0;
    #manaRate = 0;

    constructor(xOffset, yOffset, z) {
        super();
        this.#offset = { x: xOffset, y: yOffset };
        this.#z = z;
    }

    get offset() {
        return this.#offset;
    }

    get z() {
        return this.#z;
    }
}

export class MouseOver extends EntityTracker {
    #offset;
    #z;
    #sprite;
    #displayOnMouseOver;
    #statOverlay;

    constructor(xOffset, yOffset, z, sprite, frames, frameDuration) {
        super();
        this.#offset = { x: xOffset, y: yOffset };
        this.#z = z;
        this.#sprite = { path: sprite, frames: frames, duration: frameDuration}
    }

    get offset() {
        return this.#offset;
    }

    get z() {
        return this.#z;
    }

    get sprite() {
        return this.#sprite;
    }

    get displayOnMouseOver() {
        return this.#displayOnMouseOver;
    }
}

export class MouseDrag extends EntityTracker {
    #mousePosition;
    #z;

    constructor(z) {
        super();
        this.#z = z;
    }

    setMousePosition(x, y) {
        this.#mousePosition = { x: x, y: y };
    }

    get mousePosition() {
        return this.#mousePosition;
    }

    get z() {
        return this.#z;
    }
}