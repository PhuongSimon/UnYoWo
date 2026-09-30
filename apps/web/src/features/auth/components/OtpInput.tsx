import { useEffect, useRef, type ChangeEvent, type ClipboardEvent, type KeyboardEvent } from 'react'

interface OtpInputProps {
  value: string
  onChange: (value: string) => void
  length?: number
  error?: boolean
  disabled?: boolean
}

function OtpInput({ value, onChange, length = 6, error = false, disabled = false }: OtpInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  const digits = Array.from({ length }, (_, i) => (value[i] ?? '').trim())

  function focusInput(index: number) {
    const target = inputsRef.current[Math.max(0, Math.min(index, length - 1))]
    target?.focus()
    target?.select()
  }

  useEffect(() => {
    if (!disabled && value === '') {
      inputsRef.current[0]?.focus()
    }
  }, [disabled, value])

  function updateDigit(index: number, digit: string) {
    if (index < 0 || index >= length) return

    const next = [...digits]
    next[index] = digit
    onChange(next.map((d) => d || ' ').join('').trimEnd())
  }

  function handleChange(index: number, e: ChangeEvent<HTMLInputElement>) {
    const digit = e.target.value.replace(/\D/g, '').slice(-1)
    if (!digit) return

    updateDigit(index, digit)
    focusInput(index + 1)
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace') {
      e.preventDefault()
      if (digits[index]) {
        updateDigit(index, '')
      } else {
        updateDigit(index - 1, '')
        focusInput(index - 1)
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      focusInput(index - 1)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      focusInput(index + 1)
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (!pasted) return

    onChange(pasted)
    focusInput(pasted.length)
  }

  return (
    <div className="flex w-full justify-center gap-2">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={(e) => handlePaste(e)}
          onFocus={(e) => e.target.select()}
          aria-label={`Digit ${index + 1}`}
          className={`h-12 min-w-0 flex-1 max-w-12 sm:h-14 sm:max-w-14 rounded-lg border text-center text-xl font-semibold outline-none focus:ring-3 disabled:opacity-50 ${
            error
              ? 'border-red-500 focus:ring-red-500/25'
              : 'border-line bg-surface-raised text-fg hover:border-primary-400 focus:border-primary-500 focus:ring-primary-500/25'
          }`}
        />
      ))}
    </div>
  )
}

export default OtpInput