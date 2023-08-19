using System;
using BepInEx;

namespace PunisherBossPreloader
{
    // Token: 0x02000002 RID: 2
    [BepInPlugin("com.grooveypenguinx.basedonSSHUSECCommander.punisherbossmodpreloader", "Punisher Boss Preloader Patch", "0.6.9")]
    public class AIEntry : BaseUnityPlugin
    {
        // Token: 0x17000001 RID: 1
        // (get) Token: 0x06000001 RID: 1 RVA: 0x00002050 File Offset: 0x00000250
        // (set) Token: 0x06000002 RID: 2 RVA: 0x00002057 File Offset: 0x00000257
        public static AIEntry Instance { get; private set; }

        // Token: 0x06000003 RID: 3 RVA: 0x0000205F File Offset: 0x0000025F
        public void Awake()
        {
            AIEntry.Instance = this;
        }
    }
}
