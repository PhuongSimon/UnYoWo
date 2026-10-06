import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'
import '@/i18n'

// jsdom has no layout: every media query (min-width, reduced motion…) reports "no match", like a phone.
window.matchMedia ??= (query: string) =>
  ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }) as MediaQueryList
// …and no scrolling either.
Element.prototype.scrollIntoView ??= () => {}

afterEach(() => {
  cleanup()
})
