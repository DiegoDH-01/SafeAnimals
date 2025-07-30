import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import Duenos from '../src/components/Duenos.vue'
import axios from 'axios'

const mockDuenos = [
  { idDueno: 1, nombres: 'Juan', apellidos: 'Pérez', celular: '1234567890', email: 'juan@mail.com' },
  { idDueno: 2, nombres: 'Ana', apellidos: 'García', celular: '0987654321', email: 'ana@mail.com' }
]

vi.mock('../src/services/dueno', () => ({
  getDuenos: vi.fn(() => Promise.resolve(mockDuenos))
}))

let postSpy, putSpy, wrapper;

beforeEach(async () => {
  postSpy = vi.spyOn(axios, 'post').mockResolvedValue({});
  putSpy = vi.spyOn(axios, 'put').mockResolvedValue({});
  wrapper = mount(Duenos);
  await flushPromises();
});

afterEach(() => {
  postSpy.mockRestore();
  putSpy.mockRestore();
});

describe('Duenos.vue', () => {
  it('registra 20 dueños nuevos correctamente usando el modal', async () => {
    for (let i = 1; i <= 20; i++) {
      await wrapper.find('button').trigger('click')
      await wrapper.find('input[placeholder="Nombres *"]').setValue(`Nombre${i}`)
      await wrapper.find('input[placeholder="Apellidos *"]').setValue(`Apellido${i}`)
      await wrapper.find('input[placeholder="Celular"]').setValue('1234567890')
      await wrapper.find('input[placeholder="Email"]').setValue(`test${i}@mail.com`)
      await wrapper.find('form').trigger('submit.prevent')
      await flushPromises()
    }
    expect(postSpy).toHaveBeenCalledTimes(20)
  })

  it('renderiza el título y el botón', () => {
    expect(wrapper.find('h2').text()).toContain('Dueños registrados')
    expect(wrapper.find('button').text()).toContain('Agregar dueño')
  })

  it('muestra la tabla con los dueños', () => {
    const rows = wrapper.findAll('tbody tr')
    expect(rows.length).toBe(2)
    expect(rows[0].text()).toContain('Juan')
    expect(rows[1].text()).toContain('Ana')
  })

  it('filtra los dueños por búsqueda', async () => {
    await wrapper.find('input[type="text"]').setValue('Ana')
    await flushPromises()
    const rows = wrapper.findAll('tbody tr')
    expect(rows.length).toBe(1)
    expect(rows[0].text()).toContain('Ana')
  })

  it('muestra mensaje si no hay dueños', async () => {
    await wrapper.find('input[type="text"]').setValue('NoExiste')
    await flushPromises()
    expect(wrapper.find('.table-empty').text()).toContain('No se encontraron dueños')
  })

  it('abre y cierra el modal', async () => {
    await wrapper.find('button').trigger('click')
    expect(wrapper.find('.modal-bg').exists()).toBe(true)
    await wrapper.find('.modal-close').trigger('click')
    expect(wrapper.find('.modal-bg').exists()).toBe(false)
  })

  it('valida el celular en el formulario', async () => {
    await wrapper.find('button').trigger('click')
    await wrapper.find('input[placeholder="Nombres *"]').setValue('TestNombre')
    await wrapper.find('input[placeholder="Apellidos *"]').setValue('TestApellido')
    const celularInput = wrapper.find('input[placeholder="Celular"]')
    await celularInput.setValue('123')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()
    expect(wrapper.find('.modal-error').text()).toContain('El celular debe contener exactamente 10 dígitos numéricos')
  })

  it('llama a editDueno al hacer click en editar', async () => {
    const spy = vi.spyOn(wrapper.vm, 'editDueno')
    await wrapper.findAll('.icon-btn')[0].trigger('click')
    expect(spy).toHaveBeenCalled()
  })

  it('llama a deleteDueno al hacer click en eliminar', async () => {
    const spy = vi.spyOn(wrapper.vm, 'deleteDueno')
    await wrapper.findAll('.icon-btn--delete')[0].trigger('click')
    expect(spy).toHaveBeenCalled()
  })

  it('paginación: muestra controles si hay más de una página', async () => {
    const { getDuenos } = await import('../src/services/dueno')
    getDuenos.mockResolvedValue(Array.from({ length: 11 }, (_, i) => ({ idDueno: i, nombres: `Nombre${i}`, apellidos: 'Test', celular: '1234567890', email: `test${i}@mail.com` })))
    wrapper = mount(Duenos)
    await flushPromises()
    expect(wrapper.find('.table-pagination').exists()).toBe(true)
    expect(wrapper.text()).toContain('Página 1 de 2')
  })

  it('abre el modal y muestra los campos requeridos', async () => {
    await wrapper.find('button').trigger('click')
    expect(wrapper.find('.modal-bg').exists()).toBe(true)
    expect(wrapper.find('input[placeholder="Nombres *"]').exists()).toBe(true)
    expect(wrapper.find('input[placeholder="Apellidos *"]').exists()).toBe(true)
    expect(wrapper.find('input[placeholder="Celular"]').exists()).toBe(true)
    expect(wrapper.find('input[placeholder="Email"]').exists()).toBe(true)
  })

  it('muestra error si los campos requeridos están vacíos', async () => {
    await wrapper.find('button').trigger('click')
    await wrapper.find('input[placeholder="Nombres *"]').setValue('')
    await wrapper.find('input[placeholder="Apellidos *"]').setValue('')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()
    expect(wrapper.find('input[placeholder="Nombres *"]').element.value).toBe('')
    expect(wrapper.find('input[placeholder="Apellidos *"]').element.value).toBe('')
  })

  it('registra un dueño nuevo correctamente', async () => {
    await wrapper.find('button').trigger('click')
    await wrapper.find('input[placeholder="Nombres *"]').setValue('Carlos')
    await wrapper.find('input[placeholder="Apellidos *"]').setValue('Ramírez')
    await wrapper.find('input[placeholder="Celular"]').setValue('1234567890')
    await wrapper.find('input[placeholder="Email"]').setValue('carlos@mail.com')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()
    expect(postSpy).toHaveBeenCalled()
  })

  it('edita un dueño correctamente', async () => {
    await wrapper.findAll('.icon-btn')[0].trigger('click')
    await wrapper.find('input[placeholder="Nombres *"]').setValue('Juan Editado')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()
    expect(putSpy).toHaveBeenCalled()
  })

  it('cierra el modal al hacer click en cancelar', async () => {
    await wrapper.find('button').trigger('click')
    expect(wrapper.find('.modal-bg').exists()).toBe(true)
    await wrapper.find('.modal-btn--cancel').trigger('click')
    expect(wrapper.find('.modal-bg').exists()).toBe(false)
  })

  it('muestra mensaje de error si la API falla', async () => {
    postSpy.mockRejectedValueOnce({ response: { data: { error: 'Error al guardar dueño' } } })
    await wrapper.find('button').trigger('click')
    await wrapper.find('input[placeholder="Nombres *"]').setValue('Carlos')
    await wrapper.find('input[placeholder="Apellidos *"]').setValue('Ramírez')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()
    expect(wrapper.find('.modal-error').text()).toContain('Error al guardar dueño')
  })
})
