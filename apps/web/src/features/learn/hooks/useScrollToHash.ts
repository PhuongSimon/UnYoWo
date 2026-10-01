import { useEffect } from 'react'
import { useLocation } from 'react-router'

/** Lessons render after an async load, so the browser's own jump to #section misses them; redo it once the page is mounted. */
export function useScrollToHash() {
  const { hash } = useLocation()

  useEffect(() => {
    if (!hash) return
    document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView()
  }, [hash])
}
