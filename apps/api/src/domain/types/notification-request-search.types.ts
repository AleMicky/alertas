import { NotificationRequestStatus, NotificationPriority } from '../enums';

export type NotificationRequestSearchFilters = {
  status?: NotificationRequestStatus;
  clientSystemId?: string;
  notificationChannelId?: string;
  channelCode?: string;
  priority?: NotificationPriority;
  externalReference?: string;
  correlationId?: string;
  idempotencyKey?: string;
  requestedFrom?: Date;
  requestedTo?: Date;
  includeArchived?: boolean;
  page?: number;
  size?: number;
};

export type NotificationRequestSearchResult<T> = {
  items: T[];
  total: number;
  page: number;
  size: number;
};

export type NotificationRequestStatsRow = {
  key: string;
  count: number;
};

export type NotificationRequestStats = {
  byStatus: NotificationRequestStatsRow[];
  byChannel: NotificationRequestStatsRow[];
  byClientSystem: NotificationRequestStatsRow[];
  total: number;
};
