import CharacterSheet from "./character.mjs";
import NpcSheet from "./npc.mjs";

export { CharacterSheet };
export { NpcSheet };

export const config = [{
        application: CharacterSheet,
        options: {
            label: "RUINSPARK.Sheets.Actor.Character",
            types: ["character"]
        }
    }, {
        application: NpcSheet,
        options: {
            label: "RUINSPARK.Sheets.Actor.Npc",
            types: ["npc"]
        }
    }
];