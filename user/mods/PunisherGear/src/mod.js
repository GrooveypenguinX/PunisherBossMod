"use strict";
const customItemsFunctions = require("./customItems.js");

class Mod {
  postDBLoad(container) {
    // Constants
    const logger = container.resolve("WinstonLogger");
    const database = container.resolve("DatabaseServer").getTables();
    const core = container.resolve("JustNUCore");
    const VFS = container.resolve("VFS");
    const modLoader = container.resolve("PreAkiModLoader");
	const jsonUtil = container.resolve("JsonUtil");
    const config = require("../config/config.json");
    const itemConfig = require("../config/itemConfig.json");
    const itemData = require("../db/items/itemData.json");
    const enLocale = require(`../db/locales/en.json`);
    const modPath = modLoader.getModPath("PunisheGear");

    // edge cases
    const customItems = [
      "punisher_bag",
      "punisher_slick",
      "punisher_rig"
    ];
	
    // Add retextures
    for (const categoryId in itemConfig) {
      for (const itemId in itemConfig[categoryId]) {
        // handle locale
        for (const localeID in database.locales.global) {
          // en placeholder
          if (enLocale[itemId]) {
            for (const localeItemEntry in enLocale[itemId]) {
              database.locales.global[localeID][`${itemId} ${localeItemEntry}`] = enLocale[itemId][localeItemEntry];
            }
          }
          // actual locale
          if (VFS.exists(`${modPath}locales/${localeID}.json`) && localeID != "en") {
            const actualLocale = require(`../locales/${localeID}.json`);

            if (actualLocale[itemId]) {
              for (const localeItemEntry in actualLocale[itemId]) {
                database.locales.global[localeID][`${itemId} ${localeItemEntry}`] = actualLocale[itemId][localeItemEntry];
              }
            }
          }
        }

        // skip custom items, handle them later
        if (customItems.includes(itemId)) {
          continue;
        }

        // add item retexture that is 1:1 to original item
        if (itemConfig[categoryId][itemId]) {
          core.addItemRetexture(itemId, itemData[itemId].BaseItemID, itemData[itemId].BundlePath, config.EnableTradeOffers, itemData[itemId].LootWeigthMult);
        }
      }
    }
			// Modify quests
		if (config.EnableQuestChanges) {
			const armoredVests = [
				["punisher_slick"]
			];
			const armoredGear = [
				["punisher_slick"]
			];
			
			// The survivalist path. Unprotected, but dangerous
			if (database.templates.quests["5d25aed386f77442734d25d2"]) {
				const unprotectedButDangerousGear = database.templates.quests["5d25aed386f77442734d25d2"].conditions.AvailableForFinish[0]._props.counter.conditions[1]._props.equipmentExclusive;
				
				database.templates.quests["5d25aed386f77442734d25d2"].conditions.AvailableForFinish[0]._props.counter.conditions[1]._props.equipmentExclusive = [
					...jsonUtil.clone(unprotectedButDangerousGear),
					...armoredVests
				];
			}
			
			// Swift one
			if (database.templates.quests["60e729cf5698ee7b05057439"]) {
				const swiftOneGear = database.templates.quests["60e729cf5698ee7b05057439"].conditions.AvailableForFinish[0]._props.counter.conditions[1]._props.equipmentExclusive;
				
				database.templates.quests["60e729cf5698ee7b05057439"].conditions.AvailableForFinish[0]._props.counter.conditions[1]._props.equipmentExclusive = [
					...jsonUtil.clone(swiftOneGear),
					...armoredVests,
					...armoredGear
				];
			}
		}

    // deal with custom items
    customItemsFunctions.handleCustomItems(database, core, config, itemConfig, itemData);

    // handle locale
    for (const localeID in database.locales.global) {
      // en placeholder
      for (const itemId in enLocale) {
        database.locales.global[localeID][`${itemId}Suite Name`] = enLocale[itemId].Name;
      }

      if (VFS.exists(`${modPath}locales/${localeID}.json`) && localeID != "en") {
        const actualLocale = require(`../locales/${localeID}.json`);

        for (const itemId in actualLocale) {
          database.locales.global[localeID][`${itemId}Suite Name`] = actualLocale[itemId].Name;
        }
      }
    }
  }
}
module.exports = { mod: new Mod() };
