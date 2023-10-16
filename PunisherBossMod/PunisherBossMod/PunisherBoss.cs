using System;
using System.Collections.Generic;
using BepInEx;
using EFT;
using HarmonyLib;

namespace PunisherBossPatch
{

    [BepInPlugin("com.grooveypenguinx.basedonSSHUSECCommander.punisherbossmodruntime", "Punisher Boss Patch", "0.6.9")]
    public class CustomNPCEntry : BaseUnityPlugin
    {

        public void Awake()
        {
            Traverse.Create(typeof(BotSettingsRepoClass)).Field<Dictionary<WildSpawnType, BotSettingsValuesClass>>("dictionary_0").Value.Add((WildSpawnType)4206927, new BotSettingsValuesClass(true, false, true, "ScavRole/Boss", ETagStatus.Solo));
        }
    }
}
