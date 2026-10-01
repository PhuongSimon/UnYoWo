import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router'
import { Toaster } from 'sonner'
import { router } from '@/app/router'
import AuthBootstrap from '@/features/auth/components/AuthBootstrap'
import { queryClient } from '@/lib/query-client'
import { useThemeStore } from '@/stores/theme.store'

function App() {
  const theme = useThemeStore((s) => s.theme)

  return (
    <QueryClientProvider client={queryClient}>
      <AuthBootstrap>
        <RouterProvider router={router} />
      </AuthBootstrap>
      <Toaster position="top-right" richColors closeButton theme={theme} />
    </QueryClientProvider>
  )
}

export default App
