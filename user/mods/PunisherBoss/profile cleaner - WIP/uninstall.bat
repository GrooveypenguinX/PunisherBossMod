@echo off
setlocal enabledelayedexpansion

for %%F in (*.json) do (
    set "inputFile=%%F"
    
    echo Modifying !inputFile!...
    
    (for /f "usebackq delims=" %%L in ("!inputFile!") do (
        set "line=%%L"
        setlocal enabledelayedexpansion
        set "line=!line:bosspunisher=bosskilla!"
        set "line=!line:punisher_rig=5ca20abf86f77418567a43f2!"
        set "line=!line:punisher_bag=59e763f286f7742ee57895da!"
        set "line=!line:punisher_slick=5c0e655586f774045612eeb2!"
        echo(!line!
        endlocal
    )) > "!inputFile!.tmp"
    
    move /y "!inputFile!.tmp" "!inputFile!" > nul
    
    echo !inputFile! modified successfully.
)

echo All .json files modified.
