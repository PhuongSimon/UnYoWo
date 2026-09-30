import { RouterProvider } from 'react-router'
import { Toaster } from 'sonner'
import { router } from '@/app/router'
import { useThemeStore } from '@/stores/theme.store'

function App() {
  const theme = useThemeStore((s) => s.theme)

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors closeButton theme={theme} />
    </>
  )
}

export default App
