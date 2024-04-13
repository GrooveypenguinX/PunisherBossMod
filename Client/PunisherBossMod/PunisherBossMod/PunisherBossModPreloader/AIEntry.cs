using System;
using BepInEx;

namespace PunisherBossPreloader
{

    [BepInPlugin("com.grooveypenguinx.basedonSSHUSECCommander.punisherbossmodpreloader", "Punisher Boss Preloader Patch", "0.6.9")]
    public class AIEntry : BaseUnityPlugin
    {

        public static AIEntry Instance { get; private set; }


        public void Awake()
        {
            AIEntry.Instance = this;
        }
    }
}
