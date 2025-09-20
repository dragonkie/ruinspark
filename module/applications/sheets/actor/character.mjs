import RuinsparkActorSheet from "../actor.mjs";

export default class CharacterSheet extends RuinsparkActorSheet {
    static DEFAULT_OPTIONS = {
        classes: ["character"],
        position: { height: 'auto', width: 800, top: 60, left: 120 },
        window: { resizable: false },
        actions: {

        }
    }

    static PARTS = {
        body: { template: "systems/ruinspark/templates/sheets/actor/body.hbs" }
    }

    static TABS = {

    }
}