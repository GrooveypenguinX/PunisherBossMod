﻿"use strict";

class CustomItems {
	static handleCustomItems(database, core, config, itemConfig, itemData)
	{
		if (itemConfig["Items"][
			"punisher_slick",
			"punisher_bag",
			"punisher_rig",
			"punisher_slick_AE",
			"punisher_mask",
			"punisher_slick_2"
			]) {
            core.addItemRetexture("punisher_slick", itemData["punisher_slick"].BaseItemID, itemData["punisher_slick"].BundlePath, false, itemData["punisher_slick"].LootWeigthMult);
            core.addItemRetexture("punisher_bag", itemData["punisher_bag"].BaseItemID, itemData["punisher_bag"].BundlePath, false, itemData["punisher_bag"].LootWeigthMult);
            core.addItemRetexture("punisher_rig", itemData["punisher_rig"].BaseItemID, itemData["punisher_rig"].BundlePath, false, itemData["punisher_rig"].LootWeigthMult);
            core.addItemRetexture("punisher_slick_AE", itemData["punisher_slick_AE"].BaseItemID, itemData["punisher_slick_AE"].BundlePath, false, itemData["punisher_slick_AE"].LootWeigthMult);
            core.addItemRetexture("punisher_mask", itemData["punisher_mask"].BaseItemID, itemData["punisher_mask"].BundlePath, false, itemData["punisher_mask"].LootWeigthMult);
            core.addItemRetexture("punisher_slick_2", itemData["punisher_slick_2"].BaseItemID, itemData["punisher_slick_2"].BundlePath, false, itemData["punisher_slick_2"].LootWeigthMult);
			
			// add item to bots
			
			// add trade offer
			if (config.EnableTradeOffers)
                core.createTraderOffer("punisher_slick", "5935c25fb3acc3127c3d8cd9", "5696686a4bdc2da3298b456a", 1792, 1);
                core.createTraderOffer("punisher_bag", "5ac3b934156ae10c4430e83c", "5449016a4bdc2d6f028b456f", 32878, 1);
                core.createTraderOffer("punisher_rig", "5ac3b934156ae10c4430e83c", "5449016a4bdc2d6f028b456f", 24079, 1);
                core.createTraderOffer("punisher_slick_AE", "5935c25fb3acc3127c3d8cd9", "5696686a4bdc2da3298b456a", 1792, 1);
                core.createTraderOffer("punisher_slick_2", "5935c25fb3acc3127c3d8cd9", "5696686a4bdc2da3298b456a", 1792, 1);
                core.createTraderOffer("punisher_mask", "5ac3b934156ae10c4430e83c", "5449016a4bdc2d6f028b456f", 14079, 1);
		}
	}
}

module.exports = CustomItems;