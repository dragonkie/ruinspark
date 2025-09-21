import RuinsparkSheetMixin from "./mixin.mjs";

const ApplicationV2 = foundry.applications.sheets.ItemSheetV2;
export default class RuinsparkItemSheet extends RuinsparkSheetMixin(ApplicationV2) {
    /** @override */
    static DEFAULT_OPTIONS = {
        classes: ["ruinspark", "sheet", "item"],
        position: { height: 'auto', width: 600, top: 60, left: 120 },
        window: { resizable: false },
        actions: {}
    }
}