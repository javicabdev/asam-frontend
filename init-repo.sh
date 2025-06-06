#!/bin/bash

# Initialize git repository and connect to GitHub
echo "🚀 Inicializando repositorio Git para ASAM Frontend..."

# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "feat: initial project setup with React, Vite, TypeScript and PWA support"

# Add remote origin (replace with your GitHub username)
echo "📦 Conectando con GitHub..."
echo "Asegúrate de haber creado el repositorio 'asam-frontend' en GitHub primero"
echo ""
read -p "¿Tu nombre de usuario de GitHub es 'javicabdev'? (y/n): " confirm

if [ "$confirm" = "y" ]; then
    git remote add origin https://github.com/javicabdev/asam-frontend.git
else
    read -p "Ingresa tu nombre de usuario de GitHub: " username
    git remote add origin https://github.com/$username/asam-frontend.git
fi

# Push to main branch
git branch -M main
git push -u origin main

echo "✅ Repositorio inicializado y conectado con GitHub!"
echo ""
echo "📋 Próximos pasos:"
echo "1. npm install - Instalar dependencias"
echo "2. cp .env.example .env - Configurar variables de entorno"
echo "3. npm run dev - Iniciar servidor de desarrollo"
