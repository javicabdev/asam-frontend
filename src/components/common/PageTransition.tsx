import { ReactElement, ReactNode } from 'react';
import { Fade, Grow, Slide, Zoom } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';

export type TransitionType = 'fade' | 'grow' | 'slide' | 'zoom' | 'none';

interface PageTransitionProps {
  children: ReactElement;
  type?: TransitionType;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export const PageTransition = ({ 
  children, 
  type = 'fade', 
  duration = 300,
  direction = 'up' 
}: PageTransitionProps) => {
  const transitionProps: Partial<TransitionProps> = {
    in: true,
    timeout: duration,
  };

  switch (type) {
    case 'fade':
      return (
        <Fade {...transitionProps}>
          {children}
        </Fade>
      );
    
    case 'grow':
      return (
        <Grow {...transitionProps}>
          {children}
        </Grow>
      );
    
    case 'slide':
      return (
        <Slide {...transitionProps} direction={direction}>
          {children}
        </Slide>
      );
    
    case 'zoom':
      return (
        <Zoom {...transitionProps}>
          {children}
        </Zoom>
      );
    
    case 'none':
    default:
      return children;
  }
};

// Custom hook for page transitions
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export const usePageTransition = () => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return { isTransitioning };
};

// Higher-order component for animated routes
export const withPageTransition = (
  Component: React.ComponentType<any>,
  transitionType: TransitionType = 'fade'
) => {
  return (props: any) => (
    <PageTransition type={transitionType}>
      <div>
        <Component {...props} />
      </div>
    </PageTransition>
  );
};
