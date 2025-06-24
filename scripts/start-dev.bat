@echo off
echo 🚀 Iniciando ASAM Frontend...
echo.

echo 🔍 Verificando conexión con el backend...
curl -s -o nul -w "" http://localhost:8080/playground
if %errorlevel% neq 0 (
    echo ⚠️  El backend no está corriendo en http://localhost:8080
    echo.
    echo Para iniciar el backend con Docker:
    echo 1. Abre una nueva terminal
    echo 2. cd C:\Work\babacar\asam\asam-backend
    echo 3. start-docker.bat
    echo.
    
    set /p continue="¿Deseas continuar de todos modos? (s/n): "
    if /i "%continue%" neq "s" (
        exit /b 0
    )
) else (
    echo ✅ Backend detectado en http://localhost:8080
)

echo.
echo 📦 Iniciando servidor de desarrollo...
npm run dev
