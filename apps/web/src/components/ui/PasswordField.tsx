import { Eye, EyeOff } from 'lucide-react'
import { useState, type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import TextField from './TextField'

type PasswordFieldProps = Omit<ComponentProps<typeof TextField>, 'type' | 'endAdornment'>

function PasswordField(props: PasswordFieldProps) {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)

  return (
    <TextField
      {...props}
      type={visible ? 'text' : 'password'}
      endAdornment={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? t('common.hidePassword') : t('common.showPassword')}
          className="text-muted hover:text-accent"
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      }
    />
  )
}

export default PasswordField