'use client'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useToastStore } from '@/main/services/toast/store'
import Toast from './Toast'

const ToastContainer = () => {
  const { toasts, getToastsByPosition } = useToastStore()

  // Create portal container if it doesn't exist
  useEffect(() => {
    const existingContainer = document.getElementById('toast-container')
    if (!existingContainer) {
      const container = document.createElement('div')
      container.id = 'toast-container'
      container.style.position = 'fixed'
      container.style.top = '0'
      container.style.left = '0'
      container.style.right = '0'
      container.style.bottom = '0'
      container.style.pointerEvents = 'none'
      container.style.zIndex = '9999'
      document.body.appendChild(container)
    }
  }, [])

  if (toasts.length === 0) return null

  const toastsByPosition = getToastsByPosition()

  // Position configurations
  const positionClasses = {
    'top-left': 'top-4 left-4 flex flex-col gap-2',
    'top-right': 'top-4 right-4 flex flex-col gap-2',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2 flex flex-col gap-2 items-center',
    'bottom-left': 'bottom-4 left-4 flex flex-col-reverse gap-2',
    'bottom-right': 'bottom-4 right-4 flex flex-col-reverse gap-2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col-reverse gap-2 items-center'
  }

  const containerElement = document.getElementById('toast-container')
  if (!containerElement) return null

  return createPortal(
    <>
      {Object.entries(toastsByPosition).map(([position, positionToasts]) => (
        <div
          key={position}
          className={`fixed ${positionClasses[position]} pointer-events-none z-50`}
          style={{ maxWidth: '400px' }}
        >
          {positionToasts.map((toast) => (
            <div key={toast.id} className="pointer-events-auto">
              <Toast toast={toast} />
            </div>
          ))}
        </div>
      ))}
    </>,
    containerElement
  )
}

export default ToastContainer
