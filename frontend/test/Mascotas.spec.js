import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Mascotas from '../src/components/Mascotas.vue'
import axios from 'axios'

// Mocks globales
vi.mock('axios')

describe('Mascotas.vue', () => {
  const mockMascotas = [
    {
      idMascota: 1,
      nombre: 'Luna',
      raza: 'Poodle',
      foto: 'luna.jpg',
      idDueno: 1,
      dueno: { nombres: 'Carlos', apellidos: 'Martínez' }
    }
  ]

  const mockDuenos = [
    { idDueno: 1, nombres: 'Carlos', apellidos: 'Martínez' },
    { idDueno: 2, nombres: 'María', apellidos: 'Ramos' }
  ]

  beforeEach(() => {
    vi.resetAllMocks()
    axios.get.mockImplementation((url) => {
      if (url.includes('/mascotas')) return Promise.resolve({ data: mockMascotas })
      if (url.includes('/duenos')) return Promise.resolve({ data: mockDuenos })
    })
  })

  it('renderiza tabla de mascotas con datos', async () => {
    const wrapper = mount(Mascotas)
    await flushPromises()

    expect(wrapper.text()).toContain('Luna')
    expect(wrapper.text()).toContain('Poodle')
    expect(wrapper.text()).toContain('Carlos Martínez')
    expect(wrapper.findAll('tbody tr')).toHaveLength(1)
  })

  it('abre el modal de registro al hacer clic en "Agregar mascota"', async () => {
    const wrapper = mount(Mascotas)
    await flushPromises()

    await wrapper.find('button').trigger('click') // Botón Agregar
    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.find('input[placeholder="Nombre *"]').exists()).toBe(true)
  })

  it('muestra error si se envía el formulario vacío', async () => {
    const wrapper = mount(Mascotas)
    await flushPromises()

    await wrapper.find('button').trigger('click') // Abre modal
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.text()).toContain('Todos los campos son requeridos')
  })

  it('al editar una mascota llena el modal con datos', async () => {
    const wrapper = mount(Mascotas)
    await flushPromises()

    await wrapper.find('button[title="Editar"]').trigger('click')
    expect(wrapper.find('input[placeholder="Nombre *"]').element.value).toBe('Luna')
    expect(wrapper.find('input[placeholder="Raza *"]').element.value).toBe('Poodle')
    expect(wrapper.find('select').element.value).toBe('1')
  })
})
