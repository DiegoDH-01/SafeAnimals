import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import HelloWorld from '../components/HelloWorld.vue'

describe('HelloWorld.vue', () => {
    it('debe renderizar el mensaje recibido por props', () => {
        const wrapper = mount(HelloWorld, {
            props: {
                msg: 'Hola desde las pruebas'
            }
        })
        expect(wrapper.text()).toContain('Hola desde las pruebas')
    })

    it('debe mostrar el contador inicial en 0', () => {
        const wrapper = mount(HelloWorld, {
            props: { msg: 'Prueba' }
        })
        expect(wrapper.text()).toContain('count is 0')
    })

    it('debe incrementar el contador al hacer clic', async () => {
        const wrapper = mount(HelloWorld, {
            props: { msg: 'Contador' }
        })
        const button = wrapper.get('button')
        await button.trigger('click')
        expect(button.text()).toContain('count is 1')

        await button.trigger('click')
        expect(button.text()).toContain('count is 2')
    })
    it('debe incrementar correctamente tras 200 clics', async () => {
        //  ARRANGE: configurar el entorno y crear el componente
        const wrapper = mount(HelloWorld, {
            props: { msg: 'Clics masivos' }
        })
        const button = wrapper.get('button')

        //  ACT: ejecutar la acción (simular los clics)
        for (let i = 0; i < 200; i++) {
            await button.trigger('click')
        }

        //  ASSERT: verificar el resultado esperado
        expect(button.text()).toContain('count is 500')
    })

})
