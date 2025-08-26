#!/usr/bin/env node

/**
 * Script para copiar los iconos PWA principales a la raíz de public
 * para mejor compatibilidad con diferentes servicios de hosting
 */

const fs = require('fs');
const path = require('path');

const publicDir = path.join(process.cwd(), 'public');
const iconsDir = path.join(publicDir, 'icons');

const iconsToCopy = [
  { from: 'icon-192x192.png', to: 'icon-192x192.png' },
  { from: 'icon-512x512.png', to: 'icon-512x512.png' },
  { from: 'apple-touch-icon.png', to: 'apple-touch-icon.png' }
];

console.log('📱 Copiando iconos PWA a la raíz de public/...\n');

iconsToCopy.forEach(({ from, to }) => {
  const sourcePath = path.join(iconsDir, from);
  const destPath = path.join(publicDir, to);
  
  if (fs.existsSync(sourcePath)) {
    try {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`✅ Copiado: ${from} -> public/${to}`);
    } catch (error) {
      console.error(`❌ Error copiando ${from}:`, error.message);
    }
  } else {
    console.warn(`⚠️  Archivo fuente no encontrado: ${sourcePath}`);
  }
});

console.log('\n✨ Proceso completado!');
