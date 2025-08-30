import React, { useCallback } from 'react'
import { useSnackbar, VariantType, SnackbarKey } from 'notistack'
import { IconButton } from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'

export interface NotificationOptions {
  duration?: number
  persist?: boolean
  preventDuplicate?: boolean
  action?: React.ReactNode
}

interface NotificationResult {
  id: SnackbarKey
}

/**
 * Unified notification system hook
 * Provides consistent notification methods across the application
 */
export const useNotification = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const showNotification = useCallback(
    (message: string, variant: VariantType, options?: NotificationOptions): NotificationResult => {
      const id = enqueueSnackbar(message, {
        variant,
        autoHideDuration: options?.persist ? null : (options?.duration ?? 5000),
        preventDuplicate: options?.preventDuplicate ?? true,
        action:
          options?.action ??
          ((snackbarId) => (
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => closeSnackbar(snackbarId)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )),
      })

      return { id }
    },
    [enqueueSnackbar, closeSnackbar]
  )

  const success = useCallback(
    (message: string, options?: NotificationOptions) => {
      console.log('[Notification] Success:', message)
      return showNotification(message, 'success', options)
    },
    [showNotification]
  )

  const error = useCallback(
    (message: string, options?: NotificationOptions) => {
      console.error('[Notification] Error:', message)
      return showNotification(message, 'error', {
        ...options,
        duration: options?.duration ?? 7000, // Errors stay longer
      })
    },
    [showNotification]
  )

  const warning = useCallback(
    (message: string, options?: NotificationOptions) => {
      console.warn('[Notification] Warning:', message)
      return showNotification(message, 'warning', options)
    },
    [showNotification]
  )

  const info = useCallback(
    (message: string, options?: NotificationOptions) => {
      console.info('[Notification] Info:', message)
      return showNotification(message, 'info', options)
    },
    [showNotification]
  )

  const loading = useCallback(
    (message: string = 'Cargando...', options?: NotificationOptions) => {
      console.info('[Notification] Loading:', message)
      return showNotification(message, 'info', {
        ...options,
        persist: true, // Loading notifications don't auto-hide
      })
    },
    [showNotification]
  )

  const dismiss = useCallback(
    (id: SnackbarKey) => {
      closeSnackbar(id)
    },
    [closeSnackbar]
  )

  const dismissAll = useCallback(() => {
    closeSnackbar()
  }, [closeSnackbar])

  return {
    success,
    error,
    warning,
    info,
    loading,
    dismiss,
    dismissAll,
  }
}

/**
 * Helper hook for async operations with notifications
 */
export const useAsyncNotification = () => {
  const notification = useNotification()

  const executeWithNotification = useCallback(
    async <T,>(
      asyncFn: () => Promise<T>,
      {
        loadingMessage = 'Procesando...',
        successMessage = 'Operación completada',
        errorMessage = 'Error en la operación',
        onSuccess,
        onError,
      }: {
        loadingMessage?: string
        successMessage?: string | ((result: T) => string)
        errorMessage?: string | ((error: unknown) => string)
        onSuccess?: (result: T) => void
        onError?: (error: unknown) => void
      } = {}
    ): Promise<T | null> => {
      const loadingNotification = notification.loading(loadingMessage)

      try {
        const result = await asyncFn()

        notification.dismiss(loadingNotification.id)

        const successMsg =
          typeof successMessage === 'function' ? successMessage(result) : successMessage
        notification.success(successMsg)

        onSuccess?.(result)
        return result
      } catch (error) {
        notification.dismiss(loadingNotification.id)

        const errorMsg = typeof errorMessage === 'function' ? errorMessage(error) : errorMessage
        notification.error(errorMsg)

        onError?.(error)
        return null
      }
    },
    [notification]
  )

  return {
    ...notification,
    executeWithNotification,
  }
}
