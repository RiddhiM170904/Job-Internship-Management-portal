@echo off
echo ========================================
echo Job Portal - Setup Script
echo ========================================
echo.

echo Installing Backend Dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Backend installation failed!
    pause
    exit /b %errorlevel%
)
echo ✓ Backend dependencies installed
echo.

echo Installing Frontend Dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo Frontend installation failed!
    pause
    exit /b %errorlevel%
)
echo ✓ Frontend dependencies installed
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next Steps:
echo 1. Configure backend/.env with MongoDB URI
echo 2. Configure frontend/.env (default should work)
echo 3. Run backend: cd backend ^&^& npm run dev
echo 4. Run frontend: cd frontend ^&^& npm run dev
echo.
echo See QUICKSTART.md for detailed instructions
echo.
pause
