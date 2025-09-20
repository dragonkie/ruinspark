import * as ActorSheets from "./actor/_module.mjs";
import * as ItemSheets from "./item/_module.mjs";
import RuinsparkSheetMixin from "./mixin.mjs";
import RuinsparkActorSheet from "./actor.mjs";
import RuinsparkItemSheet from "./item.mjs";

const SystemSheets = {
    mixin: RuinsparkSheetMixin,
    actor: {
        RuinsparkActorSheet,
        ...ActorSheets
    },
    item: {
        RuinsparkItemSheet,
        ...ItemSheets
    }
}

export default SystemSheets 