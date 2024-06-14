class Enum {
    constructor() {
        throw new Error(`${this.constructor.name} is a static Enum class, it is not meant to be instantiated.`);
    }
}

export class TileType extends Enum {
    static floor = "TILETYPE_FLOOR";
    static wall = "TILETYPE_WALL";
    static void = "TILETYPE_VOID";
}

export class EntityFlag extends Enum {
    // Faction flags
    static player = "ENTITYFLAG_PLAYER";
    static enemy = "ENTITYFLAG_ENEMY";

    // Entity type flags
    static unit = "ENTITYFLAG_UNIT"
    static item = "ENTITYFLAG_ITEM"
    static exit = "ENTITYFLAG_EXIT"
    static entrance = "ENTITYFLAG_ENTRANCE"

    // 
}

export class SkillFlag extends Enum {
    static attack = "SKILLFLAG_ATTACK";
    static harm = "SKILLFLAG_HARM";
    static noHarm = "SKILLFLAG_NOHARM";
}

export class GameState extends Enum {
    static idle = "GAMESTATE_IDLE";
    static turnStart = "GAMESTATE_TURNSTART";
    static turnEnd = "GAMESTATE_TURNEND";
    static animation = "GAMESTATE_ANIMATION";
    static transform = "GAMESTATE_TRANSFORM";
}