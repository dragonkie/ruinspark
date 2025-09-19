import RuinsparkSheetMixin from "./mixin.mjs";
import RuinsparkActorSheet from "./actor.mjs";
import RuinsparkItemSheet from "./item.mjs";

const SystemSheets = {
    mixin: RuinsparkSheetMixin,
    actor: {
        RuinsparkActorSheet
    },
    item: {
        RuinsparkItemSheet
    }
}

export default SystemSheets 