import { RouterProvider } from 'react-router'
import { Toaster } from 'sonner'
import { router } from '@/app/router'
import AuthBootstrap from '@/features/auth/components/AuthBootstrap'
import { useThemeStore } from '@/stores/theme.store'

function App() {
  const theme = useThemeStore((s) => s.theme)

  return (
    <>
      <AuthBootstrap>
        <RouterProvider router={router} />
      </AuthBootstrap>
      <Toaster position="top-right" richColors closeButton theme={theme} />
    </>
  )
}

export default App
