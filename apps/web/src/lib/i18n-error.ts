import type { TFunction } from 'i18next'

type ErrorValues = Record<string, string | number>

// Zod/react-hook-form only keep a string `message`, so params are packed into it as JSON.
export function errorKey(key: string, values?: ErrorValues): string {
  return values ? JSON.stringify({ key, values }) : key
}

export function translateError(t: TFunction, message: string): string {
  if (message.startsWith('{')) {
    try {
      const { key, values } = JSON.parse(message) as { key: string; values?: ErrorValues }
      return t(key, values)
    } catch {
      return message
    }
  }
  return t(message)
}
