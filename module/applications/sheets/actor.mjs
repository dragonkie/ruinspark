import utils from "../../helpers/utils.mjs";
import RuinsparkSheetMixin from "./mixin.mjs";

const { ActorSheetV2 } = foundry.applications.sheets;
export default class RuinsparkActorSheet extends RuinsparkSheetMixin(ActorSheetV2) {
    static DEFAULT_OPTIONS = {
        classes: ["ruinspark", "sheet", "actor"],
        position: {},
        window: { resizeable: false },
        actions: {
            bookmark: this._onClickBookmark
        }
    }

    /**
     * Adds the tab navigation as bookmarks on the right hand side of the sheet
     * @param {Object} options 
     * @returns {HTMLElement}
     */
    async _renderFrame(options) {
        const tabs = this._getTabs();
        const frame = await super._renderFrame(options);

        const path = `systems/${game.ruinspark.id}/templates/components/bookmarks-nav.hbs`;
        const template = await foundry.applications.handlebars.renderTemplate(path, { tabs: tabs });
        const node = utils.htmlToNode(template);

        frame.appendChild(node);
        return frame;
    }

    static async _onClickBookmark(event, target) {
        const button = event.target;
        const tab = button.dataset.tab;
        if (!tab || button.classList.contains("active") || (event.button !== 0)) return;
        const group = button.dataset.group;
        const navElement = button.closest(".sheet-bookmarks");
        this.changeTab(tab, group, { event, navElement });

        navElement.querySelector('.active').classList.remove("active");
        button.classList.add("active");
    }
}