import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as servicioService from '../../backend/services/servicio.Service'
import { Servicio, EstadoServicio } from '../../backend/models'

// Mock explícito del módulo de notificación para evitar conexión a Twilio o DB
vi.mock('../../backend/services/notificacion.Service', () => ({
  registrarNotificacion: vi.fn(() => Promise.resolve())
}))

describe('Control de Estados del Servicio', () => {
  const servicioMock = {
    idServicio: 1,
    idEstadoActual: 2,
    save: vi.fn(),
    set: vi.fn()
  }

  const estadoMock = { idEstado: 3, nombreEstado: 'Finalizado' }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('avanza al siguiente estado correctamente', async () => {
    vi.spyOn(Servicio, 'findOne').mockResolvedValue(servicioMock)
    vi.spyOn(EstadoServicio, 'findByPk').mockResolvedValueOnce({ idEstado: 2, nombreEstado: 'En proceso' })
    vi.spyOn(EstadoServicio, 'findOne').mockResolvedValueOnce(estadoMock)

    const result = await servicioService.avanzarEstado(1)

    expect(result).toEqual(servicioMock)
    expect(servicioMock.idEstadoActual).toBe(3)
    expect(servicioMock.save).toHaveBeenCalled()
  })

  it('retrocede al estado anterior correctamente', async () => {
    vi.spyOn(Servicio, 'findOne').mockResolvedValue(servicioMock)
    vi.spyOn(EstadoServicio, 'findByPk').mockResolvedValue({ idEstado: 2, nombreEstado: 'En proceso' })
    vi.spyOn(EstadoServicio, 'findOne').mockResolvedValue({ idEstado: 1, nombreEstado: 'Recibido' })

    const result = await servicioService.retrocederEstado(1)

    expect(result).toEqual(servicioMock)
    expect(servicioMock.idEstadoActual).toBe(1)
    expect(servicioMock.save).toHaveBeenCalled()
  })

  it('lanza error si ya está en "entregado" y se intenta retroceder', async () => {
    vi.spyOn(Servicio, 'findOne').mockResolvedValue(servicioMock)
    vi.spyOn(EstadoServicio, 'findByPk').mockResolvedValue({ idEstado: 4, nombreEstado: 'Entregado' })

    await expect(servicioService.retrocederEstado(1)).rejects.toThrow('No se puede retroceder: el servicio ya fue entregado')
  })
})
