#!/usr/bin/env node

/**
 * Script para limpiar el Service Worker y la caché PWA
 */

const fs = require('fs');
const path = require('path');

console.log('🧹 Limpiando archivos del Service Worker...');

// Directorios a limpiar
const dirsToClean = [
  path.join(__dirname, '..', 'dist'),
  path.join(__dirname, '..', 'dev-dist'),
  path.join(__dirname, '..', '.vite')
];

// Archivos específicos a eliminar
const filesToDelete = [
  path.join(__dirname, '..', 'public', 'sw.js'),
  path.join(__dirname, '..', 'public', 'workbox-*.js')
];

// Limpiar directorios
dirsToClean.forEach(dir => {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(`  ✓ Eliminado: ${path.basename(dir)}`);
  }
});

// Eliminar archivos específicos
filesToDelete.forEach(pattern => {
  const dir = path.dirname(pattern);
  const filePattern = path.basename(pattern);
  
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      if (file.match(new RegExp(filePattern.replace('*', '.*')))) {
        const filePath = path.join(dir, file);
        fs.unlinkSync(filePath);
        console.log(`  ✓ Eliminado: ${file}`);
      }
    });
  }
});

console.log('✨ Service Worker limpiado correctamente');
console.log('\n📝 Próximos pasos:');
console.log('  1. Limpia la caché del navegador (F12 > Application > Storage > Clear site data)');
console.log('  2. Reinicia el servidor de desarrollo: npm run dev');
