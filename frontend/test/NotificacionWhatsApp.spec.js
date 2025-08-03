import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as notificacionService from '../../backend/services/notificacion.Service'
import { Notificacion, Servicio } from '../../backend/models'

// ✅ Mocks de entorno
process.env.TWILIO_SID = 'fake_sid'
process.env.TWILIO_TOKEN = 'fake_token'
process.env.TWILIO_PHONE = 'whatsapp:+11111111111'

describe('Notificación WhatsApp', () => {
  const mockMensaje = {
    idServicio: 1,
    tipo: 'entregado'
  }

  const mockTwilioClient = {
    messages: {
      create: vi.fn()
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()

    // ✅ inyectar mock de twilio manualmente
    notificacionService.__setTwilioClient(mockTwilioClient)

    vi.spyOn(Servicio, 'findOne').mockResolvedValue({
      idServicio: 1,
      activo: true,
      referencia: 'baño y corte',
      mascota: {
        nombre: 'Firulais',
        dueno: {
          nombres: 'Carlos',
          celular: '0912345678'
        }
      }
    })

    vi.spyOn(Notificacion, 'findOne').mockResolvedValue(null)
  })

  it('envía mensaje y guarda notificación en la base de datos', async () => {
    mockTwilioClient.messages.create.mockResolvedValue({ sid: 'SM123456789' })
    const spyCreate = vi.spyOn(Notificacion, 'create').mockResolvedValue({ id: 1 })

    const result = await notificacionService.registrarNotificacion(mockMensaje)

    expect(mockTwilioClient.messages.create).toHaveBeenCalledWith(expect.objectContaining({
      to: 'whatsapp:+593912345678',
      body: expect.stringContaining('Firulais')
    }))
    expect(spyCreate).toHaveBeenCalled()
    expect(result).toHaveProperty('id')
  })

  it('lanza error si falla el envío de Twilio', async () => {
    mockTwilioClient.messages.create.mockRejectedValue(new Error('Error de Twilio'))

    await expect(notificacionService.registrarNotificacion(mockMensaje))
      .rejects.toThrow('Error de Twilio')
  })
})
