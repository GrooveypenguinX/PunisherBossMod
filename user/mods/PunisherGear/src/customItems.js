"use strict";

class CustomItems {
	static handleCustomItems(database, core, config, itemConfig, itemData)
	{
		if (itemConfig["Items"][
			"punisher_slick",
			"punisher_bag",
			"punisher_rig"
			]) {
            core.addItemRetexture("punisher_slick", itemData["punisher_slick"].BaseItemID, itemData["punisher_slick"].BundlePath, false, itemData["punisher_slick"].LootWeigthMult);
            core.addItemRetexture("punisher_bag", itemData["punisher_bag"].BaseItemID, itemData["punisher_bag"].BundlePath, false, itemData["punisher_bag"].LootWeigthMult);
            core.addItemRetexture("punisher_rig", itemData["punisher_rig"].BaseItemID, itemData["punisher_rig"].BundlePath, false, itemData["punisher_rig"].LootWeigthMult);
			
			// add item to bots
			
			// add trade offer
			if (config.EnableTradeOffers)
                core.createTraderOffer("punisher_slick", "5935c25fb3acc3127c3d8cd9", "5696686a4bdc2da3298b456a", 1792, 1);
                core.createTraderOffer("punisher_bag", "5ac3b934156ae10c4430e83c", "5449016a4bdc2d6f028b456f", 32878, 1);
                core.createTraderOffer("punisher_rig", "5ac3b934156ae10c4430e83c", "5449016a4bdc2d6f028b456f", 24079, 1);
		}
	}
}

module.exports = CustomItems;