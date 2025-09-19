import { RUINSPARK } from "../../helpers/config.mjs";
import utils from "../../helpers/utils.mjs";
import RuinsparkDialog from "../dialog.mjs";

export default function RuinsparkSheetMixin(Base) {
    const mixin = foundry.applications.api.HandlebarsApplicationMixin;
    return class RuinsparkDocumentSheet extends mixin(Base) {
        static SHEET_MODES = { EDIT: 0, PLAY: 1 };
        _sheetMode = this.constructor.SHEET_MODES.PLAY;

        get sheetMode() { return this._sheetMode };
        get isPlayMode() { return this._sheetMode === this.constructor.SHEET_MODES.PLAY };
        get isEditMode() { return this._sheetMode === this.constructor.SHEET_MODES.EDIT };

        static DEFAULT_OPTIONS = {
            form: { submitOnChange: true },
            actions: {}
        }

        tabGroups = {};

        static PARTS = {};
        static TABS = {};

        _getTabs() {
            return Object.values(this.constructor.TABS).reduce((acc, v) => {
                const isActive = this.tabGroups[v.group] === v.id;
                acc[v.id] = {
                    ...v,
                    active: isActive,
                    cssClass: isActive ? "item active" : "item",
                    tabCssClass: isActive ? "tab active" : "tab"
                };
                return acc;
            }, {});
        }

        //============================================================================================
        // Sheet Actions
        //============================================================================================

        /**
         * Called whenever an action event is clicked
         * @param {Event} event 
         * @param {Element} target 
         */
        _onClickAction(event, target) { }
    }
}