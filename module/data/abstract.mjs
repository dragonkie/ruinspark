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
        const schema = {};

        schema.description = new SchemaField({
            value: new HTMLField({ initial: "" })
        })

        return schema;
    }

    //=================================================================
    //> Prepare data
    //=================================================================
    prepareData() {
        super.prepareData();
    }

    prepareBaseData() {
        super.prepareBaseData();
    }

    prepareDerivedData() {
        super.prepareDerivedData();
    }

    getRollData() {
        return super.getRollData();
    }

    //=================================================================
    //> Creation events
    //=================================================================
    _onCreate(data, options, userId) {
        super._onCreate(data, options, userId);
    }

    //=================================================================
    //> Update events
    //=================================================================
    async _preUpdate(changes, options, user) {
        super._preUpdate(changes, options, user);
    }

    _onUpdate(changed, options, userId) {
        super._onUpdate(changed, options, userId);
    }

    //=================================================================
    //> Delete events
    //=================================================================
    async _preDelete(options, user) {
        return super._preDelete(options, user);
    }

    _onDelete(options, userId) {
        super._onDelete(options, userId);
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
        const schema = super.defineSchema();

        // Core stats
        schema.hp = this.ValueField(12, 1, 12);
        schema.stamina = this.ValueField(12, 1, 12);
        schema.armour = this.ValueField(12, 1, 12);
        schema.mp = this.ValueField(12, 1, 12);
        schema.momentum = this.ValueField(12, 1, 12);
        schema.reflex = this.ValueField(12, 1, 12);

        // Actors attribute scores
        schema.attributes = new SchemaField({
            str: this.AttributeField(),
            agi: this.AttributeField(),
            int: this.AttributeField(),
            wil: this.AttributeField(),
        });

        // Define their approach modifiers
        schema.approaches = new SchemaField({
            acc: this.ValueField(0, -12, 12),// precision
            wit: this.ValueField(0, -12, 12),// wit
            riz: this.ValueField(0, -12, 12),// spectacle
            pow: this.ValueField(0, -12, 12),// power
            spd: this.ValueField(0, -12, 12),// speed
            snk: this.ValueField(0, -12, 12),// stealth
        });

        return schema;
    }

    static AttributeField() {
        return new SchemaField({
            value: new NumberField({ initial: 6, min: 1, max: 12 }),
            mod: new NumberField({ initial: 0 })
        });
    }

    prepareDerivedData() {
        const data = super.prepareDerivedData();
        this.dc = {};
        for (const [key, approach] of Object.entries(this.approaches)) {
            this.dc[key] = {};
            for (const [k, attribute] of Object.entries(this.attributes)) {
                this.dc[key][k] = attribute.value - approach.value;
            }
        }
    }
}

export class ItemDataModel extends SystemDataModel {
    static defineSchema() {
        const schema = super.defineSchema();
        return schema;
    }
}