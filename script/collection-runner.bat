@echo off
echo Starting Newman E2E Tests...
echo ================================

REM Set base paths
set BASE_DIR=C:\Fahmi\Repository\Performance\Postman\fahmi\
set NEWMAN_COLLECTION=%BASE_DIR%\postman\NODE-E2E.postman_collection.json
set NEWMAN_ENVIRONMENT=%BASE_DIR%\postman\prod-env.postman_environment.json
set REPORT_DIR=%BASE_DIR%\reports

REM Create reports directory if it doesn't exist
if not exist "%REPORT_DIR%" mkdir "%REPORT_DIR%"

REM Get current timestamp using PowerShell (more reliable than wmic)
for /f %%i in ('powershell -Command "Get-Date -Format 'yyyyMMdd_HHmmss'"') do set timestamp=%%i

REM Alternative simple timestamp if PowerShell fails
if "%timestamp%"=="" (
    set timestamp=%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%
    set timestamp=%timestamp: =0%
)

echo Running Newman with 1 iterations...
echo Report timestamp: %timestamp%
echo Collection: %NEWMAN_COLLECTION%
echo Environment: %NEWMAN_ENVIRONMENT%
echo Report Directory: %REPORT_DIR%
echo ================================

REM Check if files exist
if not exist "%NEWMAN_COLLECTION%" (
    echo ERROR: Collection file not found: %NEWMAN_COLLECTION%
    pause
    exit /b 1
)

if not exist "%NEWMAN_ENVIRONMENT%" (
    echo ERROR: Environment file not found: %NEWMAN_ENVIRONMENT%
    pause
    exit /b 1
)

newman run "%NEWMAN_COLLECTION%" ^
  --environment "%NEWMAN_ENVIRONMENT%" ^
  --iteration-count 1 ^
  --reporters cli,html,json,junit ^
  --reporter-html-export "%REPORT_DIR%\newman-report.html" ^
  --reporter-json-export "%REPORT_DIR%\newman-report.json" ^
  --reporter-junit-export "%REPORT_DIR%\newman-report.xml" ^
  --delay-request 500 ^
  --timeout-request 10000 ^
  --color on

if %ERRORLEVEL% EQU 0 (
    echo ================================
    echo Test execution completed successfully!
    echo Reports generated in: %REPORT_DIR%
    echo - HTML: newman-report-%timestamp%.html
    echo - JSON: newman-report-%timestamp%.json
    echo - JUnit XML: newman-report-%timestamp%.xml
    echo ================================
) else (
    echo ================================
    echo Test execution failed with error code: %ERRORLEVEL%
    echo ================================
)

REM Keep the window open to see results
pause