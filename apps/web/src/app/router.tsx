import { createBrowserRouter } from 'react-router'
import { GuestOnly, HomeRedirect, RequireAuth } from '@/features/auth/components/RouteGuards'
import AuthLayout from '@/features/auth/layouts/AuthLayout'
import ForgotPasswordPage from '@/features/auth/pages/ForgotPasswordPage'
import GoogleCallbackPage from '@/features/auth/pages/GoogleCallbackPage'
import LoginPage from '@/features/auth/pages/LoginPage'
import RegisterPage from '@/features/auth/pages/RegisterPage'
import ResetPasswordPage from '@/features/auth/pages/ResetPasswordPage'
import VerifyOtpPage from '@/features/auth/pages/VerifyOtpPage'
import DashboardPage from '@/pages/DashboardPage'
import NotFoundPage from '@/pages/NotFoundPage'

export const router = createBrowserRouter([
  { path: '/', element: <HomeRedirect /> },
  {
    element: <AuthLayout />,
    children: [
      {
        element: <GuestOnly />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/register', element: <RegisterPage /> },
          { path: '/forgot-password', element: <ForgotPasswordPage /> },
          { path: '/verify-otp', element: <VerifyOtpPage /> },
          { path: '/reset-password', element: <ResetPasswordPage /> },
        ],
      },
      { path: '/auth/google/callback', element: <GoogleCallbackPage /> },
    ],
  },
  {
    element: <RequireAuth />,
    children: [{ path: '/app', element: <DashboardPage /> }],
  },
  { path: '*', element: <NotFoundPage /> },
])
