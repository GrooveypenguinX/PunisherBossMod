/* eslint-disable @typescript-eslint/naming-convention */
import { VoiceConfig } from "./references/configConsts"; 
import * as fs from "fs";
import path from "path";
import { WTTInstanceManager } from "./WTTInstanceManager";
import { IDatabaseTables } from "@spt-aki/models/spt/server/IDatabaseTables";
import * as config from "../config/config.json";

export class PunisherVoice
{
    private Instance: WTTInstanceManager;

    configs: VoiceConfig;

    public preAkiLoad(Instance: WTTInstanceManager): void
    {
        this.Instance = Instance;
        this.configs = this.loadCombinedConfig();
    }

    public postDBLoad(): void 
    {
        if (this.Instance.debug)
        {
            console.log("Starting CustomVoiceService postDBLoad");
        }
        
        for (const voiceId in this.configs) 
        {
            if (this.Instance.debug)
            {
                console.log("Processing voice:", voiceId);
            }
            const voiceConfig = this.configs[voiceId];
            this.processVoiceConfig(this.Instance.database, voiceConfig, voiceId);
        }
        if (this.Instance.debug)
        {
            console.log("Finished postDBLoad");
        }
    }
    private loadCombinedConfig(): VoiceConfig 
    {
        if (this.Instance.debug)
        {
            console.log("Loading combined voice config");
        }
        const configFiles = fs.readdirSync(path.join(__dirname, "../db/voices"))
            .filter(file => file.endsWith(".json"));
    
        const combinedConfig: VoiceConfig = {};
    
        configFiles.forEach(file => 
        {
            const configPath = path.join(__dirname, "../db/voices", file);
            const configFileContents = fs.readFileSync(configPath, "utf-8");
            const config = JSON.parse(configFileContents) as VoiceConfig;
    
            Object.assign(combinedConfig, config);
        });
        if (this.Instance.debug)
        {
            console.log("Combined voiceconfig:", combinedConfig);
        }
        return combinedConfig;
    }
    /**
     * Processes the voice configuration by handling the locale,
     * creating and adding the voice to the player, and adding the
     * voice to the bots.
     *
     * @param {any} database - The database object.
     * @param {any} voiceConfig - The voice configuration object.
     * @return {void}
     */
    private processVoiceConfig(database: IDatabaseTables, voiceConfig: any, voiceId: string): void 
    {
        if (this.Instance.debug)
        {
            console.log("Processing voice config:", voiceConfig);
        }
        const { sideSpecificVoice, addVoiceToPlayer, locale } = voiceConfig;
        if (this.Instance.debug)
        {
            console.log("loading voice", voiceId);
            console.log("locale", locale);
        }
        // create voice and add to player optionally
        this.createAndAddVoice(database, voiceId, addVoiceToPlayer, sideSpecificVoice)

        // Handle locale
        this.handleLocale(database, locale)

    }

    private handleLocale(database: IDatabaseTables, locale: any): void 
    {
        if (this.Instance.debug)
        {
            console.log("Handling locale:", locale);
        }
        for (const localeID in database.locales.global) 
        {
            if (this.Instance.debug)
            {
                console.log("Processing localeID:", localeID);
            }
            try 
            {
                if (locale[localeID]) 
                {
                    for (const itemId in locale[localeID]) 
                    {
                        const itemName = `${itemId} Name`;
                        if (database.locales.global[localeID]) 
                        {
                            database.locales.global[localeID][itemName] = locale[localeID][itemId];
                        }
                    }
                }
                else 
                {
                    for (const itemId in locale.en) 
                    {
                        const itemName = `${itemId} Name`;
                        if (database.locales.global[localeID]) 
                        {
                            database.locales.global[localeID][itemName] = locale.en[itemId];
                        }
                    }
                }
            }
            catch (error) 
            {
                console.error(`Error handling locale for ${localeID}: ${error}`);
            }
        }
    }

    private createAndAddVoice(database: any, voiceId: string, addVoiceToPlayer: boolean, sideSpecificVoice?: any): void 
    {
        if (this.Instance.debug)
        {
            console.log("Creating and adding voice:", voiceId);
        }
        const newVoice = {
            "_id": voiceId,
            "_name": voiceId,
            "_parent": "5fc100cf95572123ae738483",
            "_type": "Item",
            "_props": {
                "Name": voiceId,
                "ShortName": voiceId,
                "Description": voiceId,
                "Side": sideSpecificVoice ?? ["Usec", "Bear"],
                "Prefab": voiceId
            }
        };
    
        database.templates.customization[voiceId] = newVoice;
        if (addVoiceToPlayer) 
        {
            database.templates.character.push(voiceId);
        }
        if (voiceId === "PunisherVoice" && config && config.playerSettings.addVoiceToPlayer) 
        {
            if (!database.templates.character.includes(voiceId))
            {
                database.templates.character.push(voiceId);
            }
        }
    }

    private processBotVoices(database: IDatabaseTables, addVoiceToBots: any): void 
    {
        for (const botConfig in addVoiceToBots) 
        {
            const botDb : any = database.bots.types[botConfig];
            if (botDb) 
            {
                const { addFollowingVoices, replaceDefaultOnes } = addVoiceToBots[botConfig];
                if (addFollowingVoices.length !== 0) 
                {
                    if (replaceDefaultOnes) 
                    {
                        botDb.appearance.voice = [];
                    }
                    // Map each voice to an object with the voice and its weight
                    const weightedVoices = addFollowingVoices.map((voice: string) => ({ voice, weight: 1 }));
                    // Push the weighted voices into botDb.appearance.voice
                    botDb.appearance.voice.push(...weightedVoices);
                }
            }
        }
    }
}
