import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

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
