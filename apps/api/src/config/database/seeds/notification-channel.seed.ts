import { DataSource } from 'typeorm';

import { NotificationChannelEntity } from 'src/infrastructure/typeorm/entities/notification-channel.entity';

const DEFAULT_CHANNELS = [
  { code: 'EMAIL', name: 'Email' },
  { code: 'WHATSAPP', name: 'WhatsApp' },
  { code: 'TELEGRAM', name: 'Telegram' },
  { code: 'GOOGLE_CALENDAR', name: 'Google Calendar' },
  { code: 'PUSH', name: 'Push' },
  { code: 'GOOGLE_OUTLOOK', name: 'Google Outlook' },
  { code: 'GMAIL', name: 'Gmail' },
  { code: 'OUTLOOK_EMAIL', name: 'Outlook Email' },
] as const;

export async function notificationChannelSeed(dataSource: DataSource) {
  const repository = dataSource.getRepository(NotificationChannelEntity);

  const existing = await repository.find({
    select: { code: true },
  });
  const existingCodes = new Set(
    existing.map((channel) => channel.code.toUpperCase()),
  );

  const toCreate = DEFAULT_CHANNELS.filter(
    (channel) => !existingCodes.has(channel.code),
  ).map((channel) => ({
    ...channel,
    active: true,
  }));

  if (toCreate.length === 0) {
    console.log('Notification channels already seeded');
    return;
  }

  await repository.save(toCreate);

  console.log(`Notification channels seeded (${toCreate.length} new)`);
}
