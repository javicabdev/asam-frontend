#!/usr/bin/env node

/**
 * Script de build simplificado que intenta codegen pero continúa si falla
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Starting build process...\n');

// Intentar codegen
console.log('📝 Attempting GraphQL codegen...');
try {
  // Primero intentar con el backend
  execSync('npx graphql-codegen --config codegen.yml', { stdio: 'inherit' });
  console.log('✅ Codegen from backend successful\n');
} catch (error) {
  console.warn('⚠️  Backend codegen failed, trying local schema...');
  try {
    // Intentar con el schema local
    execSync('npx graphql-codegen --config codegen.local.yml', { stdio: 'inherit' });
    console.log('✅ Codegen from local schema successful\n');
  } catch (localError) {
    console.warn('⚠️  Codegen failed completely - continuing with existing types\n');
  }
}

// Compilar TypeScript
console.log('🔧 Compiling TypeScript...');
try {
  execSync('tsc', { stdio: 'inherit' });
  console.log('✅ TypeScript compilation successful\n');
} catch (error) {
  console.error('❌ TypeScript compilation failed');
  process.exit(1);
}

// Build con Vite
console.log('📦 Building with Vite...');
try {
  execSync('vite build', { stdio: 'inherit' });
  console.log('\n✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Vite build failed');
  process.exit(1);
}
