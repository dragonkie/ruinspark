import RuinsparkActorSheet from "../actor.mjs";

const tPath = "systems/ruinspark/templates/sheets/actor/character";
export default class CharacterSheet extends RuinsparkActorSheet {
    static DEFAULT_OPTIONS = {
        classes: ["character"],
        position: { height: 'auto', width: 800, top: 60, left: 120 },
        window: { resizable: false },
        actions: {

        }
    }

    static PARTS = {
        body: { template: `${tPath}/body.hbs` },

        features: { template: `${tPath}/features.hbs` },
        combat: { template: `${tPath}/combat.hbs` },
        magic: { template: `${tPath}/magic.hbs` },
        inventory: { template: `${tPath}/inventory.hbs` },
        journal: { template: `${tPath}/journal.hbs` },
        settings: { template: `${tPath}/settings.hbs` }
    }

    static TABS = {
        features: { id: "features", group: "primary", icon: "fa-user", label: "RUINSPARK.Tab.Character" },
        combat: { id: "combat", group: "primary", icon: "fa-sword", label: "RUINSPARK.Tab.Combat" },
        magic: { id: "magic", group: "primary", icon: "fa-sparkles", label: "RUINSPARK.Tab.Magic" },
        inventory: { id: "inventory", group: "primary", icon: "fa-boxes-stacked", label: "RUINSPARK.Tab.Inventory" },
        journal: { id: "journal", group: "primary", icon: "fa-book-blank", label: "RUINSPARK.Tab.Journal" },
        settings: { id: "settings", group: "primary", icon: "fa-cog", label: "RUINSPARK.Tab.Settings" }
    }

    tabGroups = {
        primary: "features",
    }
}