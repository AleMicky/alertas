import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from 'src/shared/core/base.service';
import { SeverityLevelRepository } from 'src/domain/repositories/severity-level.repository';
import { SeverityLevel } from 'src/domain/entities/severity-level';

@Injectable()
export class SeverityLevelService extends BaseService<SeverityLevel> {
  constructor(
    private readonly severityLevelRepository: SeverityLevelRepository,
  ) {
    super(severityLevelRepository);
  }

  async findByCode(code: string) {
    const severityLevel = await this.severityLevelRepository.findByCode(code);
    if (!severityLevel) {
      throw new NotFoundException('Severity level not found');
    }
    return severityLevel;
  }
}
