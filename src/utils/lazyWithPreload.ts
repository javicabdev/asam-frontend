import { lazy, ComponentType, LazyExoticComponent } from 'react'

/**
 * Enhanced lazy loading with preload capability
 * Allows components to be preloaded before they're actually needed
 */
export interface PreloadableComponent<T extends ComponentType<any>> extends LazyExoticComponent<T> {
  preload: () => Promise<void>
}

/**
 * Create a lazy component with preload capability
 * @param importFunc Function that imports the component
 * @returns Lazy component with preload method
 */
export function lazyWithPreload<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T } | { [key: string]: T }>,
  namedExport?: string
): PreloadableComponent<T> {
  let preloadedModule: { default: T } | { [key: string]: T } | null = null
  let preloadPromise: Promise<void> | null = null

  const load = async () => {
    if (preloadedModule) {
      return preloadedModule
    }

    if (preloadPromise) {
      await preloadPromise
      return preloadedModule!
    }

    const module = await importFunc()
    preloadedModule = module
    return module
  }

  const LazyComponent = lazy(async () => {
    const module = await load()

    if (namedExport && typeof module === 'object' && namedExport in module) {
      return { default: (module as any)[namedExport] }
    }

    return module as { default: T }
  }) as PreloadableComponent<T>

  LazyComponent.preload = () => {
    if (!preloadPromise && !preloadedModule) {
      preloadPromise = load().then(() => {
        preloadPromise = null
      })
    }
    return preloadPromise || Promise.resolve()
  }

  return LazyComponent
}

/**
 * Preload multiple components at once
 * @param components Array of preloadable components
 */
export async function preloadComponents(components: PreloadableComponent<any>[]): Promise<void> {
  await Promise.all(components.map((component) => component.preload()))
}

/**
 * Preload a component when the browser is idle
 * @param component Preloadable component
 */
export function preloadOnIdle<T extends ComponentType<any>>(
  component: PreloadableComponent<T>
): void {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      component.preload()
    })
  } else {
    // Fallback for browsers that don't support requestIdleCallback
    setTimeout(() => {
      component.preload()
    }, 1)
  }
}

/**
 * Preload a component when user hovers over a trigger element
 * @param component Preloadable component
 * @param elementId ID of the trigger element
 */
export function preloadOnHover<T extends ComponentType<any>>(
  component: PreloadableComponent<T>,
  elementId: string
): void {
  const element = document.getElementById(elementId)
  if (element) {
    let preloaded = false
    element.addEventListener(
      'mouseenter',
      () => {
        if (!preloaded) {
          component.preload()
          preloaded = true
        }
      },
      { once: true }
    )
  }
}

/**
 * Preload components based on route patterns
 * Useful for preloading components that are likely to be needed next
 */
export function setupRoutePreloading(
  routePreloadMap: Record<string, PreloadableComponent<any>[]>
): void {
  // Listen to route changes and preload components for likely next routes
  const currentPath = window.location.pathname
  const componentsToPreload = routePreloadMap[currentPath]

  if (componentsToPreload) {
    // Preload after a short delay to not interfere with current page load
    setTimeout(() => {
      preloadComponents(componentsToPreload)
    }, 2000)
  }
}
