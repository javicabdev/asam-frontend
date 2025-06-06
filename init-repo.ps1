# Initialize git repository and connect to GitHub
Write-Host "🚀 Inicializando repositorio Git para ASAM Frontend..." -ForegroundColor Green

# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "feat: initial project setup with React, Vite, TypeScript and PWA support"

# Add remote origin
Write-Host "📦 Conectando con GitHub..." -ForegroundColor Yellow
Write-Host "Asegúrate de haber creado el repositorio 'asam-frontend' en GitHub primero"
Write-Host ""

$confirm = Read-Host "¿Tu nombre de usuario de GitHub es 'javicabdev'? (s/n)"

if ($confirm -eq "s") {
    git remote add origin https://github.com/javicabdev/asam-frontend.git
} else {
    $username = Read-Host "Ingresa tu nombre de usuario de GitHub"
    git remote add origin "https://github.com/$username/asam-frontend.git"
}

# Push to main branch
git branch -M main
git push -u origin main

Write-Host "✅ Repositorio inicializado y conectado con GitHub!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos pasos:" -ForegroundColor Cyan
Write-Host "1. npm install - Instalar dependencias"
Write-Host "2. cp .env.example .env - Configurar variables de entorno"
Write-Host "3. npm run dev - Iniciar servidor de desarrollo"
