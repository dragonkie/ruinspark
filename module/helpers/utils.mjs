export default class utils {
    //================================================================================================
    // Foundry quick references
    //================================================================================================

    static notify(msg) {
        ui.notifications.notify(this.localize(msg));
    }

    static warn(msg) {
        ui.notifications.warn(this.localize(msg));
    }

    static error(msg) {
        ui.notifications.error(this.localize(msg));
    }

    static localize(text) {
        return game.i18n.localize(text) ?? text;
    }

    static async renderTemplate(path, data) {
        return foundry.applications.handlebars.renderTemplate(path, data);
    }

    static async enrichHTML(html) {
        return foundry.applications.ux.TextEditor.enrichHTML(html);
    }

    static getDragEventData(data) {
        return foundry.applications.ux.TextEditor.getDragEventData(data);
    }

    /**
     * Math function to ensure a value falls within a specified range
     * @param {*} value 
     * @param {*} min 
     * @param {*} max 
     * @returns 
     */
    static clamp(value, min, max) {
        return Math.max(Math.min(value, max), min);
    }

    /**
     * Linear interpolation of a value between points a and b
     * @param {Number} start 
     * @param {Number} end 
     * @param {Number} t 
     * @returns {Number}
     */
    static lerp(start, end, t) {
        return start * (1 - t) + end * t
    }

    /**
     * Adds the given function in as a valid modifier for foundry dice roll formulas
     * @param {String} term 
     * @param {String} label 
     * @param {Function} func 
     */
    static registerMod(term, label, func) {
        foundry.dice.terms.Die.prototype.constructor.MODIFIERS[term] = label;
        foundry.dice.terms.Die.prototype[label] = func;
    }

    static getFormData(form, selectors) {
        const matches = form.querySelectorAll(selectors);
        const data = {};
        for (const element of matches) {
            let key = '';
            if (element.name) key = element.name;
            else if (element.id) key = element.id;
            // Parse the input data based on type
            switch (element.type) {
                case 'number':
                    data[key] = +element.value;
                    break;
                case 'checkbox':
                    data[key] = element.checked;
                    break;
                default:
                    data[key] = element.value;
                    break;
            }
        }

        return data;
    }

    /**
     * Used to wait for a given element to load into the DOM
     * a bit of a bulky soloution, but its the best one I have
     * 
     * REMINDER - Study mutation observers as this will be important for other projects!
     * @param {Selector} selector 
     * @returns 
     */
    static waitForElm(selector) {
        //use a promise to allow for await to work as well as the use of .then()
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    /**
     * Convinient and light weight method to clone most data to prevent mutating source
     * @param {*} original 
     * @returns 
     */
    static duplicate(original) {
        return JSON.parse(JSON.stringify(original));
    }
}