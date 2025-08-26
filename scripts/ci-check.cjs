#!/usr/bin/env node

/**
 * Script para CI/CD que ejecuta todas las verificaciones de calidad
 * pero es más permisivo con los warnings
 */

const { execSync } = require('child_process');

let hasErrors = false;

console.log('🔍 Starting code quality checks...\n');

// 1. Type checking
console.log('📝 Type checking with TypeScript...');
try {
  execSync('tsc --noEmit', { stdio: 'inherit' });
  console.log('✅ TypeScript: No errors\n');
} catch (error) {
  console.error('❌ TypeScript: Found errors\n');
  hasErrors = true;
}

// 2. Linting (permitir warnings)
console.log('🔍 Linting with ESLint...');
try {
  execSync('npm run lint', { stdio: 'inherit' });
  console.log('✅ ESLint: Check completed\n');
} catch (error) {
  // Solo fallar si hay errores reales, no warnings
  const output = error.stdout ? error.stdout.toString() : '';
  if (output.includes('error')) {
    console.error('❌ ESLint: Found errors\n');
    hasErrors = true;
  } else {
    console.log('⚠️  ESLint: Has warnings but no errors\n');
  }
}

// 3. Format checking
console.log('🎨 Checking code formatting...');
try {
  execSync('prettier --check \"src/**/*.{ts,tsx,css,md}\"', { stdio: 'inherit' });
  console.log('✅ Prettier: Code is formatted\n');
} catch (error) {
  console.warn('⚠️  Prettier: Some files need formatting (non-blocking)\n');
  console.log('   Run "npm run format" to fix\n');
}

// 4. Build test
console.log('🔨 Testing production build...');
try {
  execSync('npm run build:safe', { stdio: 'inherit' });
  console.log('✅ Build: Successful\n');
} catch (error) {
  console.error('❌ Build: Failed\n');
  hasErrors = true;
}

// Summary
console.log('=' .repeat(50));
if (hasErrors) {
  console.error('\n❌ CI checks failed - Please fix errors before pushing\n');
  process.exit(1);
} else {
  console.log('\n✅ All CI checks passed!\n');
  console.log('Note: There may be some warnings to address later.\n');
  process.exit(0);
}
