using System;
using System.Collections.Generic;
using Mono.Cecil;

namespace PunisherBossPreloader
{
    // Token: 0x02000003 RID: 3
    public static class WildSpawnTypePatch
    {
        // Token: 0x17000002 RID: 2
        // (get) Token: 0x06000005 RID: 5 RVA: 0x00002072 File Offset: 0x00000272
        public static IEnumerable<string> TargetDLLs { get; } = new string[]
        {
            "Assembly-CSharp.dll"
        };

        // Token: 0x06000006 RID: 6 RVA: 0x0000207C File Offset: 0x0000027C
        public static void Patch(ref AssemblyDefinition assembly)
        {
            TypeDefinition type = assembly.MainModule.GetType("EFT.WildSpawnType");
            FieldDefinition item = new FieldDefinition("bosspunisher", FieldAttributes.Public | FieldAttributes.Static | FieldAttributes.Literal | FieldAttributes.HasDefault, type)
            {
                Constant = bosspunisherValue
            };
            type.Fields.Add(item);
        }

        // Token: 0x04000003 RID: 3
        public static uint bosspunisherValue = 4206927U;
    }
}
