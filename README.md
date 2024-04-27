# PunisherBossMod
A mod for SPT-AKI that adds Frank Castle "The Punisher" to the game as a new boss



Installation Instructions:

1. Have a working version of SPT. This might work for earlier version, but for any early version there is NO GUARUNTEE and it WILL NOT BE SUPPORTED. Use the latest versions guys, it's not rocket science to update your game lol.

2. Drag the users and Bepinex folders from the downloaded zip to your main SPT install location.

IF USING SWAG/DONUTS:

1. Enable punisher in SWAG/config/bossconfig.json
2. (optional) enable useProgressChance in the same config to allow punisher's dynamic spawnchance system to be used. Leave false to use SWAGs chances.

Configuration:

Included is a config.jsonc that allows you to do the following:

- addHeadToPlayer - Adds both punisher head options to the player customization options

- addVoiceToPlayer - Adds both punisher voice options to the player customization options
        - WARNING: This voice pack for Jon Bernthal is very incomplete. A lot of player lines are missing/not used, and a few lines are repeated so the punisher boss doesn't spam the same exact line every time.

- minimumPlayerLevelBeforeSpawn - Allows the user to set a default level before punisher will spawn (default is level 15)

- overridePunisherSpawnChance - Allows the user to set a static spawnchance for punisher (will be overridden by SWAG if you don't have progresschance enabled in SWAG bossconfig)


Uninstall Instructions:

To remove this mod FULLY:
1. Delete the servermod WTT-RogueJustice in users/mods/
2. Delete WTT-RogueJusticePreloader.dll in BepinEx/patchers
3. Delete WTT-RogueJustice.dll in BepinEx/plugins
4. Delete WTT-RogueJusticeVoiceAdder.dll in BepinEx/plugins
5. Remove/replace all references to punisher in your profile .json

IF USING SWAG/DONUTS:

6. Set CustomBosses: punisher to false in SWAG/config/bossconfig.json


That should do it!



OPTIONAL CONFIGS:

PunisherHead: If you wish to use the JonBernthal head on the player, open the config/config.json and change addheadtoplayer to true.

zzPunisherVoice: If you wish to use the Punisher voice lines on the player, open the config/playervoiceconfig.json and change AddVoiceToPlayer to true. 


- Therefore it is NOT RECOMMENDED you use this voice pack on the player. I added this option purely for testing and meme purposes lol.
