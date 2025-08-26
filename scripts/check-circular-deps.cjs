#!/usr/bin/env node

/**
 * Script para detectar dependencias circulares en el proyecto
 * Las dependencias circulares pueden causar errores de inicialización en producción
 */

const madge = require('madge');
const path = require('path');

// Colores simples sin chalk para evitar problemas de compatibilidad
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(color, message) {
  console.log(colors[color] + message + colors.reset);
}

async function checkCircularDependencies() {
  log('blue', '🔍 Analizando dependencias circulares...\n');

  try {
    const result = await madge('./src', {
      fileExtensions: ['ts', 'tsx', 'js', 'jsx'],
      excludeRegExp: [
        /\.test\./,
        /\.spec\./,
        /\.stories\./,
        /__tests__/,
        /node_modules/
      ],
      tsConfig: path.join(process.cwd(), 'tsconfig.json'),
      detectiveOptions: {
        ts: {
          skipTypeImports: true
        }
      }
    });

    const circular = result.circular();

    if (circular.length > 0) {
      log('red', '❌ Se encontraron dependencias circulares:\n');
      
      circular.forEach((cycle, index) => {
        log('yellow', `Ciclo ${index + 1}:`);
        cycle.forEach((file, i) => {
          const arrow = i === cycle.length - 1 ? '↩' : '→';
          console.log(`  ${file} ${arrow}`);
        });
        console.log();
      });

      log('red', `Total: ${circular.length} ciclo(s) encontrado(s)\n`);
      log('yellow', 'Sugerencias para resolver:');
      console.log('1. Mueve tipos compartidos a archivos separados');
      console.log('2. Usa imports dinámicos cuando sea apropiado');
      console.log('3. Reorganiza la estructura de módulos');
      console.log('4. Considera usar barrel exports con cuidado\n');
      
      process.exit(1);
    } else {
      log('green', '✅ No se encontraron dependencias circulares\n');
    }

    // Análisis adicional
    const warnings = result.warnings();
    if (warnings && warnings.length > 0) {
      log('yellow', '⚠️  Advertencias:\n');
      warnings.forEach(warning => {
        console.log(`  - ${warning}`);
      });
    }

  } catch (error) {
    if (error.message && error.message.includes('Cannot find module')) {
      log('yellow', '⚠️  Madge no está instalado. Instalando...\n');
      console.log('Ejecuta: npm install --save-dev madge');
      console.log('Luego vuelve a ejecutar: npm run check:circular\n');
    } else {
      log('red', 'Error al analizar dependencias:');
      console.error(error);
    }
    process.exit(1);
  }
}

checkCircularDependencies();
