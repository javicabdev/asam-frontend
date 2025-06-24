# Script para verificar el backend antes de iniciar el frontend
Write-Host "🚀 Iniciando ASAM Frontend..." -ForegroundColor Green
Write-Host ""

# Verificar si el backend está corriendo
Write-Host "🔍 Verificando conexión con el backend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/playground" -Method HEAD -TimeoutSec 2 -ErrorAction Stop
    Write-Host "✅ Backend detectado en http://localhost:8080" -ForegroundColor Green
} catch {
    Write-Host "⚠️  El backend no está corriendo en http://localhost:8080" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Para iniciar el backend con Docker:" -ForegroundColor Cyan
    Write-Host "1. Abre una nueva terminal" -ForegroundColor White
    Write-Host "2. cd C:\Work\babacar\asam\asam-backend" -ForegroundColor White
    Write-Host "3. .\start-docker.ps1" -ForegroundColor White
    Write-Host ""
    
    $continue = Read-Host "¿Deseas continuar de todos modos? (s/n)"
    if ($continue -ne "s") {
        exit 0
    }
}

Write-Host ""
Write-Host "📦 Iniciando servidor de desarrollo..." -ForegroundColor Yellow
npm run dev
