import { ItemDataModel } from "../abstract.mjs";
import { RUINSPARK } from "../../helpers/config.mjs";
import utils from "../../helpers/utils.mjs";

const { ArrayField, NumberField, SchemaField, SetField, StringField, HTMLField, ObjectField, DataField, BooleanField } = foundry.data.fields;
const fields = foundry.data.fields;

export default class WeaponData extends ItemDataModel {
    static defineSchema() {
        const schema = super.defineSchema();

        // weapons attack range
        schema.range = new StringField({
            initial: RUINSPARK.range.melee,
            blank: true,
            choices: () => {
                let options = {};
                for (const key of Object.keys(RUINSPARK.range)) options[key] = utils.localize(RUINSPARK.range[key]);
                return options;
            }
        })

        // Array of damage objects to use
        schema.damage = new ArrayField(new SchemaField({
            value: new StringField({ initial: "1d6" }),
            type: new StringField({
                initial: RUINSPARK.damageTypes.sharp,
                blank: true,
                choices: () => {
                    let options = {};
                    for (const key of Object.keys(RUINSPARK.damageTypes)) options[key] = utils.localize(RUINSPARK.damageTypes[key]);
                    return options;
                }
            })
        }), { initial: [{ value: "1d6", type: RUINSPARK.damageTypes.sharp }] })

        // requirements that need to be met to use this weapon
        schema.requires = new SchemaField({
            str: new NumberField({initial: 0}),
            agi: new NumberField({initial: 0}),
            int: new NumberField({initial: 0}),
            wil: new NumberField({initial: 0}),
        })

        return schema;
    }
}