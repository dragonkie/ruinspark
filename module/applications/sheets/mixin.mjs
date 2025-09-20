import { RUINSPARK } from "../../helpers/config.mjs";
import utils from "../../helpers/utils.mjs";
import RuinsparkDialog from "../dialog.mjs";

export default function RuinsparkSheetMixin(Base) {
    const mixin = foundry.applications.api.HandlebarsApplicationMixin;
    return class RuinsparkDocumentSheet extends mixin(Base) {
        //============================================================================================
        //> Sheet modes
        //============================================================================================
        static SHEET_MODES = { EDIT: 0, PLAY: 1 };
        _sheetMode = this.constructor.SHEET_MODES.PLAY;

        get sheetMode() { return this._sheetMode };
        get isPlayMode() { return this._sheetMode === this.constructor.SHEET_MODES.PLAY };
        get isEditMode() { return this._sheetMode === this.constructor.SHEET_MODES.EDIT };

        static DEFAULT_OPTIONS = {
            form: { submitOnChange: true },
            actions: {}
        }

        //============================================================================================
        //> Sheet tab controls
        //============================================================================================
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
        //> Sheet context
        //============================================================================================
        async _prepareContext(options) {
            const doc = this.document;
            const context = {
                document: doc,
                system: {},
                config: CONFIG.RUINSPARK,
                rollData: doc.getRollData(),
                name: doc.name,
                flags: this.document.flags,
                tabs: this._getTabs(),
                isEditMode: this.isEditMode,
                isPlayMode: this.isPlayMode,
                isEditable: this.isEditable,
                isGM: game.user.isGM,
                effects: {}
            }

            return context;
        }

        //============================================================================================
        //> Rendering
        //============================================================================================
        /**
         * Querys the server to render the application
         * @param {*} options 
         * @param {*} _options 
         * @returns 
         */
        async render(options, _options) {
            return super.render(options, _options);
        }

        async _preRender(context, options) {
            this._setFocusElement();
            this._setCollapsedElements();
            return super._preRender(context, options);
        }

        /**
         * Called once when the sheet is initially opened
         * @param {*} context 
         * @param {*} options 
         */
        _onFirstRender(context, options) {
            super._onFirstRender(context, options);
            //this._setupContextMenu();
        }

        /**
         * Called after every time the sheet is rendered / re rendered
         * @param {*} context 
         * @param {*} options 
         */
        _onRender(context, options) {
            super._onRender(context, options);

            // disables all input elements if this isnt editable for the user
            if (!this.isEditable) {
                this.element.querySelectorAll("input, select, textarea, multi-select").forEach(n => {
                    n.disabled = true;
                })
            }
            this._setupDragAndDrop();

            this._getFocusElement();
            this._getCollapsedElements();
        }

        async _renderHTML(context, options) {
            return super._renderHTML(context, options);
        }

        async _renderFrame(options) {
            const frame = super._renderFrame(options);

            // Insert additional buttons into the window header
            // In this scenario we want to add a lock button
            if (this.isEditable && !this.document.getFlag("core", "sheetLock")) {
                const label = game.i18n.localize("SHEETS.toggleLock");
                let icon = this.isEditMode ? 'fa-lock-open' : 'fa-lock';
                const sheetConfig = `<button type="button" class="header-control fa-solid ${icon} icon" data-action="toggleMode" data-tooltip="${label}" aria-label="${label}"></button>`;
                this.window.close.insertAdjacentHTML("beforebegin", sheetConfig);
            }

            return frame;
        }

        _replaceHTML(result, content, options) {
            return super._replaceHTML(result, content, options);
        }

        _insertElement(element) {
            return super._insertElement(element);
        }

        _removeElement(element) {
            return super._removeElement(element);
        }

        async _preparePartContext(partId, context, options) {
            return super._preparePartContext(partId, context, options);
        }

        _preSyncPartState(partId, newElement, priorElement, state) {
            return super._preSyncPartState(partId, newElement, priorElement, state);
        }

        _syncPartState(partId, newElement, priorElement, state) {
            return super._syncPartState(partId, newElement, priorElement, state);
        }

        //============================================================================================
        //> Input focus persistance
        //============================================================================================
        _lastFocusElement = null;

        _setFocusElement() {
            if (this.rendered && this.element.contains(document.activeElement)) {
                const ele = document.activeElement;

                var cList = '';
                ele.classList.forEach(c => cList += `.${c}`);

                this._lastFocusElement = {
                    name: ele.name || '',
                    value: ele.value || '',
                    class: cList,
                    tag: ele.tagName.toLowerCase()
                }
            }
        }

        _getFocusElement() {
            if (this._lastFocusElement !== null) {
                let selector = this._lastFocusElement.tag + this._lastFocusElement.class;
                if (this._lastFocusElement.name) selector += `[name="${this._lastFocusElement.name}"]`;

                /** @type {HTMLElement|undefined}*/
                const targetElement = this.element.querySelector(selector);
                if (targetElement) {
                    targetElement.focus();
                    if (targetElement.tagName == 'INPUT') targetElement.select();
                }
            }
        }

        //============================================================================================
        //> Collapsible content persistence
        //============================================================================================
        _collapsedElements = [];
        _setCollapsedElements() {
            if (this.rendered) {
                this._collapsedElements = [];
                /** @type {NodeList|null} */
                const elements = this.element.querySelectorAll('.collapsible');
                for (const element of elements) {
                    let selector = ``;
                    let ele = element;
                    while (ele) {
                        // Add parent selectors data
                        let s = `${ele.nodeName}${ele.className != '' ? '.' : ''}${ele.className.replaceAll(' ', ".")}`; // classes
                        for (let i = 0; i < ele.attributes.length; i++) {
                            const a = ele.attributes[i];
                            if (a.name == 'class' || a.name == 'style') s += `[${ele.attributes[i].name}]`;
                            else s += `[${ele.attributes[i].name}="${ele.attributes[i].value}"]`;
                        }
                        selector = s + ' ' + selector;

                        // Prevent hte check from leaving the scope of the sheet
                        if (ele.classList.contains('window-content')) break;

                        // Progress to the next parent
                        ele = ele.parentElement;
                    }

                    this._collapsedElements.push({
                        collapsed: element.classList.contains('collapsed'),
                        selector: selector.replaceAll(/(.collapsed|.active)/gm, '')
                    });
                }
                return this._collapsedElements;
            }
            return null;
        }

        _getCollapsedElements() {
            if (this._collapsedElements.length > 0 && this.rendered) {
                const list = [];
                this._collapsedElements.forEach(({ selector, collapsed }) => {
                    const ele = this.element.querySelector(selector);
                    if (!ele) {
                        console.error('Failed to get element with selector: ', { s: selector });
                        return;
                    }
                    list.push({ ele: ele, sel: selector, collapsed: collapsed })
                    if (collapsed) ele.classList.add('collapsed');
                    else ele.classList.remove('collapsed');
                })
            }
        }

        //============================================================================================
        //> Drag and Drop
        //============================================================================================
        _setupDragAndDrop() {
            const dd = new foundry.applications.ux.DragDrop.implementation({
                dragSelector: "[data-uuid]",
                dropSelector: ".application",
                permissions: {
                    dragstart: this._canDragStart.bind(this),
                    drop: this._canDragDrop.bind(this)
                },
                callbacks: {
                    dragstart: this._onDragStart.bind(this),
                    drop: this._onDrop.bind(this)
                }
            });
            dd.bind(this.element);
        }

        _canDragStart(selector) {
            return true;
        }

        _canDragDrop(selector) {
            return this.isEditable && this.document.isOwner;
        }

        async _onDragStart(event) {
            const uuid = event.currentTarget.closest("[data-uuid]").dataset.uuid;
            const item = await fromUuid(uuid);
            const data = item.toDragData();
            event.dataTransfer.setData("text/plain", JSON.stringify(data));
        }

        async _onDrop(event) {
            event.preventDefault();
            if (!this.isEditable) return;
            const target = event.target;
            const { type, uuid } = utils.getDragEventData(event);
            const item = await fromUuid(uuid);

            if (!item) return;
            if (item.parent === this.document) return this._onSortItem(item, target);

            switch (type) {
                case "ActiveEffect": return this._onDropActiveEffect(event, item);
                case "Item": return this._onDropItem(event, item);
                case "Actor": return this._onDropActor(event, item);
                default: return;
            }
        }

        async _onDropItem(event, item) {
            LOGGER.debug('Recieved standard item drop');
            // Item dorps can be intercepted by overiding this function and returning a non true value
            // if returning !true, this will make _onDrop() skip default
            // document creation
            return true;
        }

        async _onDropActor(event, actor) {
            LOGGER.error(`Unhandled actor drop`, this);
        }

        async _onDropActiveEffect(event, effect) {

        }

        async _onSortItem(item, target) {
            if (item.documentName !== "Item") return;
            LOGGER.debug('Sorting item');
            const self = target.closest("[data-tab]")?.querySelector(`[data-uuid="${item.uuid}"]`);
            if (!self || !target.closest("[data-uuid]")) return;

            let sibling = target.closest("[data-uuid]") ?? null;
            if (sibling?.dataset.uuid === item.uuid) return;
            if (sibling) sibling = await fromUuid(sibling.dataset.uuid);

            let siblings = target.closest("[data-tab]").querySelectorAll("[data-uuid]");
            siblings = await Promise.all(Array.from(siblings).map(s => fromUuid(s.dataset.uuid)));
            siblings.findSplice(i => i === item);

            let updates = SortingHelpers.performIntegerSort(item, { target: sibling, siblings: siblings, sortKey: "sort" });
            updates = updates.map(({ target, update }) => ({ _id: target.id, sort: update.sort }));
            this.document.updateEmbeddedDocuments("Item", updates);
        }

        //============================================================================================
        //> Context menu
        //============================================================================================

        //============================================================================================
        //> Sheet Actions
        //============================================================================================

        /**
         * Called whenever an action event is clicked
         * @param {Event} event 
         * @param {Element} target 
         */
        _onClickAction(event, target) { }
    }
}