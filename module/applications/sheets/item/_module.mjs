import ArmourSheet from "./armour.mjs";
import WeaponSheet from "./weapon.mjs";

export { ArmourSheet };
export { WeaponSheet }

export const config = [{
        application: ArmourSheet,
        options: {
            label: "RUINSPARK.Sheets.Item.Armour",
            types: ["armour"]
        }
    }, {
        application: WeaponSheet,
        options: {
            label: "RUINSPARK.Sheets.Item.Weapon",
            types: ["weapon"]
        }
    }
]