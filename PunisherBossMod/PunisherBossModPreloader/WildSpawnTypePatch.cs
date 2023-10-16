using System;
using System.Collections.Generic;
using Mono.Cecil;

namespace PunisherBossPreloader
{

    public static class WildSpawnTypePatch
    {

        public static IEnumerable<string> TargetDLLs { get; } = new string[]
        {
            "Assembly-CSharp.dll"
        };


        public static void Patch(ref AssemblyDefinition assembly)
        {
            TypeDefinition type = assembly.MainModule.GetType("EFT.WildSpawnType");
            FieldDefinition item = new FieldDefinition("bosspunisher", FieldAttributes.Public | FieldAttributes.Static | FieldAttributes.Literal | FieldAttributes.HasDefault, type)
            {
                Constant = bosspunisherValue
            };
            type.Fields.Add(item);
        }

        public static uint bosspunisherValue = 4206927U;
    }
}
