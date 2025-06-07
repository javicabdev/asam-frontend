@echo off
echo 🔧 Solucionando problemas de dependencias...
echo.

echo 📦 Limpiando cache de npm...
npm cache clean --force

echo.
echo 🗑️ Eliminando node_modules y package-lock.json...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

echo.
echo 📥 Instalando dependencias actualizadas...
npm install

echo.
echo ✅ Dependencias actualizadas correctamente!
echo.
echo 🚀 Iniciando servidor de desarrollo...
npm run dev
