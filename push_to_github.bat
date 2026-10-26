@echo off
set /p TOKEN="Enter your GitHub Personal Access Token: "
if "%TOKEN%"=="" (
    echo Token cannot be empty.
    exit /b 1
)
"%LOCALAPPDATA%\MinGit\cmd\git.exe" push https://%TOKEN%@github.com/Pratima2404/ImMovies.git main
pause
