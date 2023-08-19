using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using Aki.Reflection.Patching;
using Aki.Reflection.Utils;
using HarmonyLib;
using Newtonsoft.Json;

namespace VoiceAdd
{
    // Token: 0x02000005 RID: 5
    public class PunisherVoicePatch : ModulePatch
    {
        // Token: 0x06000005 RID: 5 RVA: 0x00002080 File Offset: 0x00000280
        public PunisherVoicePatch()
        {
            PunisherVoicePatch._targetType = Enumerable.Single<Type>(PatchConstants.EftTypes, new Func<Type, bool>(this.IsTargetType));
        }

        // Token: 0x06000006 RID: 6 RVA: 0x000020A8 File Offset: 0x000002A8
        private bool IsTargetType(Type type)
        {
            return type.GetMethod("TakePhrasePath") != null;
        }

        // Token: 0x06000007 RID: 7 RVA: 0x000020CC File Offset: 0x000002CC
        protected override MethodBase GetTargetMethod()
        {
            return PunisherVoicePatch._targetType.GetMethod("TakePhrasePath");
        }

        // Token: 0x06000008 RID: 8 RVA: 0x000020F0 File Offset: 0x000002F0
        [PatchPrefix]
        private static void PatchPrefix()
        {
            string text = new StreamReader("./user/mods/zzPunisherVoice/voices.json").ReadToEnd();
            Dictionary<string, string> dictionary = JsonConvert.DeserializeObject<Dictionary<string, string>>(text);
            Dictionary<string, string> value = Traverse.Create(PunisherVoicePatch._targetType).Field<Dictionary<string, string>>("dictionary_0").Value;
            foreach (string key in dictionary.Keys)
            {
                string value2;
                dictionary.TryGetValue(key, out value2);
                bool flag = !value.ContainsKey(key);
                bool flag2 = flag;
                if (flag2)
                {
                    value.Add(key, value2);
                }
            }
        }

        // Token: 0x04000002 RID: 2
        private static Type _targetType;
    }
}
