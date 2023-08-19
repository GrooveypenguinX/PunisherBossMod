# PunisherBossMod
A mod for SPT-AKI that adds Frank Castle "The Punisher" to the game as a new boss



Soft Requirements:

KRISS Vector .308: https://hub.sp-tarkov.com/files/file/1160-kriss-vector-308-assault-rifle/

Benelli M4 Super 90 [M1014]: https://hub.sp-tarkov.com/files/file/245-benelli-m4-super-90-m1014/

- The Punisher by default has a loadout with the Vector .308 and the Benelli M1014. The reason these are listed as "soft requirements" is because I've included an optional folder to revert Punisher to base game weapons, just in case you're a Jabroni who doesn't want cool guns in your game.



Installation Instructions:

1. Have a working version of SPT. This might work for earlier version, but for any early version there is NO GUARUNTEE and it WILL NOT BE SUPPORTED. Use the latest versions guys, it's not rocket science to update your game lol.

2. 

2. Install KRISS Vector .308 and Benelli M4 Super 90 [M1014] from the SPT-HUB (see links above)

      2a. If you opt to NOT use the modded guns, see step OPTIONAL NO MODDED GUNS below.

3. Drag the users and Bepinex folders from the downloaded zip to your main SPT install location. If you did everything right you should have 4 mods in your users/mods folder (PunisherHead, PunisherGear, PunisherBoss and zzPunisherVoice), and three new .DLL's in your Bepinex folders: two plugins in BepinEx/Plugins (PunisherVoicePatch.dll and PunisherBoss.dll) and one in your BepinEx/patchers folder (PunisherBossPreloader.dll)


OPTIONAL NO MODDED GUNS:

      - If you opt to NOT use the modded guns, open the OPTIONAL_NO_MODDED_GUNZ folder and drag the users folder into your main SPT install location and override the files. This is replaceing the package.json to not            require the new guns, and changing the bosspunisher.json to a new loadout.



That's it! As long as you have the requirements, you should now have The Punisher installed and ready to roll. 


Uninstall Instructions:

To remove this mod FULLY:
1. Delete all four folder in users/mods (PunisherGear, PunisherHead, PunisherBoss and zzPunisherVoice)
2. Delete PunisherBossPreloaded.dll in BepinEx/patchers
3. Delete PunisherBossMod.dll in BepinEx/Plugins
4. Remove all references to punisher in your profile .json

That should do it!



OPTIONAL CONFIGS:

PunisherHead: If you wish to use the JonBernthal head on the player, open the config/config.json and change addheadtoplayer to true.

zzPunisherVoice: If you wish to use the Punisher voice lines on the player, open the config/playervoiceconfig.json and change AddVoiceToPlayer to true. 

- WARNING: This voice pack is very incomplete, a lot of player lines are missing/not used, and a few lines are repeated so the punisher boss doesn't spam the same exact line every time.
- Therefore it is NOT RECOMMENDED you use this voice pack on the player. I added this option purely for testing and meme purposes lol.
