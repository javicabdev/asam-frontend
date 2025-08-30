import { ComponentType, ReactElement } from 'react'
import { PageTransition } from '@/components/common/PageTransition'

export type TransitionType = 'fade' | 'grow' | 'slide' | 'zoom' | 'none'

interface TransitionProps {
  type?: TransitionType
  duration?: number
  direction?: 'up' | 'down' | 'left' | 'right'
}

/**
 * HOC para envolver componentes con transición de página
 */
export const withPageTransition = <P extends object>(
  Component: ComponentType<P>,
  transitionProps?: TransitionProps
) => {
  const WrappedComponent = (props: P): ReactElement => (
    <PageTransition {...transitionProps}>
      <Component {...props} />
    </PageTransition>
  )
  
  WrappedComponent.displayName = `withPageTransition(${Component.displayName || Component.name || 'Component'})`
  
  return WrappedComponent
}
