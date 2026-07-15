import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { GenericRepository } from 'src/shared/core/generic.repository';
import { LoginAuditEntity } from '../typeorm/entities/login-audit.entity';
import { LoginAuditRepository } from 'src/domain/repositories/login-audit.repository';


@Injectable()
export class LoginAuditTypeormRepository
    extends GenericRepository<LoginAuditEntity>
    implements LoginAuditRepository {
    constructor(
        @InjectRepository(LoginAuditEntity)
        repository: Repository<LoginAuditEntity>,
    ) {
        super(repository);
    }
}