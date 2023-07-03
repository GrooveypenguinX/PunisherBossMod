# PunisherBossMod
A mod for SPT-AKI that adds Frank Castle "The Punisher" to the game as a new boss

This mod has one hard requirement, and two soft requirements.

Hard Requirement:

JustNU Core:  https://hub.sp-tarkov.com/files/file/378-justnu-core/

- Without JustNU Core the Punisher's gear will not be added.



Soft Requirements:

KRISS Vector .308: https://hub.sp-tarkov.com/files/file/1160-kriss-vector-308-assault-rifle/

Benelli M4 Super 90 [M1014]: https://hub.sp-tarkov.com/files/file/245-benelli-m4-super-90-m1014/

- The Punisher by default has a loadout with the Vector .308 and the Benelli M1014. The reason these are listed as "soft requirements" is because I've included an optional folder to revert Punisher to basegame weapons, just in case you're a Jabroni who doesn't want cool guns in your game.



Installation Instructions:

1. Have a working version of SPT-3.5.7 or SPT 3.5.8 (This might work for earlier version but for any early version there is NO GUARUNTEE AND IT WILL NOT BE SUPPORTED. Use the latest versions guys, it's not rocket science to update your game lol).

2. Install JustNu Core from the SPT-HUB (see link above)

3. Install KRISS Vector .308 and Benelli M4 Super 90 [M1014] from the SPT-HUB (see links above)

      3a. If you choose to NOT use the modded guns, see step 4a.

4. Drag the users and Bepinex folders to your main SPT install location. If you did everything right you should have 4 mods in your users/mods folder (PunisherHead, PunisherGear, zPunisherBoss and zzPunisherVoice), and three new .DLL's in your Bepinex folder, two plugins in BepinEx/Plugins (PunisherVoicePatch.dll and PunisherBoss.dll) and one in your BepinEx/patchers folder (PunisherBossPreloader.dll)

      4a. If you choose to NOT use the modded guns, open the OPTIONAL_NO_MODDED_GUNS folder and drag the users folder into your main SPT install location and override the files. This is replaceing the package.json to not            require the new guns, and changing the bosspunisher.json to a new loadout.



That's it! As long as you have the requirements, you should now have The Punisher installed and ready to roll. 


OPTIONAL CONFIGS:

PunisherHead: If you wish to use the JonBernthal head on the player, open the config/config.json and change addheadtoplayer to true.

zzPunisherVoice: If you wish to use the Punisher voice lines on the player, open the config/playervoiceconfig.json and change AddVoiceToPlayer to true. WARNING: This voice pack is very incomplete, a lot of player lines are missing/not used, and a few lines are repeated so the punisher boss doesn't spam the same exact line every time, therefore it is NOT RECOMMENDED you use this voice pack on the player. I added this option purely for testing and meme purposes lol.
