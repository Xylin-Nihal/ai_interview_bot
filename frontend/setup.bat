@echo off
echo 🚀 Setting up InterviewAI Frontend...
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js found: %NODE_VERSION%
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    exit /b 1
)

echo ✅ Dependencies installed successfully
echo.

REM Check if .env.local exists
if not exist .env.local (
    echo 📝 Setting up environment variables...
    (
        echo NEXT_PUBLIC_API_URL=http://localhost:8000
    ) > .env.local
    echo ✅ Created .env.local with default configuration
) else (
    echo ✅ .env.local already exists
)

echo.
echo ✨ Setup complete!
echo.
echo 📖 To start the development server, run:
echo    npm run dev
echo.
echo 🌐 The app will be available at: http://localhost:3000
echo.
echo Make sure your backend is running on: http://localhost:8000
