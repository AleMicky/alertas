export enum NotificationChannelType {
    EMAIL = 'EMAIL',
    WHATSAPP = 'WHATSAPP',
    TELEGRAM = 'TELEGRAM',
    TEAMS = 'TEAMS',
    GOOGLE_CALENDAR = 'GOOGLE_CALENDAR',
}

export interface NotificationChannel {
    id: string;
    code: string;
    name: string;
    type: NotificationChannelType;
    webhookUrl: string;
    description?: string;
    active: boolean;
}