import React from 'react'
import { PageTransition } from '@/components/common/PageTransition'
import type { TransitionType } from '@/components/common/PageTransition'

// Higher-order component for animated routes
export const withPageTransition = <P extends object>(
  Component: React.ComponentType<P>,
  transitionType: TransitionType = 'fade'
) => {
  return (props: P) => (
    <PageTransition type={transitionType}>
      <div>
        <Component {...props} />
      </div>
    </PageTransition>
  )
}
