import Action from "../Action.js";

export class Attack extends Action {

    constructor(name, minRange, maxRange, targetEntityFlag) {
        super(name, minRange, maxRange, targetEntityFlag);
    }

    perform(attributes) {
        return { 
            user: {
                actionCost: 10
            },
            target: {
                damage: attributes.str
            }
         };
    }   
}