
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Login from '../src/components/Login.vue'

describe('Login.vue', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    // Limpiar localStorage
    window.localStorage.clear()
  })

  it('renders the login form', () => {
    const wrapper = mount(Login)
    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.find('input[type="email"]').exists()).toBe(true)
    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('login exitoso guarda el token y navega', async () => {
    const mockToken = 'mocked-token-123'
    const axios = await import('axios')
    vi.spyOn(axios.default, 'post').mockResolvedValue({ data: { token: mockToken } })
    // Mock router
    const push = vi.fn()
    const wrapper = mount(Login, {
      global: {
        mocks: {
          $router: { push }
        }
      }
    })
    await wrapper.find('input[type="email"]').setValue('test@example.com')
    await wrapper.find('input[type="password"]').setValue('password123')
    await wrapper.find('form').trigger('submit.prevent')
    expect(window.localStorage.getItem('token')).toBe(mockToken)
    expect(push).toHaveBeenCalledWith('/dashboard')
  })

  it('login fallido muestra mensaje de error', async () => {
    vi.mock('axios', () => ({
      default: {
        post: vi.fn().mockRejectedValue(new Error('Credenciales incorrectas'))
      }
    }))
    const wrapper = mount(Login, {
      global: {
        mocks: {
          $router: { push: vi.fn() }
        }
      }
    })
    await wrapper.find('input[type="email"]').setValue('fail@example.com')
    await wrapper.find('input[type="password"]').setValue('wrongpass')
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('Credenciales incorrectas o error en el servidor')
  })
})
