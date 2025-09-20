import RuinsparkActorSheet from "../actor.mjs";

export default class NpcSheet extends RuinsparkActorSheet {
    static DEFAULT_OPTIONS = {
        classes: ["npc"],
        position: { height: 'auto', width: 800, top: 60, left: 120 },
        window: { resizable: false },
        actions: {
            
        }
    }
}