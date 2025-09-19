import RuinsparkSheetMixin from "./mixin.mjs";

const ApplicationV2 = foundry.applications.sheets.ActorSheetV2;
export default class RuinsparkActorSheet extends RuinsparkSheetMixin(ApplicationV2) {
    static DEFAULT_OPTIONS = {
        classes: ["sheet", "actor"],
        position: {},
        window: {resizeable: false},
        actions: {}
    }

    static PARTS = {};
    static TABS = {};
}