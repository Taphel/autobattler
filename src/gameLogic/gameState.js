// Redux imports
import store from "../store/store.js";
import { updateEncounter } from "../store/slices/encounterSlice.js";

// Libraries import
import { pickProperties } from "../libraries/pickProperties.js";

// Static data import
import constants from "../data/constants.js"

// Function imports
import { initializeEncounter } from "./managers/encounterManager.js";
import { initializeUnits } from "./managers/unitsManager.js";

// Initialization
export const encounterState = initializeEncounter();
export const unitsState = initializeUnits();