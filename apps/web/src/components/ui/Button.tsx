import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import DotsLoader from './DotsLoader'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline'
  loading?: boolean
  children: ReactNode
}

const variantClasses = {
  primary: `
    bg-brand
    text-on-brand
    border-brand-edge
    hover:bg-brand-hover
    shadow-lg
    shadow-brand/20
    hover:shadow-brand/35
  `,

  outline: `
    border
    bg-surface-raised
    text-fg
    border-line-soft
    hover:bg-surface
    hover:border-primary-400
  `,
}

function Button({
  children,
  variant = 'primary',
  loading = false,
  disabled,
  className = '',
  type = 'button',
  ...rest
}: ButtonProps) {
  const { t } = useTranslation()
  const isDisabled = disabled || loading

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={`
        group
        relative
        inline-flex
        items-center
        justify-center
        gap-2
        px-6
        py-3
        rounded-xl
        font-bold
        tracking-wide
        text-sm
        border-b-4
        transition-all
        duration-300
        ease-in-out

        hover:-translate-y-0.5
        active:translate-y-0
        active:border-b-2

        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-accent
        focus-visible:ring-offset-2
        focus-visible:ring-offset-surface

        disabled:pointer-events-none
        disabled:cursor-not-allowed
        ${loading ? '' : 'disabled:opacity-50'}

        ${variantClasses[variant]}
        ${className}
      `}
      {...rest}
    >
      <span className={`inline-flex items-center gap-2 ${loading ? 'invisible' : ''}`}>
        {children}
      </span>

      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <DotsLoader size="sm" />
          <span className="sr-only">{t('common.processing')}</span>
        </span>
      )}

      <span
        className="
          absolute
          -inset-1
          -z-10
          rounded-xl
          bg-gradient-to-br
          from-primary-400/20
          to-secondary-300/30
          blur-2xl
          opacity-0
          transition-all
          duration-300
          group-hover:opacity-100
          group-hover:blur-xl
        "
        aria-hidden="true"
      />
    </button>
  )
}

export default Button