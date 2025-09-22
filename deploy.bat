@echo off
REM DevToolkit Windows Deployment Script
REM This script helps deploy the application on Windows

setlocal enabledelayedexpansion

echo.
echo 🚀 DevToolkit Windows Deployment Script
echo ========================================
echo.

REM Function to check if Docker is installed
:check_docker
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not installed. Please install Docker Desktop first.
    echo Visit: https://docs.docker.com/desktop/windows/
    pause
    exit /b 1
)
echo ✅ Docker is installed

REM Function to check if Docker Compose is available
:check_docker_compose
docker compose version >nul 2>&1
if errorlevel 1 (
    docker-compose --version >nul 2>&1
    if errorlevel 1 (
        echo ❌ Docker Compose is not available. Please install Docker Compose.
        pause
        exit /b 1
    )
    set COMPOSE_CMD=docker-compose
) else (
    set COMPOSE_CMD=docker compose
)
echo ✅ Docker Compose is available

REM Function to setup environment
:setup_environment
if not exist ".env" (
    echo ⚠️  .env file not found. Creating from template...
    copy .env.example .env >nul
    echo ℹ️  Please edit .env file with your configuration before running the application
    set ENV_CREATED=1
) else (
    echo ✅ Environment file exists
    set ENV_CREATED=0
)
goto :eof

REM Function to start application
:start_application
echo ℹ️  Building and starting the application...
%COMPOSE_CMD% down --remove-orphans
%COMPOSE_CMD% build --no-cache
%COMPOSE_CMD% up -d

echo ✅ Application started successfully!
echo ℹ️  Waiting for services to be ready...
timeout /t 10 >nul

call :check_services
goto :eof

REM Function to check services
:check_services
echo ℹ️  Checking service health...

REM Check if ports are listening
netstat -an | findstr ":27017" >nul 2>&1
if not errorlevel 1 (
    echo ✅ MongoDB is running
) else (
    echo ⚠️  MongoDB might not be ready yet
)

REM Check Backend API
curl -f http://localhost:3000/health >nul 2>&1
if not errorlevel 1 (
    echo ✅ Backend API is running
) else (
    echo ⚠️  Backend API might not be ready yet
)

REM Check Frontend
curl -f http://localhost:3001 >nul 2>&1
if not errorlevel 1 (
    echo ✅ Frontend is running
) else (
    echo ⚠️  Frontend might not be ready yet
)
goto :eof

REM Function to stop application
:stop_application
echo ℹ️  Stopping the application...
%COMPOSE_CMD% down
echo ✅ Application stopped
goto :eof

REM Function to show logs
:show_logs
%COMPOSE_CMD% logs -f
goto :eof

REM Function to cleanup
:cleanup
echo ℹ️  Cleaning up Docker resources...
%COMPOSE_CMD% down -v --remove-orphans
docker system prune -f
echo ✅ Cleanup completed
goto :eof

REM Function to show URLs
:show_urls
echo.
echo 🌐 Application URLs:
echo Frontend: http://localhost:3001
echo Backend API: http://localhost:3000
echo API Health Check: http://localhost:3000/health
echo.
goto :eof

REM Main menu
:show_menu
echo.
echo Please select an option:
echo 1^) Start Application ^(Build ^& Run^)
echo 2^) Stop Application
echo 3^) Show Logs
echo 4^) Check Service Status
echo 5^) Cleanup ^(Remove all containers and volumes^)
echo 6^) Show Application URLs
echo 7^) Exit
echo.
goto :eof

REM Main script execution
call :check_docker
call :check_docker_compose
call :setup_environment

if !ENV_CREATED! equ 1 (
    set /p continue="Do you want to continue with the template .env file? (y/n): "
    if /i not "!continue!"=="y" (
        echo ℹ️  Please configure your .env file and run the script again
        pause
        exit /b 1
    )
)

:menu_loop
call :show_menu
set /p choice="Enter your choice [1-7]: "

if "%choice%"=="1" (
    call :start_application
    call :show_urls
) else if "%choice%"=="2" (
    call :stop_application
) else if "%choice%"=="3" (
    call :show_logs
) else if "%choice%"=="4" (
    call :check_services
) else if "%choice%"=="5" (
    set /p confirm="Are you sure you want to remove all containers and volumes? (y/n): "
    if /i "!confirm!"=="y" call :cleanup
) else if "%choice%"=="6" (
    call :show_urls
) else if "%choice%"=="7" (
    echo ℹ️  Goodbye!
    exit /b 0
) else (
    echo ❌ Invalid option. Please choose 1-7.
)

echo.
pause
goto menu_loop