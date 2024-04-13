/* eslint-disable @typescript-eslint/naming-convention */
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { IPmcData } from "@spt-aki/models/eft/common/IPmcData";
import { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes";
import { IBotConfig } from "@spt-aki/models/spt/config/IBotConfig";
import * as bosspunisher from "../db/bots/types/bosspunisher.json";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { BossLocationSpawn } from "@spt-aki/models/eft/common/ILocationBase";
import { WTTInstanceManager } from "src/WTTInstanceManager";
import * as fs from "fs";
import * as path from "path";
import { LogTextColor } from "@spt-aki/models/spt/logging/LogTextColor";
import * as config from "../config/config.json";

export class PunisherBoss 
{
    public Instance: WTTInstanceManager;
    public static readonly spawnChanceDefault = 1;
    public static readonly spawnChanceIncrement = .5;
    public static sessionID: string;
    public static profileID: string;
    public static punisherSpawnChance: number;
    public static modName = "PunisherBoss";
    public static databaseServer: DatabaseServer;
    public static modFolder = path.join(__dirname, "..");
    public static progressRecord: {
        SessionID: string;
        successfulConsecutiveRaids: number;
        failedConsecutiveRaids: number;
        actualPunisherChance: number;
    };

    logger: ILogger;
    public static initialSetup = false;
    public preAkiLoad(Instance: WTTInstanceManager): void 
    {
        this.Instance = Instance;
        try 
        {
            this.Instance.staticRouter.registerStaticRouter(
                `${PunisherBoss.modName}:ProfileSelected`,
                [
                    {
                        url: "/client/game/profile/select",
                        action: (url, info, sessionId, output) => 
                        {
                            PunisherBoss.sessionID = sessionId;
                            PunisherBoss.profileID = info.uid;
                            if (this.Instance.debug) 
                            {
                                console.log(`[${this.Instance.modName}] Profile ID: ${PunisherBoss.profileID}`);
                            }

                            if (!PunisherBoss.initialSetup) 
                            {
                                const pmcProfileLevel = this.Instance.profileHelper.getProfileByPmcId(PunisherBoss.profileID).Info.Level;

                                if (
                                    config.punisherSettings.minimumPlayerLevelBeforeSpawn != null &&
                                    pmcProfileLevel != null &&
                                    pmcProfileLevel < config.punisherSettings.minimumPlayerLevelBeforeSpawn
                                ) 
                                {
                                    console.log("Player level is below the required level for Punisher Boss spawn.");
                                    this.setupBossSettings();
                                    PunisherBoss.punisherSpawnChance = 0;
                                }
                                else 
                                {
                                    if (config.punisherSettings.overridePunisherSpawnChance != null) 
                                    {
                                        PunisherBoss.punisherSpawnChance = config.punisherSettings.overridePunisherSpawnChance;
                                    }
                                    else 
                                    {
                                        this.readPunisherSpawnChance();
                                    }
                                    this.setupBossSettings();
                                    this.setBossSpawnLocations();
                                }
                                PunisherBoss.initialSetup = true;
                            }
                            return output;
                        }
                    }
                ],
                "aki"
            );

            this.Instance.staticRouter.registerStaticRouter(
                `${PunisherBoss.modName}:RaidSaved`,
                [
                    {
                        url: "/raid/profile/save",
                        action: (url, info, sessionId, output) => 
                        {
                            const pmcData: IPmcData = info.profile;

                            if (this.Instance.debug) 
                            {
                                this.Instance.logger.log(`Info: ${JSON.stringify(info)}`, LogTextColor.GREEN);

                                if (pmcData.Stats.Eft.Victims && pmcData.Stats.Eft.Aggressor) 
                                {
                                    pmcData.Stats.Eft.Victims.forEach(victim => 
                                    {
                                        this.Instance.logger.log(`Victims: ${victim.Name}`, LogTextColor.GREEN);
                                    });
                                    this.Instance.logger.log(`Aggressor: ${pmcData.Stats.Eft.Aggressor.Name}`, LogTextColor.GREEN);
                                }
                                else 
                                {
                                    this.Instance.logger.log("Victims or Aggressor array is not present in the profile.", LogTextColor.RED);
                                }
                            }

                            PunisherBoss.profileID = pmcData._id;

                            const pmcProfileLevel = this.Instance.profileHelper.getProfileByPmcId(PunisherBoss.profileID).Info.Level;

                            if (
                                config.punisherSettings.minimumPlayerLevelBeforeSpawn != null &&
                                pmcProfileLevel != null &&
                                pmcProfileLevel < config.punisherSettings.minimumPlayerLevelBeforeSpawn
                            ) 
                            {
                                console.log("Player level is below the required level for Punisher Boss spawn.");
                                PunisherBoss.punisherSpawnChance = 0;
                            }
                            else 
                            {
                                this.removeBossSpawnFromMaps();
                                if (config.punisherSettings.overridePunisherSpawnChance != null) 
                                {
                                    PunisherBoss.punisherSpawnChance = config.punisherSettings.overridePunisherSpawnChance;
                                    this.setBossSpawnLocations();
                                }
                                else 
                                {
                                    this.readPunisherSpawnChance();
                                    this.onRaidSave(url, info, sessionId, output);
                                    this.setBossSpawnLocations();
                                }
                            }
                            return output;
                        }
                    }
                ],
                "aki"
            );

        }
        catch (error) 
        {
            this.Instance.logger.error(error);
        }
    }


    public readPunisherSpawnChance(): void 
    {
        try 
        {

            const progressFilePath = `${PunisherBoss.modFolder}/profiles/${PunisherBoss.profileID}/progress.json`;

            if (fs.existsSync(progressFilePath)) 
            {
                if (this.Instance.debug) 
                {
                    this.Instance.logger.log("Progress file exists, loading...", LogTextColor.GREEN);
                }

                PunisherBoss.progressRecord = this.readFile(progressFilePath);

                if (PunisherBoss.progressRecord && PunisherBoss.progressRecord.actualPunisherChance > 100) 
                {
                    if (this.Instance.debug) 
                    {
                        this.Instance.logger.log("Loaded spawn chance exceeds the maximum limit, setting to 100.", LogTextColor.RED);

                    }
                    PunisherBoss.progressRecord.actualPunisherChance = 100;
                }
                else if (PunisherBoss.progressRecord && PunisherBoss.progressRecord.actualPunisherChance < 1) 
                {
                    if (this.Instance.debug) 
                    {
                        this.Instance.logger.log("Loaded spawn chance is less than 1, setting to 1.", LogTextColor.RED);

                    }
                    PunisherBoss.progressRecord.actualPunisherChance = 1;
                }

                this.saveToFile(PunisherBoss.progressRecord, progressFilePath);
                PunisherBoss.punisherSpawnChance = PunisherBoss.progressRecord.actualPunisherChance;
                if (this.Instance.debug) 
                {
                    this.Instance.logger.log("Progress file updated.", LogTextColor.GREEN);

                    this.Instance.logger.log(`Progress file loaded: ${PunisherBoss.progressRecord}`, LogTextColor.GREEN);
                }

            }
            else 
            {
                this.Instance.logger.log(`[${this.Instance.modName}] Punisher: Progress file does not exist. This is Normal.`, LogTextColor.YELLOW);
            }
        }
        catch (error) 
        {
            console.error(`[${this.Instance.modName}] Punisher: An error occurred in readPunisherSpawnChance:`, error);
        }
    }

    public removeBossSpawnFromMaps(): void 
    {
        const removedLocations = [];

        for (const location of Object.values(this.Instance.database.locations)) 
        {
            if (location.base) 
            {
                const removedSpawns = location.base.BossLocationSpawn.filter(spawn => spawn.BossName === "bosspunisher");
                location.base.BossLocationSpawn = location.base.BossLocationSpawn.filter(spawn => spawn.BossName !== "bosspunisher");

                if (removedSpawns.length > 0) 
                {
                    removedLocations.push({
                        map: location.base.Id,
                        zones: removedSpawns.map(spawn => spawn.BossZone)
                    });
                }
            }
        }

        if (removedLocations.length > 0) 
        {
            if (this.Instance.debug) 
            {
                this.Instance.logger.log(`[${this.Instance.modName}] Punisher: Removed bosspunisherSpawn from the following maps and zones:`, LogTextColor.GREEN);
                for (const removedLocation of removedLocations) 
                {
                    const { map, zones } = removedLocation;
                    if (this.Instance.debug) 
                    {
                        console.debug(`- Map: ${map}, Zones: ${zones.join(", ")}`);
                    }
                }
            }

        }
        else 
        {
            if (this.Instance.debug) 
            {
                this.Instance.logger.log("No bosspunisherSpawn found in any maps and zones.", LogTextColor.GREEN);
            }
        }
    }

    public setupBossSettings(): void 
    {
        const botConfig = this.Instance.configServer.getConfig<IBotConfig>(ConfigTypes.BOT);
        const batch: any = botConfig.presetBatch;
        const stupidfuckingbotsettings = {
            "nvgIsActiveChanceDayPercent": 10,
            "nvgIsActiveChanceNightPercent": 90,
            "faceShieldIsActiveChancePercent": 100,
            "lightIsActiveDayChancePercent": 25,
            "lightIsActiveNightChancePercent": 90,
            "weaponSightWhitelist": {},
            "laserIsActiveChancePercent": 85,
            "randomisation": [],
            "blacklist": [],
            "whitelist": [],
            "weightingAdjustmentsByPlayerLevel": [],
            "weightingAdjustmentsByBotLevel": [],
            "forceStock": false,
            "weaponModLimits": {
                "scopeLimit": 1,
                "lightLaserLimit": 1
            }
        };

        botConfig.equipment["bosspunisher"] = stupidfuckingbotsettings;
        batch.bosspunisher = 8;
        botConfig.bosses.push("bosspunisher");
        botConfig.itemSpawnLimits["bosspunisher"] = {};
        this.Instance.database.bots.types["bosspunisher"] = this.Instance.jsonUtil.deserialize(this.Instance.jsonUtil.serialize(bosspunisher));


    }

    public setBossSpawnLocations(): void 
    {
        let bosspunisherSpawn: BossLocationSpawn = {
            BossChance: PunisherBoss.punisherSpawnChance ?? 1,
            BossDifficult: "impossible",
            BossEscortAmount: "2",
            BossEscortDifficult: "impossible",
            BossEscortType: "exUsec",
            BossName: "bosspunisher",
            BossPlayer: false,
            BossZone: "?",
            RandomTimeSpawn: false,
            Time: -1,
            TriggerId: "",
            TriggerName: ""
        };
        if (this.Instance.debug) 
        {
            this.Instance.logger.log(`Punisher BossChance: ${bosspunisherSpawn.BossChance}`, LogTextColor.GREEN);
        }
        for (const location of Object.values(this.Instance.database.locations)) 
        {
            if (location.base) 
            {
                const zonesString = location.base.Id === "factory4_night" ? this.Instance.database.locations.factory4_day.base.OpenZones : location.base.OpenZones;
                if (!zonesString) 
                {
                    continue;
                }

                const foundOpenZones = zonesString
                    .split(",")
                    .map(zone => zone.trim())
                    .filter(zone => zone && !zone.includes("Snipe"));

                if (foundOpenZones.length === 0) 
                {
                    continue;
                }

                const randomIndex = Math.floor(Math.random() * foundOpenZones.length);
                const randomZone = foundOpenZones[randomIndex];

                bosspunisherSpawn = {
                    ...bosspunisherSpawn,
                    BossZone: randomZone
                };

                location.base.BossLocationSpawn.push(bosspunisherSpawn);
                if (this.Instance.debug) 
                {
                    this.Instance.logger.log(`Added The Punisher to map: ${location.base.Id} zone: ${randomZone}`, LogTextColor.GREEN);
                }
            }
        }
    }

    public saveToFile(data: any, filePath: string): void 
    {
        try 
        {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
            if (this.Instance.debug) 
            {
                this.Instance.logger.log("Data written successfully!", LogTextColor.GREEN);
            }
        }
        catch (error) 
        {
            console.error("Error writing data: " + error);
        }
    }


    public createProgressFile(
        successful: number,
        failed: number,
        sessionID: string,
        punisherSpawnChance: number
    ): void 
    {
        const progressFile = PunisherBoss.progressRecord = {
            SessionID: sessionID,
            successfulConsecutiveRaids: successful,
            failedConsecutiveRaids: failed,
            actualPunisherChance: punisherSpawnChance
        };

        const profileFolderPath = `${PunisherBoss.modFolder}/profiles/${PunisherBoss.profileID}`;
        if (!fs.existsSync(profileFolderPath)) 
        {
            fs.mkdirSync(profileFolderPath, { recursive: true });
        }

        this.saveToFile(progressFile, `${profileFolderPath}/progress.json`);
        PunisherBoss.progressRecord = progressFile;
    }
    readFile(filePath: string): any 
    {
        try 
        {
            const jsonString = fs.readFileSync(filePath, "utf-8");
            const decryptedData = JSON.parse(jsonString);
            return decryptedData;
        }
        catch (err) 
        {
            this.Instance.logger.log(`No file exists at: ${filePath}. This is Normal`, LogTextColor.GREEN);
            return null;
        }
    }

    public onRaidSave(url: string, info: any, sessionId: string, output: any): void 
    {
        if (PunisherBoss.progressRecord && info.exit === "Left") 
        {
            return;
        }
        try 
        {
            if (this.Instance.debug) 
            {
                this.Instance.logger.log("Punisher onRaidSave started", LogTextColor.GREEN);
            }

            let successfulConsecutiveRaids = 0;
            let failedConsecutiveRaids = 0;
            let punisherSpawnChance = 1;

            if (!PunisherBoss.progressRecord) 
            {
                this.Instance.logger.log("Progress file not found, creating new file", LogTextColor.GREEN);
                this.createProgressFile(0, 0, sessionId, 5);
                PunisherBoss.progressRecord = this.readFile(
                    `${PunisherBoss.modFolder}/profiles/${PunisherBoss.profileID}/progress.json`
                );
                if (this.Instance.debug) 
                {
                    this.Instance.logger.log(`After progress file creation: ${PunisherBoss.progressRecord.SessionID} ${PunisherBoss.progressRecord.actualPunisherChance} ${PunisherBoss.progressRecord.failedConsecutiveRaids} ${PunisherBoss.progressRecord.successfulConsecutiveRaids}`, LogTextColor.GREEN);
                }
            }
            else 
            {
                successfulConsecutiveRaids = PunisherBoss.progressRecord.successfulConsecutiveRaids;
                failedConsecutiveRaids = PunisherBoss.progressRecord.failedConsecutiveRaids;
                punisherSpawnChance = PunisherBoss.progressRecord.actualPunisherChance;
                if (this.Instance.debug) 
                {
                    this.Instance.logger.log(`Initial progress file: ${successfulConsecutiveRaids} ${failedConsecutiveRaids} ${punisherSpawnChance}`, LogTextColor.GREEN);

                }
            }

            if (PunisherBoss.progressRecord && info.exit === "survived") 
            {
                successfulConsecutiveRaids++;
                failedConsecutiveRaids = 0;
                punisherSpawnChance += (PunisherBoss.spawnChanceIncrement * successfulConsecutiveRaids);
                if (this.Instance.debug) 
                {
                    this.Instance.logger.log("You survived the raid! But someone noticed you leaving...", LogTextColor.GREEN);
                }
            }
            else if (PunisherBoss.progressRecord && info.exit === "killed") 
            {
                failedConsecutiveRaids++;
                successfulConsecutiveRaids = 0;
                punisherSpawnChance -= (PunisherBoss.spawnChanceIncrement * failedConsecutiveRaids);
                if (this.Instance.debug) 
                {
                    this.Instance.logger.log("You didn't make it to extract. Shit luck.", LogTextColor.GREEN);

                }
            }
            else if (PunisherBoss.progressRecord && info.exit === "runner") 
            {
                punisherSpawnChance += PunisherBoss.spawnChanceIncrement;
                if (this.Instance.debug) 
                {
                    this.Instance.logger.log("Runner Status. Your raid was not counted.", LogTextColor.GREEN);
                }
            }
            const pmcData: IPmcData = info.profile;
            const victimRoles = pmcData.Stats.Eft.Victims?.map(victim => victim.Role.toLowerCase());
            const aggressorName = pmcData.Stats.Eft.Aggressor?.Name?.toLowerCase();

            if (victimRoles?.includes("bosspunisher")) 
            {
                punisherSpawnChance /= 4; // Reduce spawn chance by 1/4
                if (this.Instance.debug) 
                {
                    this.Instance.logger.log("You gatted the Punisher down!", LogTextColor.GREEN);
                }
            }
            else 
            {
                if (this.Instance.debug) 
                {
                    this.Instance.logger.log("Couldn't find bosspunisher in victims", LogTextColor.GREEN);
                }
            }

            if (victimRoles?.includes("exusec")) 
            {
                const exusecVictims = victimRoles.filter(role => role === "exusec");
                const exusecCount = exusecVictims.length;
                punisherSpawnChance += PunisherBoss.spawnChanceIncrement * exusecCount;
                if (this.Instance.debug) 
                {
                    this.Instance.logger.log(`The more Rogues you kill, the more you're gonna piss off Frank... Killed ${exusecCount} exusec.`, LogTextColor.GREEN);

                }
            }
            else 
            {
                if (this.Instance.debug) 
                {
                    this.Instance.logger.log("Couldn't find exusec in victims", LogTextColor.GREEN);
                }
            }

            if (aggressorName === "frank castle") 
            {
                punisherSpawnChance = PunisherBoss.spawnChanceDefault; // Reset spawn chance to default
                if (this.Instance.debug) 
                {
                    this.Instance.logger.log("The Punisher always gets his vengeance.", LogTextColor.GREEN);

                }
            }
            else 
            {
                if (this.Instance.debug) 
                {
                    this.Instance.logger.log("Couldn't find Frank Castle in aggressor", LogTextColor.GREEN);
                }
            }
            if (punisherSpawnChance > 100) 
            {
                punisherSpawnChance = 100;
            }
            if (punisherSpawnChance < 1) 
            {
                punisherSpawnChance = 1;
            }

            if (PunisherBoss.progressRecord) 
            {
                if (this.Instance.debug) 
                {
                    this.Instance.logger.log(`Updated progress file: {SuccessfulConsecutiveRaids: ${successfulConsecutiveRaids} FailedConsecutiveRaids: ${failedConsecutiveRaids} actualPunisherChance: ${punisherSpawnChance}}`, LogTextColor.GREEN);
                }
                this.createProgressFile(successfulConsecutiveRaids, failedConsecutiveRaids, sessionId, punisherSpawnChance);
                PunisherBoss.punisherSpawnChance = punisherSpawnChance;
                if (this.Instance.debug) 
                {
                    this.Instance.logger.log("ProgressFile created successfully!", LogTextColor.GREEN);
                }
            }

            return output;
        }
        catch (error) 
        {
            console.error("An error occurred in onRaidSave:", error);
            return output;
        }
    }
}
