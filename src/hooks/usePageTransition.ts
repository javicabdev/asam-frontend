import { useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

export const usePageTransition = () => {
  const location = useLocation()
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    setIsTransitioning(true)
    const timer = setTimeout(() => {
      setIsTransitioning(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [location.pathname])

  return { isTransitioning }
}
