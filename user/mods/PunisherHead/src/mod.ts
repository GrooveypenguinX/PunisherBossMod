/* eslint-disable @typescript-eslint/brace-style */
/* eslint-disable @typescript-eslint/no-var-requires */
import { DependencyContainer } from "tsyringe";
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";

// Jon Bernthal
import * as punisherhead from "../db/punisherhead.json"
import * as config from "../config/config.json"
const punisherhead_locale = require("../db/punisherhead_locale.json");

import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { IDatabaseTables } from "@spt-aki/models/spt/server/IDatabaseTables";

import { ICustomizationItem } from "@spt-aki/models/eft/common/tables/ICustomizationItem";

class JonBernthal implements IPostDBLoadMod {
    mod: string
    logger: ILogger;

    constructor() {
        this.mod = "servph-punisher";
    }
    public postDBLoad(container: DependencyContainer): void {
        const tables = container.resolve<DatabaseServer>("DatabaseServer").getTables();
        // Jon B
        tables.templates.customization[punisherhead._id] = punisherhead as ICustomizationItem
        // add "punisherhead" to the characters templates
        if (config.addheadtoplayer) {
            tables.templates.character.push(punisherhead._id);
        }
        

        const localesToRegister = [
            punisherhead_locale
        ];

        // Add custom locales
        for (const locale of Object.values(tables.locales.global)) {
            for (const localeToRegister of localesToRegister) {
                const id = localeToRegister["id"];
                for (const key in localeToRegister) {
                    locale[`${id} ${key}`] = localeToRegister[key];
                }
            }
        }
    }

}

module.exports = { mod: new JonBernthal() }