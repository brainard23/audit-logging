# MAMP MySQL Database Setup Script
# This script sets up the user_profile_service database in MAMP MySQL

$MYSQL_PATH = "C:\MAMP\bin\mysql\bin\mysql.exe"
$HOST = "localhost"
$PORT = "8889"
$USER = "root"
$PASSWORD = "root"
$SCRIPT_PATH = "scripts\setup-database.sql"

Write-Host "Setting up user_profile_service database in MAMP MySQL..." -ForegroundColor Green

# Check if MySQL executable exists
if (-Not (Test-Path $MYSQL_PATH)) {
    Write-Host "Error: MySQL executable not found at $MYSQL_PATH" -ForegroundColor Red
    Write-Host "Please update the MYSQL_PATH variable in this script to match your MAMP installation." -ForegroundColor Yellow
    exit 1
}

# Run the setup script
try {
    & $MYSQL_PATH -h $HOST -P $PORT -u $USER -p$PASSWORD < $SCRIPT_PATH
    Write-Host "Database setup completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Database Details:" -ForegroundColor Cyan
    Write-Host "  Host: $HOST" -ForegroundColor White
    Write-Host "  Port: $PORT" -ForegroundColor White
    Write-Host "  User: $USER" -ForegroundColor White
    Write-Host "  Database: user_profile_service" -ForegroundColor White
    Write-Host ""
    Write-Host "Connection String:" -ForegroundColor Cyan
    Write-Host "  mysql://root:root@localhost:8889/user_profile_service" -ForegroundColor White
} catch {
    Write-Host "Error setting up database: $_" -ForegroundColor Red
    exit 1
}
