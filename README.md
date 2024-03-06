# PunisherBossMod
A mod for SPT-AKI that adds Frank Castle "The Punisher" to the game as a new boss



Installation Instructions:

1. Have a working version of SPT. This might work for earlier version, but for any early version there is NO GUARUNTEE and it WILL NOT BE SUPPORTED. Use the latest versions guys, it's not rocket science to update your game lol.

2. Drag the users and Bepinex folders from the downloaded zip to your main SPT install location. If you did everything right you should have 4 mods in your users/mods folder (PunisherHead, PunisherGear, PunisherBoss and zzPunisherVoice), and three new .DLL's in your Bepinex folders: two plugins in BepinEx/Plugins (PunisherVoicePatch.dll and PunisherBoss.dll) and one in your BepinEx/patchers folder (PunisherBossPreloader.dll)



Uninstall Instructions:

To remove this mod FULLY:
1. Delete all four folder in users/mods (PunisherGear, PunisherHead, PunisherBoss and zzPunisherVoice)
2. Delete PunisherBossPreloaded.dll in BepinEx/patchers
3. Delete PunisherBossMod.dll in BepinEx/plugins
4. Delete PunisherVoicePatch.dll in BepinEx/plugins
5. Remove all references to punisher in your profile .json

IF USING SWAG/DONUTS:
6. Set CustomBosses: punisher to false in SWAG/config/bossconfig.json
7. Remove punisher from the _boss patterns, or replace the patterns with default SWAG patterns (redownload swag and replace the patterns folder with overwrite)

That should do it!



OPTIONAL CONFIGS:

PunisherHead: If you wish to use the JonBernthal head on the player, open the config/config.json and change addheadtoplayer to true.

zzPunisherVoice: If you wish to use the Punisher voice lines on the player, open the config/playervoiceconfig.json and change AddVoiceToPlayer to true. 

- WARNING: This voice pack is very incomplete, a lot of player lines are missing/not used, and a few lines are repeated so the punisher boss doesn't spam the same exact line every time.
- Therefore it is NOT RECOMMENDED you use this voice pack on the player. I added this option purely for testing and meme purposes lol.
