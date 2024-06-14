// ECS Import
import ComponentSet from "./ComponentSet.js";

// Systems import
import GenerationSystem from "./systems/GenerationSystem.js";
import PhysicsSystem from "./systems/PhysicsSystem.js";
import BattleSystem from "./systems/BattleSystem.js";
import DisplaySystem from "./systems/DisplaySystem.js";
import InputSystem from "./systems/InputSystem.js";
import UISystem from "./systems/UISystem.js";


/// Other files
// enums
import { EntityFlag, GameState } from "../data/enums.js";
// data
import constants from "../data/constants.js";
import skillData from "../data/skillData.js";
// libraries
import shuffleArray from "../libraries/shuffleArray.js";
import { current } from "@reduxjs/toolkit";

class GameEngine {
    #entities = [];
    #components = {
        ai: new ComponentSet(100),
        animation: new ComponentSet(100),
        camera: new ComponentSet(100),
        transform: new ComponentSet(100),
        entityFlags: new ComponentSet(100),
        unitSkills: new ComponentSet(100),
        unitStats: new ComponentSet(100),
        vision: new ComponentSet(100)
    };
    #systems = {
        generation: new GenerationSystem(),
        physics: new PhysicsSystem(),
        display: new DisplaySystem(),
        battle: new BattleSystem(),
        input: new InputSystem(),
        ui: new UISystem()
    };
    #gameState = GameState.idle;
    #levelCount = 0;
    #dungeonLevel;
    #previousTickTime = 0;

    constructor() {
        const { dungeonWidth, dungeonHeight, cellularAutomataIterations, dungeonSeedWallRate } = constants;
        const { generation, display } = this.#systems;
        this.#dungeonLevel = generation.generateLevel(30, 30, 8, 0.4, 0);
        generation.generateLevelContent(this.#dungeonLevel, this.#entities, this.#components);
        display.initializeDisplay(this.#dungeonLevel, this.#entities, this.#components);

        // this.#entities.forEach(entity => {
        //     console.log(entity, 
        //         // this.#components.ai.get(entity),
        //         // this.#components.animation.get(entity),
        //         // this.#components.camera.get(entity),
        //         this.#components.transform.get(entity),
        //         this.#components.entityFlags.get(entity),
        //         // this.#components.unitSkills.get(entity),
        //         // this.#components.unitStats.get(entity),
        //         // this.#components.vision.get(entity)
        //     )
        // });

        setInterval(() => {
            this.#updateLoop()
        }, 30);
    }

    get input() {
        return this.#systems.input;
    }


    #updateLoop() {
        const currentTickTime = performance.now();
        const deltaTime = (currentTickTime - this.#previousTickTime);
        this.#previousTickTime = currentTickTime;
        const { physics, display, battle, input, ui } = this.#systems;
    
        // Update field of View;
        physics.update(this.#dungeonLevel, this.#entities, this.#components);

        let newDisplayQueue = [];
        // Battle, movement
        if (!display.pendingAnimations) {
            const inputs = input.update();
            const battleUpdate = battle.update(this.#dungeonLevel, this.#entities, this.#components, inputs, this.#gameState);
            this.#gameState = battleUpdate.gameState;
            newDisplayQueue = battleUpdate.newDisplayQueue;

            if (newDisplayQueue.length > 0) console.log(newDisplayQueue);
        }
        
        // Update display
        display.update(this.#dungeonLevel, this.#entities, this.#components, deltaTime, newDisplayQueue);
    }
}

const gameEngine = new GameEngine();
export default gameEngine;