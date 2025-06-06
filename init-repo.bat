@echo off
echo 🚀 Inicializando repositorio Git para ASAM Frontend...
echo.

REM Initialize git
git init

REM Add all files
git add .

REM Create initial commit
git commit -m "feat: initial project setup with React, Vite, TypeScript and PWA support"

REM Configure main branch
git branch -M main

echo.
echo 📦 Conectando con GitHub...
echo Asegúrate de haber creado el repositorio 'asam-frontend' en GitHub primero
echo.

set /p username="Ingresa tu nombre de usuario de GitHub (ejemplo: javicabdev): "

REM Add remote origin
git remote add origin https://github.com/%username%/asam-frontend.git

echo.
echo 🔄 Subiendo código a GitHub...
git push -u origin main

echo.
echo ✅ Repositorio inicializado y código subido a GitHub!
echo.
echo 📋 Próximos pasos:
echo 1. npm install - Instalar dependencias
echo 2. copy .env.example .env - Configurar variables de entorno
echo 3. npm run dev - Iniciar servidor de desarrollo
echo.
pause
