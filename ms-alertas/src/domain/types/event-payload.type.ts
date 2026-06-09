export interface EmailRecipientPayload {
  to?: string[];
  cc?: string[];
  bcc?: string[];
  subject?: string;
  message?: string;
  html?: string;
  attachments?: unknown[];
}

export interface TelegramRecipientPayload {
  chatId?: string;
  message?: string;
}

export interface TeamsRecipientPayload {
  email?: string;
  webhookUrl?: string;
  message?: string;
}

export interface WhatsAppRecipientPayload {
  phone?: string;
  message?: string;
}

export interface EventRecipient
  extends EmailRecipientPayload,
    TelegramRecipientPayload,
    TeamsRecipientPayload,
    WhatsAppRecipientPayload {
  channel: string;
  attendee?: string;
  target?: string;
  [key: string]: unknown;
}

export interface EventPayload {
  recipients?: EventRecipient[];
  [key: string]: unknown;
}
