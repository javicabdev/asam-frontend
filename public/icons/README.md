# Iconos de PWA para ASAM

## ⚠️ IMPORTANTE

Los iconos actuales son PLACEHOLDERS. Debes reemplazarlos con el logo oficial de ASAM antes de ir a producción.

## Iconos Requeridos

### Iconos Principales
- [ ] icon-72x72.png
- [ ] icon-96x96.png
- [ ] icon-128x128.png
- [ ] icon-144x144.png
- [ ] icon-152x152.png
- [ ] icon-192x192.png
- [ ] icon-384x384.png
- [ ] icon-512x512.png

### Iconos Maskable (Android Adaptativo)
- [ ] maskable-icon-192x192.png (con 40% padding)
- [ ] maskable-icon-512x512.png (con 40% padding)

### Iconos Apple
- [ ] apple-touch-icon.png (180x180)
- [ ] icon-167x167.png (iPad Pro)

### Iconos Pequeños
- [ ] icon-16x16.png (favicon)
- [ ] icon-32x32.png (favicon)
- [ ] favicon.ico (multi-resolución)

### Iconos para Shortcuts
- [ ] payment-96x96.png (icono de pago)
- [ ] member-96x96.png (icono de miembro)

## Cómo Generar los Iconos

### Opción 1: Herramientas Online (Recomendado)

1. **PWA Builder** - https://www.pwabuilder.com/imageGenerator
   - Sube tu logo de 512x512px
   - Genera todos los tamaños automáticamente
   - Incluye iconos maskable

2. **Real Favicon Generator** - https://realfavicongenerator.net/
   - Genera favicons y apple-touch-icons
   - Incluye configuración para diferentes plataformas

3. **Maskable.app** - https://maskable.app/
   - Ajusta el padding para iconos maskable
   - Previsualiza en diferentes formas

### Opción 2: Script Automatizado

```bash
# Instalar Sharp (si usas Node.js)
npm install sharp

# Crear script generate-icons.js
const sharp = require('sharp');
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

async function generateIcons() {
  const logo = await sharp('logo-original.png');
  
  for (const size of sizes) {
    await logo
      .resize(size, size)
      .toFile(`icon-${size}x${size}.png`);
  }
  
  // Maskable icons (con padding)
  await sharp('logo-original.png')
    .resize(192, 192, {
      fit: 'contain',
      background: { r: 25, g: 118, b: 210, alpha: 1 }
    })
    .toFile('maskable-icon-192x192.png');
}

generateIcons();
```

### Opción 3: Photoshop/Illustrator

1. Abre el logo original en alta resolución
2. Crea un action para redimensionar
3. Exporta a cada tamaño requerido
4. Para maskable: añade 40% de padding

## Especificaciones

### Logo Principal
- Formato: PNG con transparencia
- Resolución mínima: 512x512px
- Colores: Consistentes con la marca

### Iconos Maskable
- Padding: 40% del tamaño total
- El contenido principal debe estar en la "safe zone" central
- Fondo: Color sólido (#1976d2) o gradiente

### Optimización
- Usa herramientas como TinyPNG para comprimir
- Objetivo: < 50KB para iconos grandes
- Mantén la calidad visual

## Validación

Después de generar los iconos:

1. Prueba en Chrome DevTools > Application > Manifest
2. Verifica en diferentes dispositivos
3. Usa Lighthouse para validar PWA score

## Placeholder Actual

El archivo `icon-placeholder.svg` es solo temporal. NO lo uses en producción.
