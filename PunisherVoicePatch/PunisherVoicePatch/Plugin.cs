using System;
using BepInEx;
using UnityEngine;

namespace VoiceAdd
{

    [BepInPlugin("com.grooveypenguinx.basedonCWXVoiceAdder.punishervoicemod", "Punisher Voice Adder", "0.6.9")]
    public class Plugin : BaseUnityPlugin
    {

        private void Start()
        {
            new PunisherVoicePatch().Enable();
        }
    }
}