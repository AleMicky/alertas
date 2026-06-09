import { NotificationChannelType } from './notification-channel.types';

export const notificationChannelTypeOptions = [
    {
        label: 'Email',
        value: NotificationChannelType.EMAIL,
    },
    {
        label: 'WhatsApp',
        value: NotificationChannelType.WHATSAPP,
    },
    {
        label: 'Telegram',
        value: NotificationChannelType.TELEGRAM,
    },
    {
        label: 'Teams',
        value: NotificationChannelType.TEAMS,
    },
    {
        label: 'Google Calendar',
        value: NotificationChannelType.GOOGLE_CALENDAR,
    },
];