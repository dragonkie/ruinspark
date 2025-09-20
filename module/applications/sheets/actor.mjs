import RuinsparkSheetMixin from "./mixin.mjs";

const {ActorSheetV2} = foundry.applications.sheets;
export default class RuinsparkActorSheet extends RuinsparkSheetMixin(ActorSheetV2) {
    static DEFAULT_OPTIONS = {
        classes: ["ruinspark", "sheet", "actor"],
        position: {},
        window: {resizeable: false},
        actions: {}
    }

    static PARTS = {};
    static TABS = {};
    tabGroups = {};
}