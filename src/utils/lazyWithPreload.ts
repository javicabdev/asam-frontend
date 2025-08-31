import { lazy, ComponentType, LazyExoticComponent } from 'react'

// Type for module with named exports
type ModuleWithNamedExports<T> = { [key: string]: T }
type ImportedModule<T> = { default: T } | ModuleWithNamedExports<T>

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
  importFunc: () => Promise<ImportedModule<T>>,
  namedExport?: string
): PreloadableComponent<T> {
  let preloadedModule: ImportedModule<T> | null = null
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
      const namedModule = module as ModuleWithNamedExports<T>
      return { default: namedModule[namedExport] }
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

