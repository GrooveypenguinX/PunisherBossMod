using System;
using System.Collections.Generic;
using BepInEx;
using EFT;
using HarmonyLib;

namespace PunisherBossPatch
{
    // Token: 0x02000002 RID: 2
    [BepInPlugin("com.grooveypenguinx.basedonSSHUSECCommander.punisherbossmodruntime", "Punisher Boss Patch", "0.6.9")]
    public class CustomNPCEntry : BaseUnityPlugin
    {
        // Token: 0x06000001 RID: 1 RVA: 0x00002050 File Offset: 0x00000250
        public void Awake()
        {
            Traverse.Create(typeof(BotSettingsRepoClass)).Field<Dictionary<WildSpawnType, BotSettingsValuesClass>>("dictionary_0").Value.Add((WildSpawnType)4206927, new BotSettingsValuesClass(true, false, true, "ScavRole/Boss", ETagStatus.Solo));
        }
    }
}
