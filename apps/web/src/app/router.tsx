import { createBrowserRouter } from 'react-router'
import { GuestOnly, HomeRedirect, RequireAuth } from '@/features/auth/components/RouteGuards'
import AuthLayout from '@/features/auth/layouts/AuthLayout'
import ForgotPasswordPage from '@/features/auth/pages/ForgotPasswordPage'
import GoogleCallbackPage from '@/features/auth/pages/GoogleCallbackPage'
import LoginPage from '@/features/auth/pages/LoginPage'
import RegisterPage from '@/features/auth/pages/RegisterPage'
import ResetPasswordPage from '@/features/auth/pages/ResetPasswordPage'
import VerifyOtpPage from '@/features/auth/pages/VerifyOtpPage'
import { NotFoundState } from '@/features/learn/components/ContentState'
import LanguageLayout from '@/features/learn/layouts/LanguageLayout'
import GrammarListPage from '@/features/learn/pages/GrammarListPage'
import GrammarTopicPage from '@/features/learn/pages/GrammarTopicPage'
import HomePage from '@/features/learn/pages/HomePage'
import OverviewPage from '@/features/learn/pages/OverviewPage'
import PronunciationPage from '@/features/learn/pages/PronunciationPage'
import WritingPage from '@/features/learn/pages/WritingPage'
import PlayPage from '@/features/practice/pages/PlayPage'
import ProgressPage from '@/features/progress/pages/ProgressPage'
import ReviewPage from '@/features/progress/pages/ReviewPage'
import PracticeHubPage from '@/features/practice/pages/PracticeHubPage'
import AppLayout from '@/layouts/AppLayout'
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
    children: [
      {
        path: '/app',
        element: <AppLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'play/:sessionId', element: <PlayPage /> },
          { path: 'review', element: <ReviewPage /> },
          { path: 'progress', element: <ProgressPage /> },
          {
            path: ':lang',
            element: <LanguageLayout />,
            children: [
              { index: true, element: <OverviewPage /> },
              { path: 'writing', element: <WritingPage /> },
              { path: 'pronunciation', element: <PronunciationPage /> },
              { path: 'grammar', element: <GrammarListPage /> },
              { path: 'grammar/:topicId', element: <GrammarTopicPage /> },
              { path: 'practice', element: <PracticeHubPage /> },
              { path: '*', element: <NotFoundState /> },
            ],
          },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
