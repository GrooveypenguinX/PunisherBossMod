/* eslint-disable @typescript-eslint/naming-convention */
import { ICustomizationItem } from "@spt-aki/models/eft/common/tables/ICustomizationItem";
import { WTTInstanceManager } from "./WTTInstanceManager";
import * as fs from "fs";
import * as path from "path";
import * as config from "../config/config.json";

export class PunisherHead 
{
    private Instance: WTTInstanceManager;

    public preAkiLoad(Instance: WTTInstanceManager): void 
    {
        this.Instance = Instance;
    }

    public postDBLoad(): void 
    {
        const headsJsonPath = path.join(__dirname, "../db/heads");

        const jsonFiles = fs.readdirSync(headsJsonPath).filter(file => file.endsWith(".json"));

        jsonFiles.forEach(jsonFile => 
        {
            const filePath = path.join(headsJsonPath, jsonFile);
            try 
            {
                const headConfigs = this.readJsonFile(filePath);

                if (Array.isArray(headConfigs)) 
                {
                    // Process array of head configurations
                    console.log(`Processing array of head configurations: ${jsonFile}`);
                    this.processHeadConfigs(headConfigs, this.Instance.database);
                }
                else if (typeof headConfigs === "object") 
                {
                    // Process single head configuration object
                    console.log(`Processing object head configuration: ${jsonFile}`);
                    this.processHeadConfigs([headConfigs], this.Instance.database);
                }
                else 
                {
                    console.error(`Error processing ${jsonFile}: Invalid format.`);
                }
            }
            catch (error) 
            {
                console.error(`Error processing ${jsonFile}:`, error);
            }
        });
    }

    private readJsonFile(filePath: string): any[] 
    {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        return JSON.parse(fileContent);
    }

    private processHeadConfigs(headConfigs: any, tables: any) 
    {
        if (Array.isArray(headConfigs)) 
        {
            headConfigs.forEach(headConfig => 
            {
                const headSpecificConfig = this.generateHeadSpecificConfig(headConfig);
                const { _id: headId } = headSpecificConfig.head;

                this.addHeadToTemplates(headId, tables.templates, headSpecificConfig);
                this.addHeadLocale(headSpecificConfig.headlocale, tables.locales.global);
            });
        }
        else if (typeof headConfigs === "object") 
        {
            const headSpecificConfig = this.generateHeadSpecificConfig(headConfigs);
            const { _id: headId } = headSpecificConfig.head;

            this.addHeadToTemplates(headId, tables.templates, headSpecificConfig);
            this.addHeadLocale(headSpecificConfig.headlocale, tables.locales.global);
        }
        else 
        {
            console.error("Error processing head configurations: Invalid format.");
        }
    }

    private generateHeadSpecificConfig(commonConfig: any): any 
    {
        const path = commonConfig.Path ? commonConfig.Path : `heads/${commonConfig.ID}.bundle`;

        return {
            config: {
                addheadtoplayer: commonConfig.AddtoPlayer
            },
            head: {
                _id: commonConfig.ID,
                _name: commonConfig.ID,
                _parent: "5cc085e214c02e000c6bea67",
                _type: "Item",
                _props: {
                    Name: commonConfig.Name,
                    ShortName: commonConfig.Shortname,
                    Description: commonConfig.Description,
                    Side: commonConfig.Side,
                    BodyPart: "Head",
                    Prefab: {
                        path: path,
                        rcid: ""
                    },
                    WatchPrefab: {
                        path: "",
                        rcid: ""
                    },
                    IntegratedArmorVest: false,
                    WatchPosition: { x: 0, y: 0, z: 0 },
                    WatchRotation: { x: 0, y: 0, z: 0 }
                }
            },
            headlocale: {
                id: commonConfig.ID,
                Name: commonConfig.Name,
                ShortName: commonConfig.Shortname,
                Description: commonConfig.Description
            }
        };
    }

    private addHeadToTemplates(
        headId: string,
        templates: any,
        headSpecificConfig: any
    ) 
    {
        templates.customization[headId] = headSpecificConfig.head as ICustomizationItem;
        
        if (headSpecificConfig.config.addheadtoplayer) 
        {
            templates.character.push(headId);
        }
        
        // Checking if headId is 'punisherhead' or 'punisherhead2' and if the configuration allows adding head to player
        if ((headId === "punisherhead" || headId === "punisherhead2") && config && config.playerSettings.addHeadToPlayer) 
        {
            if (!templates.character.includes(headId))
            {
                templates.character.push(headId);
            }
        }
    }
    

    private addHeadLocale(headlocale: any, globalLocales: any) 
    {
        if (!headlocale) return;

        const { id: localeId, ...localeData } = headlocale;

        for (const locale of Object.values(globalLocales)) 
        {
            for (const key in localeData) 
            {
                locale[`${localeId} ${key}`] = localeData[key];
            }
        }
    }
}
