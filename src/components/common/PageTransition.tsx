import { ReactElement } from 'react'
import { Fade, Grow, Slide, Zoom } from '@mui/material'
import { TransitionProps } from '@mui/material/transitions'

export type TransitionType = 'fade' | 'grow' | 'slide' | 'zoom' | 'none'

interface PageTransitionProps {
  children: ReactElement
  type?: TransitionType
  duration?: number
  direction?: 'up' | 'down' | 'left' | 'right'
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
