#!/usr/bin/env node

/**
 * Script para validar la configuración antes de desplegar en Netlify
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validando configuración para Netlify...\n');

let hasIssues = false;
const warnings = [];
const errors = [];

// 1. Verificar archivos de configuración
const requiredFiles = [
  'netlify.toml',
  'public/_redirects',
  'dist/index.html', // Solo si ya se hizo build
  'package.json'
];

const optionalFiles = [
  '.env.production',
  'public/manifest.json',
  'public/favicon.ico'
];

console.log('📁 Verificando archivos de configuración...');
requiredFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (file === 'dist/index.html') {
    // Solo verificar si dist existe
    if (fs.existsSync(path.join(process.cwd(), 'dist'))) {
      if (!fs.existsSync(filePath)) {
        warnings.push(`Build no encontrado: ${file} (ejecutar 'npm run build')`);
      }
    }
  } else if (!fs.existsSync(filePath)) {
    errors.push(`Archivo requerido no encontrado: ${file}`);
    hasIssues = true;
  }
});

optionalFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) {
    warnings.push(`Archivo opcional no encontrado: ${file}`);
  }
});

// 2. Verificar netlify.toml
if (fs.existsSync('netlify.toml')) {
  const netlifyConfig = fs.readFileSync('netlify.toml', 'utf8');
  
  // Verificar configuración básica
  if (!netlifyConfig.includes('[build]')) {
    errors.push('netlify.toml: Falta sección [build]');
    hasIssues = true;
  }
  
  if (!netlifyConfig.includes('command =')) {
    errors.push('netlify.toml: Falta build command');
    hasIssues = true;
  }
  
  if (!netlifyConfig.includes('publish =')) {
    errors.push('netlify.toml: Falta publish directory');
    hasIssues = true;
  }
  
  // Verificar si tiene URL de backend placeholder
  if (netlifyConfig.includes('https://api.asam.org')) {
    warnings.push('netlify.toml: Usando URL de backend de ejemplo - cambiar a URL real');
  }
  
  console.log('✅ netlify.toml validado');
}

// 3. Verificar package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

if (!packageJson.scripts || !packageJson.scripts.build) {
  errors.push('package.json: Falta script "build"');
  hasIssues = true;
}

if (!packageJson.scripts['build:safe']) {
  warnings.push('package.json: Considera usar "build:safe" para mayor tolerancia a errores');
}

// 4. Verificar variables de entorno
console.log('\n🔐 Variables de entorno necesarias en Netlify:');
const envVars = [
  'VITE_GRAPHQL_URI - URL del backend GraphQL (CRÍTICO)',
  'VITE_APP_NAME - Nombre de la aplicación',
  'VITE_ENABLE_PWA - Habilitar PWA (true/false)',
  'VITE_ENABLE_MOCK_DATA - Usar datos mock (false para producción)'
];

console.log('Las siguientes variables deben configurarse en Netlify Dashboard:');
envVars.forEach(v => console.log(`  - ${v}`));

// 5. Verificar archivos PWA
console.log('\n📱 Verificando configuración PWA...');
const pwaFiles = [
  'public/manifest.json',
  'public/favicon.ico'
];

// Verificar iconos en ambas ubicaciones
const iconFiles = [
  { preferred: 'public/icon-192x192.png', alternative: 'public/icons/icon-192x192.png' },
  { preferred: 'public/icon-512x512.png', alternative: 'public/icons/icon-512x512.png' }
];

pwaFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    warnings.push(`PWA: Archivo recomendado no encontrado: ${file}`);
  }
});

iconFiles.forEach(({ preferred, alternative }) => {
  if (!fs.existsSync(preferred) && !fs.existsSync(alternative)) {
    warnings.push(`PWA: Icono no encontrado en ninguna ubicación: ${preferred}`);
  } else if (!fs.existsSync(preferred) && fs.existsSync(alternative)) {
    console.log(`  ✅ Icono encontrado en: ${alternative}`);
  } else {
    console.log(`  ✅ Icono encontrado en: ${preferred}`);
  }
});

// 6. Resumen
console.log('\n' + '='.repeat(50));
console.log('📊 RESUMEN DE VALIDACIÓN\n');

if (errors.length > 0) {
  console.error('❌ ERRORES (deben corregirse):');
  errors.forEach(e => console.error(`   - ${e}`));
  console.log('');
}

if (warnings.length > 0) {
  console.warn('⚠️  ADVERTENCIAS (revisar):');
  warnings.forEach(w => console.warn(`   - ${w}`));
  console.log('');
}

if (!hasIssues && warnings.length === 0) {
  console.log('✅ ¡Todo listo para desplegar en Netlify!');
  console.log('\nPróximos pasos:');
  console.log('1. git push origin main');
  console.log('2. Conectar repositorio en Netlify');
  console.log('3. Configurar variables de entorno');
  console.log('4. Deploy!');
} else if (!hasIssues) {
  console.log('✅ Configuración válida (con algunas advertencias)');
  console.log('\nLa aplicación puede desplegarse, pero revisa las advertencias.');
} else {
  console.error('❌ Hay errores que deben corregirse antes de desplegar');
  process.exit(1);
}

// 7. Comandos útiles
console.log('\n📚 COMANDOS ÚTILES:');
console.log('npm run build:safe       # Build tolerante a errores');
console.log('npm run preview          # Previsualizar build local');
console.log('netlify deploy --prod    # Deploy manual con CLI');
console.log('netlify open             # Abrir sitio en navegador');
