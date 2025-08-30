import { useState, useCallback } from 'react'

/**
 * Hook para controlar el LoadingOverlay programáticamente
 */
export const useLoadingOverlay = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('Cargando...')

  const show = useCallback((msg?: string) => {
    if (msg) setMessage(msg)
    setIsOpen(true)
  }, [])

  const hide = useCallback(() => {
    setIsOpen(false)
  }, [])

  return {
    isOpen,
    message,
    show,
    hide,
  }
}
