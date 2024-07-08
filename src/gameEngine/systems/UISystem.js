// Redux imports
import store from "../../store/store.js";
import { setSelectedEntity } from "../../store/slices/uiSlice.js";

// Class imports
import System from "../System.js";

// enums import
import { GameState } from "../../data/enums.js";

export default class UISystem extends System {
    constructor() {
        super();
    }

    update() {

    }
}