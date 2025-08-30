import { ReactElement, ComponentType, useEffect, useState } from 'react'
import { Fade, Grow, Slide, Zoom } from '@mui/material'
import { TransitionProps } from '@mui/material/transitions'
import { useLocation } from 'react-router-dom'

export type TransitionType = 'fade' | 'grow' | 'slide' | 'zoom' | 'none'

interface PageTransitionProps {
  children: ReactElement
  type?: TransitionType
  duration?: number
  direction?: 'up' | 'down' | 'left' | 'right'
}

/**
 * Hook para gestionar el estado de transición de página
 */
export const usePageTransition = () => {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setIsTransitioning(true)
    const timer = setTimeout(() => {
      setIsTransitioning(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [location])

  return { isTransitioning }
}

/**
 * HOC para envolver componentes con transición de página
 */
export const withPageTransition = <P extends object>(
  Component: ComponentType<P>,
  transitionProps?: Omit<PageTransitionProps, 'children'>
) => {
  return (props: P) => (
    <PageTransition {...transitionProps}>
      <Component {...props} />
    </PageTransition>
  )
}

export const PageTransition = ({
  children,
  type = 'fade',
  duration = 300,
  direction = 'up',
}: PageTransitionProps) => {
  const transitionProps: Partial<TransitionProps> = {
    in: true,
    timeout: duration,
  }

  switch (type) {
    case 'fade':
      return <Fade {...transitionProps}>{children}</Fade>

    case 'grow':
      return <Grow {...transitionProps}>{children}</Grow>

    case 'slide':
      return (
        <Slide {...transitionProps} direction={direction}>
          {children}
        </Slide>
      )

    case 'zoom':
      return <Zoom {...transitionProps}>{children}</Zoom>

    case 'none':
    default:
      return children
  }
}
