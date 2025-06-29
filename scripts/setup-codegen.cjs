const fs = require('fs');
const path = require('path');

// Crear directorios necesarios
const dirs = [
  'src/graphql/operations',
  'src/graphql/fragments',
  'src/graphql/generated'
];

dirs.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  }
});

console.log('📁 GraphQL directory structure created successfully!');
