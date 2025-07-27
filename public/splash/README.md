# Splash Screens para iOS

Este directorio debe contener las pantallas de inicio (splash screens) para dispositivos iOS.

## Splash Screens Requeridos

Los splash screens son opcionales pero mejoran la experiencia en iOS. Si decides implementarlos:

### iPhone
- **iphone5_splash.png** - 640x1136px
- **iphone6_splash.png** - 750x1334px  
- **iphoneplus_splash.png** - 1242x2208px
- **iphonex_splash.png** - 1125x2436px

### iPad
- **ipad_splash.png** - 1536x2048px
- **ipadpro1_splash.png** - 1668x2224px
- **ipadpro2_splash.png** - 2048x2732px

## Diseño Recomendado

- Fondo con el color de marca (#1976d2)
- Logo de ASAM centrado
- Texto "Mutua ASAM" debajo del logo
- Mantener diseño minimalista

## Generación

1. Crea un diseño base en alta resolución
2. Exporta a los tamaños específicos
3. Optimiza las imágenes (TinyPNG, ImageOptim)

## Nota

Si no tienes los recursos para crear todos los splash screens, puedes:
1. Comentar las líneas correspondientes en `index.html`
2. iOS usará el color de fondo por defecto
3. Implementarlos más adelante cuando tengas los recursos
