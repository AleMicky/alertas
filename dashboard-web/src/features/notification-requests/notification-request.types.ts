export type NotificationRequestStatus =
  | 'RECEIVED'
  | 'QUEUED'
  | 'PROCESSING'
  | 'SENT'
  | 'PARTIAL'
  | 'FAILED'
  | 'CANCELED';

export type NotificationPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export type NotificationRecipientType =
  | 'EMAIL'
  | 'PHONE'
  | 'CHAT_ID'
  | 'USER_ID'
  | 'WEBHOOK'
  | 'CUSTOM';

export type NotificationRecipientStatus =
  | 'PENDING'
  | 'QUEUED'
  | 'SENT'
  | 'DELIVERED'
  | 'FAILED'
  | 'SKIPPED';

export type NotificationDeliveryStatus =
  | 'PENDING'
  | 'QUEUED'
  | 'SENT'
  | 'DELIVERED'
  | 'FAILED'
  | 'CANCELED';

export interface NotificationRequest {
  id: string;
  clientSystemId: string;
  notificationChannelId: string | null;
  externalReference: string | null;
  correlationId: string | null;
  idempotencyKey: string | null;
  title: string | null;
  message: string | null;
  payload: Record<string, unknown>;
  metadata: Record<string, unknown> | null;
  status: NotificationRequestStatus;
  priority: NotificationPriority;
  scheduledAt: string | null;
  expiresAt: string | null;
  archivedAt: string | null;
  requestedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationRecipient {
  id: string;
  notificationRequestId: string;
  type: NotificationRecipientType;
  address: string;
  label: string | null;
  status: NotificationRecipientStatus;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationAttachment {
  id: string;
  notificationRequestId: string;
  fileName: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  checksum: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationDelivery {
  id: string;
  notificationRequestId: string;
  notificationRecipientId: string;
  notificationChannelProviderId: string | null;
  status: NotificationDeliveryStatus;
  attemptCount: number;
  providerMessageId: string | null;
  errorMessage: string | null;
  lastAttemptAt: string | null;
  deliveredAt: string | null;
  failedAt: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationDeliveryAttempt {
  id: string;
  notificationDeliveryId: string;
  attemptNumber: number;
  status: NotificationDeliveryStatus;
  requestPayload: Record<string, unknown> | null;
  responsePayload: Record<string, unknown> | null;
  errorMessage: string | null;
  attemptedAt: string;
  createdAt: string;
}

export interface NotificationRequestAudit {
  id: string;
  notificationRequestId: string;
  fromStatus: NotificationRequestStatus | null;
  toStatus: NotificationRequestStatus;
  reason: string | null;
  metadata: Record<string, unknown> | null;
  changedBy: string | null;
  changedAt: string;
}

export interface NotificationRequestDetail {
  request: NotificationRequest;
  recipients: NotificationRecipient[];
  attachments: NotificationAttachment[];
  deliveries: NotificationDelivery[];
  audits: NotificationRequestAudit[];
  attempts: NotificationDeliveryAttempt[];
}

export interface NotificationRequestSearchResult {
  items: NotificationRequest[];
  total: number;
  page: number;
  size: number;
}

export interface NotificationRequestStats {
  byStatus: { key: string; count: number }[];
  byChannel: { key: string; count: number }[];
  byClientSystem: { key: string; count: number }[];
  total: number;
}

export interface NotificationRequestSearchFilters {
  status?: NotificationRequestStatus;
  clientSystemId?: string;
  notificationChannelId?: string;
  channelCode?: string;
  priority?: NotificationPriority;
  externalReference?: string;
  correlationId?: string;
  idempotencyKey?: string;
  requestedFrom?: string;
  requestedTo?: string;
  includeArchived?: boolean;
  page?: number;
  size?: number;
}

export interface NotificationRequestStatsFilters {
  clientSystemId?: string;
  requestedFrom?: string;
  requestedTo?: string;
}
