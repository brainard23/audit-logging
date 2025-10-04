@echo off
REM MAMP MySQL Database Setup Script
REM This script sets up the user_profile_service database in MAMP MySQL

SET MYSQL_PATH=C:\MAMP\bin\mysql\bin\mysql.exe
SET HOST=localhost
SET PORT=8889
SET USER=root
SET PASSWORD=root
SET SCRIPT_PATH=scripts\setup-database.sql

echo Setting up user_profile_service database in MAMP MySQL...
echo.

REM Check if MySQL executable exists
if not exist "%MYSQL_PATH%" (
    echo Error: MySQL executable not found at %MYSQL_PATH%
    echo Please update the MYSQL_PATH variable in this script to match your MAMP installation.
    exit /b 1
)

REM Run the setup script
"%MYSQL_PATH%" -h %HOST% -P %PORT% -u %USER% -p%PASSWORD% < %SCRIPT_PATH%

if %ERRORLEVEL% EQU 0 (
    echo.
    echo Database setup completed successfully!
    echo.
    echo Database Details:
    echo   Host: %HOST%
    echo   Port: %PORT%
    echo   User: %USER%
    echo   Database: user_profile_service
    echo.
    echo Connection String:
    echo   mysql://root:root@localhost:8889/user_profile_service
    echo.
) else (
    echo.
    echo Error setting up database!
    exit /b 1
)
