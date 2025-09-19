import { RUINSPARK } from "../helpers/config.mjs";

const { ArrayField, NumberField, SchemaField, SetField, StringField, HTMLField, ObjectField, DataField, BooleanField } = foundry.data.fields;
const fields = foundry.data.fields;

//===================================================================================
//> System Data Model
//===================================================================================
export class SystemDataModel extends foundry.abstract.TypeDataModel {

    /**
     * Defines an objects schema field map
     * @returns {Object}
     */
    static defineSchema() {
        return {};
    }

    //===============================================================================
    //>- Field definitions
    //===============================================================================
    static ValueField(value, min, max) {
        return new SchemaField({
            min: new NumberField({ initial: min }),
            value: new NumberField({ initial: value }),
            max: new NumberField({ initial: max }),
        })
    }

    static DiceField(value = "d4", count = 1) {
        return new SchemaField({
            dice: new StringField({ initial: "d4" }),
            count: new NumberField({ initial: count })
        });
    }

    //===============================================================================
    //>- Configuration functions
    //===============================================================================
    static get RequiredConfig() {
        return { required: true, nullable: false };
    }

    static get PrivateConfig() {
        return { required: true, nullable: false, gmOnly: true };
    }
}

//===================================================================================
//> Actor Data Model
//===================================================================================
export class ActorDataModel extends SystemDataModel {
    static defineSchema() {
        const schema = {};

        // Core stats
        schema.hp = this.ValueField();
        schema.stamina = this.ValueField();
        schema.armour = this.ValueField();
        schema.mp = this.ValueField();
        schema.reflex = this.ValueField();

        // Actors attribute scores
        schema.attributes = new SchemaField({
            str: this.AttributeField(),
            agi: this.AttributeField(),
            int: this.AttributeField(),
            wil: this.AttributeField(),
        });

        // Define their approach modifiers
        schema.approaches = new SchemaField({
            acc: new NumberField({ initial: 0 }),// precision
            wit: new NumberField({ initial: 0 }),// wit
            riz: new NumberField({ initial: 0 }),// spectacle
            pwr: new NumberField({ initial: 0 }),// power
            spd: new NumberField({ initial: 0 }),// speed
            snk: new NumberField({ initial: 0 }),// stealth
        });
    }

    static AttributeField() {
        return new SchemaField({
            value: new NumberField({ initial: 6, min: 1, max: 12 }),
            mod: new NumberField({ initial: 0 })
        });
    }
}

export class ItemDataModel extends SystemDataModel {

}