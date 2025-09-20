// Import document classes.
import * as documents from "./documents/_module.mjs";

// Import data model calsses
import * as DataModels from "./data/_module.mjs";

// Import sheet classes.
import * as applications from "./applications/_module.mjs";

// Import helper/utility classes and constants.
import registerHandlebarsHelpers from "./helpers/templates.mjs";
import { RUINSPARK } from "./helpers/config.mjs";

/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */

Hooks.once('init', async function () {

  // Add utility classes to the global game object so that they're more easily
  // accessible in global contexts.
  game.ruinspark = {
    documents: {},
    applications: { ...applications },
    DataModels: DataModels,
    RuinsparkActor,
    RuinsparkItem,
    rollItemMacro,
    id: "ruinspark"
  };

  // Add custom constants for configuration.
  CONFIG.RUINSPARK = RUINSPARK;

  // Define custom Document classes
  CONFIG.Actor.documentClass = documents.RuinsparkActor;
  CONFIG.Item.documentClass = documents.RuinsparkItem;
  CONFIG.Combat.documentClass = documents.RuinsparkCombat;
  CONFIG.Combatant.documentClass = documents.RuinsparkCombatant;
  CONFIG.ChatMessage.documentClass = documents.RuinsparkChatMessage;

  // Register system data models
  CONFIG.Actor.dataModels = DataModels.actor.config;
  CONFIG.Item.dataModels = DataModels.item.config;

  // Register sheet application classes
  for (const sheet of applications.SystemSheets.actor.config) {
    console.log('registering sheet:', sheet);
    console.log(sheet.application);
    console.log(sheet.options);
    foundry.documents.collections.Actors.registerSheet("ruinspark", sheet.application, sheet.options);
  }

  for (const sheet of applications.SystemSheets.item.config) {
    console.log('registering sheet:', sheet);
    foundry.documents.collections.Items.registerSheet("ruinspark", sheet.application, sheet.options);
  }

  // Preload Handlebars templates.
  return registerHandlebarsHelpers();
});

/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

Hooks.once("ready", async function () {
  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on("hotbarDrop", (bar, data, slot) => createItemMacro(data, slot));
});

/* -------------------------------------------- */
/*  Hotbar Macros                               */
/* -------------------------------------------- */

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {Object} data     The dropped data
 * @param {number} slot     The hotbar slot to use
 * @returns {Promise}
 */
async function createItemMacro(data, slot) {
  // First, determine if this is a valid owned item.
  if (data.type !== "Item") return;
  if (!data.uuid.includes('Actor.') && !data.uuid.includes('Token.')) {
    return ui.notifications.warn("You can only create macro buttons for owned Items");
  }
  // If it is, retrieve it based on the uuid.
  const item = await Item.fromDropData(data);

  // Create the macro command using the uuid.
  const command = `game.ruinspark.rollItemMacro("${data.uuid}");`;
  let macro = game.macros.find(m => (m.name === item.name) && (m.command === command));
  if (!macro) {
    macro = await Macro.create({
      name: item.name,
      type: "script",
      img: item.img,
      command: command,
      flags: { "ruinspark.itemMacro": true }
    });
  }
  game.user.assignHotbarMacro(macro, slot);
  return false;
}

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {string} itemUuid
 */
function rollItemMacro(itemUuid) {
  // Reconstruct the drop data so that we can load the item.
  const dropData = {
    type: 'Item',
    uuid: itemUuid
  };
  // Load the item from the uuid.
  Item.fromDropData(dropData).then(item => {
    // Determine if the item loaded and if it's an owned item.
    if (!item || !item.parent) {
      const itemName = item?.name ?? itemUuid;
      return ui.notifications.warn(`Could not find item ${itemName}. You may need to delete and recreate this macro.`);
    }

    // Trigger the item roll
    item.roll();
  });
}