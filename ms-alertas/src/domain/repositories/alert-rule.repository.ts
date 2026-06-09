import { BaseRepository } from 'src/shared/core/base.repository';
import { AlertRule } from '../entities/alert-rule';

export abstract class AlertRuleRepository extends BaseRepository<AlertRule> {
  abstract findByCode(code: string): Promise<AlertRule | null>;

  abstract findByEventType(eventType: string): Promise<AlertRule[]>;
}
