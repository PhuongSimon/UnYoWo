import type { ReactNode } from 'react'
import googleLogo from '@/assets/google.svg'
import Button from '@/components/ui/Button'

interface GoogleButtonProps {
  children: ReactNode
}

function GoogleButton({ children }: GoogleButtonProps) {
  function handleClick() {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`
  }

  return (
    <Button variant="outline" onClick={handleClick} className="w-5/6 mx-auto shadow-sm">
      <img src={googleLogo} alt="Google" className="size-5" />
      {children}
    </Button>
  )
}

export default GoogleButton