import { useEffect } from 'react'

/**
 * Keyboard shortcuts for game screens, e.g. { '1': pickFirst, Enter: next }.
 * Ignored while typing in a field; Enter and Space are left to a focused button so it is not triggered twice.
 */
export function useHotkeys(bindings: Record<string, () => void>, enabled = true) {
  useEffect(() => {
    if (!enabled) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || event.altKey || event.ctrlKey || event.metaKey) return
      const target = event.target instanceof Element ? event.target : null
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return
      if ((event.key === 'Enter' || event.key === ' ') && target?.closest('button, a')) return

      const handler = bindings[event.key]
      if (!handler) return
      event.preventDefault()
      handler()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [bindings, enabled])
}
