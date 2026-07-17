import { DataSource } from 'typeorm';

import { NotificationChannelEntity } from 'src/infrastructure/typeorm/entities/notification-channel.entity';
import { NotificationPayloadSchemaEntity } from 'src/infrastructure/typeorm/entities/notification-payload-schema.entity';

const EMAIL_CHANNEL_CODES = ['EMAIL', 'GMAIL', 'OUTLOOK_EMAIL'] as const;

const EMAIL_REQUIRED_FIELDS = ['to', 'subject', 'message'];

const EMAIL_SCHEMA_JSON: Record<string, unknown> = {
  type: 'object',
  required: EMAIL_REQUIRED_FIELDS,
  properties: {
    to: {
      type: 'array',
      items: { type: 'string', format: 'email' },
      minItems: 1,
      description: 'Destinatarios principales',
    },
    cc: {
      type: 'array',
      items: { type: 'string', format: 'email' },
      description: 'Destinatarios en copia',
    },
    bcc: {
      type: 'array',
      items: { type: 'string', format: 'email' },
      description: 'Destinatarios en copia oculta',
    },
    subject: { type: 'string' },
    message: { type: 'string' },
    html: { type: 'string' },
    attachments: {
      type: 'array',
      items: { type: 'object' },
    },
  },
  'x-field-order': [
    'to',
    'cc',
    'bcc',
    'subject',
    'message',
    'html',
    'attachments',
  ],
  additionalProperties: false,
};

const EMAIL_EXAMPLE: Record<string, unknown> = {
  to: ['usuario@empresa.com'],
  cc: [],
  bcc: [],
  subject: 'Prueba',
  message: 'Hola',
};

export async function notificationPayloadSchemaSeed(dataSource: DataSource) {
  const channelRepository = dataSource.getRepository(NotificationChannelEntity);
  const schemaRepository = dataSource.getRepository(
    NotificationPayloadSchemaEntity,
  );

  let created = 0;
  let updated = 0;

  for (const code of EMAIL_CHANNEL_CODES) {
    const channel = await channelRepository.findOne({
      where: { code },
    });

    if (!channel) {
      continue;
    }

    const active = await schemaRepository.findOne({
      where: {
        notificationChannelId: channel.id,
        active: true,
      },
    });

    if (active) {
      const properties =
        active.schemaJson &&
        typeof active.schemaJson === 'object' &&
        !Array.isArray(active.schemaJson) &&
        active.schemaJson.properties &&
        typeof active.schemaJson.properties === 'object'
          ? (active.schemaJson.properties as Record<string, unknown>)
          : null;

      if (properties && 'to' in properties) {
        continue;
      }

      active.requiredFields = EMAIL_REQUIRED_FIELDS;
      active.schemaJson = EMAIL_SCHEMA_JSON;
      active.example = active.example ?? EMAIL_EXAMPLE;
      await schemaRepository.save(active);
      updated += 1;
      continue;
    }

    await schemaRepository.save({
      notificationChannelId: channel.id,
      name: `${code.toLowerCase()}-default`,
      description: `Schema por defecto para ${code}`,
      version: 1,
      schemaJson: EMAIL_SCHEMA_JSON,
      example: EMAIL_EXAMPLE,
      requiredFields: EMAIL_REQUIRED_FIELDS,
      active: true,
    });
    created += 1;
  }

  if (created === 0 && updated === 0) {
    console.log('Notification payload schemas already seeded');
    return;
  }

  console.log(
    `Notification payload schemas seeded (${created} new, ${updated} updated)`,
  );
}
