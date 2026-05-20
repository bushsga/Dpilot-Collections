"use client"

import { useEffect, useState } from 'react'

export default function DevErrorOverlay() {
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    const onError = (ev: ErrorEvent) => {
      const msg = ev?.message || String(ev)
      setErrors((s) => [msg, ...s].slice(0, 10))
      console.error('Captured error:', ev)
    }

    const onRejection = (ev: PromiseRejectionEvent) => {
      const reason = ev?.reason && (ev.reason.message || String(ev.reason))
      setErrors((s) => [reason || 'Unhandled promise rejection', ...s].slice(0, 10))
      console.error('Captured unhandledrejection:', ev)
    }

    window.addEventListener('error', onError)
    window.addEventListener('unhandledrejection', onRejection)

    return () => {
      window.removeEventListener('error', onError)
      window.removeEventListener('unhandledrejection', onRejection)
    }
  }, [])

  if (errors.length === 0) return null

  return (
    <div className="fixed bottom-2 left-2 right-2 z-[9999] max-h-40 overflow-auto bg-red-600 text-white p-2 text-xs rounded">
      <div className="flex justify-between items-center mb-1">
        <strong className="text-sm">Runtime Errors</strong>
        <button
          onClick={() => setErrors([])}
          className="bg-white/10 px-2 py-1 rounded text-xs"
        >
          Clear
        </button>
      </div>
      <div className="space-y-1">
        {errors.map((e, i) => (
          <div key={i} className="break-words">
            {e}
          </div>
        ))}
      </div>
    </div>
  )
}
