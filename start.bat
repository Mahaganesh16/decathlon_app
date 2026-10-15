@echo off
echo ========================================================
echo Starting Decathlon App (Database + Backend + Frontend)
echo ========================================================

:: Check if MySQL is listening on port 3306
netstat -ano | findstr :3306 | findstr LISTENING >nul
if %errorlevel% neq 0 (
    echo [INFO] MySQL is not running on port 3306.
    if exist "%~dp0..\..\mysql_start.bat" (
        echo [INFO] Starting XAMPP MySQL in background...
        start "XAMPP MySQL" "%~dp0..\..\mysql_start.bat"
        timeout /t 3 /nobreak >nul
    ) else if exist "c:\xampp\mysql_start.bat" (
        echo [INFO] Starting XAMPP MySQL in background...
        start "XAMPP MySQL" "c:\xampp\mysql_start.bat"
        timeout /t 3 /nobreak >nul
    ) else (
        echo [WARNING] MySQL is not running. Please start MySQL in XAMPP Control Panel.
    )
) else (
    echo [OK] MySQL is already running on port 3306.
)

cd /d "%~dp0fullstack-project"
npx -y concurrently -n backend,frontend -c blue,magenta "npm run dev --prefix backend" "npm run dev --prefix frontend"
pause
