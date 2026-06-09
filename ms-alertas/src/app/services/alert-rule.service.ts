import { Injectable } from '@nestjs/common';

import { BaseService } from 'src/shared/core/base.service';
import { AlertRule } from 'src/domain/entities/alert-rule';
import { AlertRuleRepository } from 'src/domain/repositories/alert-rule.repository';

@Injectable()
export class AlertRuleService extends BaseService<AlertRule> {
  constructor(private readonly alertRuleRepository: AlertRuleRepository) {
    super(alertRuleRepository);
  }

  findByCode(code: string) {
    return this.alertRuleRepository.findByCode(code);
  }

  findByEventType(eventType: string) {
    return this.alertRuleRepository.findByEventType(eventType);
  }
}
