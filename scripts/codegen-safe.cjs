#!/usr/bin/env node

/**
 * Script para ejecutar GraphQL codegen de forma segura
 * Si falla (por ejemplo, porque el backend no está corriendo), continúa sin error
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Determinar qué configuración usar
const args = process.argv.slice(2);
const useLocal = args.includes('--local');

// Verificar si existe el archivo de configuración local
const localConfig = path.join(__dirname, '..', 'codegen.local.yml');
const hasLocalConfig = fs.existsSync(localConfig);

// Si existe el archivo local, usarlo, si no, usar el normal
const configFile = hasLocalConfig ? 'codegen.local.yml' : 'codegen.yml';

console.log(`🔧 Running GraphQL codegen with ${configFile}...`);

const codegen = spawn('npx', ['graphql-codegen', '--config', configFile], {
  stdio: 'inherit',
  shell: true
});

codegen.on('close', (code) => {
  if (code !== 0) {
    console.warn('⚠️  GraphQL codegen failed - continuing build without generated types');
    console.warn('   Run the backend and execute "npm run codegen" to update types');
    process.exit(0); // Salir con éxito de todas formas
  } else {
    console.log('✅ GraphQL codegen completed successfully');
  }
});

codegen.on('error', (err) => {
  console.warn('⚠️  GraphQL codegen not available - continuing build');
  console.warn('   Error:', err.message);
  process.exit(0); // Salir con éxito de todas formas
});
