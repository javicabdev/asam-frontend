import { lazy, ComponentType, LazyExoticComponent } from 'react'

/**
 * Enhanced lazy loading with preload capability
 * Allows components to be preloaded before they're actually needed
 */
export interface PreloadableComponent<T extends ComponentType<unknown>> extends LazyExoticComponent<T> {
  preload: () => Promise<void>
}

/**
 * Create a lazy component with preload capability
 * @param importFunc Function that imports the component
 * @param namedExport Optional named export to use instead of default export
 * @returns Lazy component with preload method
 */
export function lazyWithPreload<T extends ComponentType<unknown>>(
  importFunc: () => Promise<unknown>,
  namedExport?: string
): PreloadableComponent<T> {
  let preloadedModule: unknown = null
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

    if (namedExport && typeof module === 'object' && module !== null && namedExport in module) {
      const namedModule = module as Record<string, unknown>
      return { default: namedModule[namedExport] as T }
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
 * Preload a component when the browser is idle
 * @param component Preloadable component
 */
export function preloadOnIdle<T extends ComponentType<unknown>>(
  component: PreloadableComponent<T>
): void {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      void component.preload()
    })
  } else {
    // Fallback for browsers that don't support requestIdleCallback
    setTimeout(() => {
      void component.preload()
    }, 1)
  }
}
