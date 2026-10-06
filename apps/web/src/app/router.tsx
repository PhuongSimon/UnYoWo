import type { ComponentType } from 'react'
import { createBrowserRouter } from 'react-router'
import PageLoader from '@/components/PageLoader'
import RouteError from '@/components/RouteError'
import { GuestOnly, HomeRedirect, RequireAuth } from '@/features/auth/components/RouteGuards'
import AuthLayout from '@/features/auth/layouts/AuthLayout'
import ForgotPasswordPage from '@/features/auth/pages/ForgotPasswordPage'
import GoogleCallbackPage from '@/features/auth/pages/GoogleCallbackPage'
import LoginPage from '@/features/auth/pages/LoginPage'
import RegisterPage from '@/features/auth/pages/RegisterPage'
import ResetPasswordPage from '@/features/auth/pages/ResetPasswordPage'
import VerifyOtpPage from '@/features/auth/pages/VerifyOtpPage'
import { NotFoundState } from '@/features/learn/components/ContentState'
import AppLayout from '@/layouts/AppLayout'
import NotFoundPage from '@/pages/NotFoundPage'

/** Each signed-in page is its own chunk, downloaded the first time it is opened. */
const page = (load: () => Promise<{ default: ComponentType }>) => async () => ({ Component: (await load()).default })

/** Pages that fill the screen without scrolling on tablets and desktops (see AppLayout). */
export interface RouteHandle {
  fitViewport?: boolean
}

export const router = createBrowserRouter([
  { path: '/', element: <HomeRedirect /> },
  {
    element: <AuthLayout />,
    errorElement: <RouteError />,
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
    errorElement: <RouteError />,
    hydrateFallbackElement: <PageLoader />,
    children: [
      {
        path: '/app',
        element: <AppLayout />,
        children: [
          {
            index: true,
            handle: { fitViewport: true } satisfies RouteHandle,
            lazy: page(() => import('@/features/dashboard/pages/DashboardPage')),
          },
          { path: 'play/:sessionId', lazy: page(() => import('@/features/practice/pages/PlayPage')) },
          { path: 'review', lazy: page(() => import('@/features/progress/pages/ReviewPage')) },
          { path: 'progress', lazy: page(() => import('@/features/progress/pages/ProgressPage')) },
          { path: 'translate', lazy: page(() => import('@/features/translate/pages/TranslatePage')) },
          {
            path: ':lang',
            lazy: page(() => import('@/features/learn/layouts/LanguageLayout')),
            children: [
              { index: true, lazy: page(() => import('@/features/learn/pages/OverviewPage')) },
              { path: 'writing', lazy: page(() => import('@/features/learn/pages/WritingPage')) },
              { path: 'pronunciation', lazy: page(() => import('@/features/learn/pages/PronunciationPage')) },
              { path: 'grammar', lazy: page(() => import('@/features/learn/pages/GrammarListPage')) },
              { path: 'grammar/:topicId', lazy: page(() => import('@/features/learn/pages/GrammarTopicPage')) },
              { path: 'practice', lazy: page(() => import('@/features/practice/pages/PracticeHubPage')) },
              { path: 'practice/script', lazy: page(() => import('@/features/script-drill/pages/ScriptDrillPage')) },
              { path: 'practice/sets/:setId', lazy: page(() => import('@/features/practice/pages/SetWordsPage')) },
              { path: '*', element: <NotFoundState /> },
            ],
          },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
