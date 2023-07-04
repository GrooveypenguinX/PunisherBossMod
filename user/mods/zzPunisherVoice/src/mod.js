"use strict";

class Mod 
{
	postDBLoad(container)
	{
		const logger = container.resolve("WinstonLogger");
		const database = container.resolve("DatabaseServer").getTables();
		const VFS = container.resolve("VFS");
		const enLocale = require(`../db/locales/en.json`);
		const config = require("../config/config.json");
		const playervoiceconfig = require("../config/playervoiceconfig.json");
		
		Mod.makeVoice("Punisher_1", database, playervoiceconfig.AddVoiceToPlayer);
		
		// handle locale
		for (const localeID in database.locales.global) {
			// en placeholder
			for (const itemId in enLocale) {
				database.locales.global[localeID][`${itemId} Name`] = enLocale[itemId];
			}
			
			if (VFS.exists(`zzPunisherVoice/locales/${localeID}.json`) && localeID != "en") {
				const actualLocale = require(`../locales/${localeID}.json`);
				
				for (const itemId in actualLocale) {
					database.locales.global[localeID][`${itemId} Name`] = actualLocale[itemId];
				}
			}
		}
		
		// add to bots
		for (const botInConfig in config.AddVoicesToBots) {
			for (const botInDb in database.bots.types) {
				if (botInConfig === botInDb) {
					if (config.AddVoicesToBots[botInConfig].AddFollowingVoices.length != 0) {
						if (config.AddVoicesToBots[botInConfig].ReplaceDefaultOnes) {
							database.bots.types[botInDb].appearance.voice = [];
						}
						
						for (const voiceIndex in config.AddVoicesToBots[botInConfig].AddFollowingVoices) {
							database.bots.types[botInDb].appearance.voice.push(config.AddVoicesToBots[botInConfig].AddFollowingVoices[voiceIndex])
						}
					}
				}
			}
		}
	}
	
	static makeVoice(voiceId, database, playervoiceconfig)
	{
		// constants
		const config = require("../config/config.json");
		
		// make da voice
		const newVoice = {
			"_id": voiceId,
			"_name": voiceId,
			"_parent": "5fc100cf95572123ae738483",
			"_type": "Item",
			"_props": {
				"Name": voiceId,
				"ShortName": voiceId,
				"Description": voiceId,
				"Side": ["Usec", "Bear"],
				"Prefab": voiceId
			}
		};
		
		// add new voice to customization and character
		database.templates.customization[voiceId] = newVoice;
		  if (playervoiceconfig) {
			database.templates.character.push(voiceId);
		}
	}
}

module.exports = { mod: new Mod() }