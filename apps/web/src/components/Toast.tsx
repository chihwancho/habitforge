import { useEffect, useState } from 'react'

export interface Toast {
  id: string
  message: string
  type: 'badge' | 'xp' | 'info'
}

interface ToastContainerProps {
  toasts: Toast[]
  onDismiss: (id: string) => void
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onDismiss={() => onDismiss(toast.id)} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true)
      setTimeout(onDismiss, 300)
    }, 4000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  const icon = toast.type === 'badge' ? '★' : toast.type === 'xp' ? '⚡' : 'ℹ'

  return (
    <div
      className={`toast toast-${toast.type} ${exiting ? 'toast-exit' : 'toast-enter'}`}
      onClick={() => { setExiting(true); setTimeout(onDismiss, 300) }}
    >
      <span className="toast-icon">{icon}</span>
      <span className="toast-message">{toast.message}</span>
    </div>
  )
}

let toastCounter = 0

export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (message: string, type: Toast['type'] = 'info') => {
    const id = `toast-${++toastCounter}`
    setToasts(prev => [...prev, { id, message, type }])
  }

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  return { toasts, addToast, dismissToast }
}