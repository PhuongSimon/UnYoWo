import { useState } from 'react'
import type { DrillMode } from './drill'
import type { DrillScriptId } from './scripts'

interface DrillPrefs {
  mode: DrillMode
  /** Read each character aloud after answering it */
  speak: boolean
}

const PREFS_KEY = 'unyowo.drill.prefs'
const selectionKey = (script: DrillScriptId) => `unyowo.drill.${script}.selected`
const DEFAULT_PREFS: DrillPrefs = { mode: 'continuous', speak: false }

// Storage may be blocked (private mode) or hold old data: fall back to the defaults.
function read<T>(key: string, fallback: T, valid: (value: unknown) => value is T): T {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) ?? 'null')
    return valid(value) ? value : fallback
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Not saved this time; the drill still works.
  }
}

const isPrefs = (value: unknown): value is DrillPrefs =>
  typeof value === 'object' && value !== null && ['continuous', 'enter'].includes((value as DrillPrefs).mode) && typeof (value as DrillPrefs).speak === 'boolean'

const isStringList = (value: unknown): value is string[] => Array.isArray(value) && value.every((item) => typeof item === 'string')

// Saved when the user changes something, not from an effect: a render React prepares in the
// background (while a route loads) would otherwise write back the old value it started with.

/** Answer mode and sound, shared by every script. */
export function useDrillPrefs() {
  const [prefs, setPrefs] = useState(() => read(PREFS_KEY, DEFAULT_PREFS, isPrefs))
  const update = (changes: Partial<DrillPrefs>) => {
    const next = { ...prefs, ...changes }
    setPrefs(next)
    write(PREFS_KEY, next)
  }
  return [prefs, update] as const
}

/** The characters ticked for a script, remembered per script (hiragana and katakana separately). */
export function useDrillSelection(script: DrillScriptId) {
  const [selected, setSelected] = useState(() => new Set(read(selectionKey(script), [], isStringList)))
  const update = (next: Set<string>) => {
    setSelected(next)
    write(selectionKey(script), [...next])
  }
  return [selected, update] as const
}
