@echo off
echo ================================================
echo   Lab System - Quick Start Script
echo ================================================
echo.

REM Stop all containers
echo [91m Stopping all containers...[0m
docker compose down

REM Remove old images to force rebuild
echo [91m Removing old images...[0m
docker rmi lab-system-full-frontend lab-system-full-backend 2>nul

REM Build and start
echo [92m Building and starting containers...[0m
docker compose up -d --build

echo.
echo [93m Waiting for services to start...[0m
timeout /t 10 /nobreak >nul

REM Show status
echo.
echo [96m Container status:[0m
docker compose ps

echo.
echo ================================================
echo [92m READY![0m
echo ================================================
echo.
echo [96m Frontend:[0m http://localhost:3000
echo [96m Backend: [0m http://localhost:8080
echo [96m Database:[0m localhost:5432
echo.
echo [93m Login credentials:[0m
echo    Admin:   admin / admin123
echo    Student: student / student123
echo.
echo [96m View logs:[0m docker compose logs -f
echo [96m Stop:     [0m docker compose down
echo.
pause
