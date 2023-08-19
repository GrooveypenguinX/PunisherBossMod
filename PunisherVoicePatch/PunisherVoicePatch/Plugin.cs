using System;
using BepInEx;
using UnityEngine;

namespace VoiceAdd
{
    // Token: 0x02000004 RID: 4
    [BepInPlugin("com.grooveypenguinx.basedonCWXVoiceAdder.punishervoicemod", "Punisher Voice Adder", "0.6.9")]
    public class Plugin : BaseUnityPlugin
    {
        // Token: 0x06000003 RID: 3 RVA: 0x00002069 File Offset: 0x00000269
        private void Start()
        {
            new PunisherVoicePatch().Enable();
        }
    }
}