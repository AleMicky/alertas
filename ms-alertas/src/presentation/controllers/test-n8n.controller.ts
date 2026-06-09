import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NotificationService } from 'src/app/services/notification.service';
import { SendTestN8nDto } from '../dto/test-n8n/send-test-n8n.dto';

@Controller('test-n8n')
@ApiTags('Pruebas')
export class TestN8nController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @ApiOperation({ summary: 'Enviar una notificación de prueba a n8n' })
  @ApiBody({ type: SendTestN8nDto })
  @ApiOkResponse({
    description: 'Respuesta del webhook de n8n',
    schema: {
      type: 'object',
      additionalProperties: true,
      example: { ok: true, channel: 'TELEGRAM' },
    },
  })
  send(@Body() body: SendTestN8nDto) {
    const target = body.target ?? 'test-target';
    const title = body.title ?? 'Prueba MS Alert';
    const message = body.message ?? 'Mensaje enviado desde NestJS hacia n8n';

    return this.notificationService.sendToN8n({
      notificationId: body.notificationId ?? `test-${Date.now()}`,
      channel: body.channel ?? 'TELEGRAM',
      target,
      title,
      message,
      payload: {
        severity: body.severity ?? 'HIGH',
        system: body.system ?? 'MS_ALERTAS',
        eventType: body.eventType ?? 'TEST_EVENT',
        ...(body.payload ?? {}),
      },
    });
  }
}
