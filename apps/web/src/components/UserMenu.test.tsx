import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'
import i18n from '@/i18n'
import { useAuthStore } from '@/stores/auth.store'
import { useThemeStore } from '@/stores/theme.store'
import UserMenu from './UserMenu'

function renderMenu() {
  const router = createMemoryRouter([{ path: '/', element: <UserMenu /> }])
  render(<RouterProvider router={router} />)
}

describe('UserMenu color theme picker', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')
    localStorage.clear()
    delete document.documentElement.dataset.theme
    useThemeStore.setState({ colorTheme: 'warm' })
    useAuthStore.setState({
      user: {
        id: 'u1',
        email: 'learner@example.com',
        fullName: 'Lan',
        avatarUrl: null,
        emailVerified: true,
        hasPassword: true,
        timezone: 'Asia/Ho_Chi_Minh',
      },
      status: 'authenticated',
    })
  })

  it('marks the current theme and switches to the one picked', async () => {
    const user = userEvent.setup()
    renderMenu()

    await user.click(screen.getByRole('button', { name: 'Open account menu' }))
    expect(screen.getByRole('menuitemradio', { name: 'Terracotta' })).toHaveAttribute('aria-checked', 'true')

    await user.click(screen.getByRole('menuitemradio', { name: 'Royal violet' }))

    expect(screen.getByRole('menuitemradio', { name: 'Royal violet' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('menuitemradio', { name: 'Terracotta' })).toHaveAttribute('aria-checked', 'false')
    expect(document.documentElement.dataset.theme).toBe('violet')
    expect(localStorage.getItem('color-theme')).toBe('violet')
  })

  it('keeps the menu open so themes can be compared one after another', async () => {
    const user = userEvent.setup()
    renderMenu()

    await user.click(screen.getByRole('button', { name: 'Open account menu' }))
    await user.click(screen.getByRole('menuitemradio', { name: 'Navy gold' }))

    expect(screen.getByRole('menu')).toBeInTheDocument()
    expect(document.documentElement.dataset.theme).toBe('navy')
  })
})
