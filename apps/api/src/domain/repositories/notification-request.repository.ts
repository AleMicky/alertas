import { BaseRepository } from 'src/shared/core/base.repository';
import {
  NotificationRequestSearchFilters,
  NotificationRequestSearchResult,
  NotificationRequestStats,
} from '../types/notification-request-search.types';
import { NotificationRequestData } from '../entities/notification-request';

export abstract class NotificationRequestRepository extends BaseRepository<NotificationRequestData> {
  abstract findByClientSystemIdAndIdempotencyKey(
    clientSystemId: string,
    idempotencyKey: string,
  ): Promise<NotificationRequestData | null>;

  abstract findAllByClientSystemId(
    clientSystemId: string,
  ): Promise<NotificationRequestData[]>;

  abstract search(
    filters: NotificationRequestSearchFilters,
  ): Promise<NotificationRequestSearchResult<NotificationRequestData>>;

  abstract getStats(filters?: {
    requestedFrom?: Date;
    requestedTo?: Date;
    clientSystemId?: string;
  }): Promise<NotificationRequestStats>;

  abstract archiveOlderThan(before: Date): Promise<number>;
}
