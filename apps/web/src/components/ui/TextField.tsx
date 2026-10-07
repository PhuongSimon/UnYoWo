import { useId, type ReactNode, type InputHTMLAttributes, type Ref } from 'react'
import { useTranslation } from 'react-i18next'
import { translateError } from '@/lib/i18n-error'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  ref?: Ref<HTMLInputElement>
  endAdornment?: ReactNode
}

function TextField({ label, error, endAdornment, className = '', ...rest }: TextFieldProps) {
  const { t } = useTranslation()
  const id = useId()

  return (
    <div className={`group flex flex-col ${className}`}>
      <label
        htmlFor={id}
        className={`relative top-2 z-10 ml-2 w-fit bg-surface px-1 text-xs font-semibold transition-colors ${
          error ? 'text-danger' : 'text-label group-focus-within:text-accent'
        }`}
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          className={`w-full rounded-md border-2 bg-surface px-3 py-3 text-base text-fg outline-none transition-colors placeholder:text-muted/60 ${
            endAdornment ? 'pr-11' : ''
          } ${
            error
              ? 'border-red-500'
              : 'border-line hover:border-primary-400 focus:border-accent'
          }`}
          {...rest}
        />

        {endAdornment && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {endAdornment}
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-danger">{translateError(t, error)}</p>}
    </div>
  )
}

export default TextField
