import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { GenericRepository } from "src/shared/core/generic.repository";
import { RoleEntity } from "../typeorm/entities/role.entity";
import { RoleRepository } from "src/domain/repositories/role.repository";
import { Role } from "src/domain/entities";


@Injectable()
export class RoleTypeormRepository extends GenericRepository<RoleEntity> implements RoleRepository {
    constructor(
        @InjectRepository(RoleEntity)
        private readonly roleRepository: Repository<RoleEntity>,
    ) {
        super(roleRepository);
    }
    findByCode(code: string): Promise<Role | null> {
        return this.repository.findOne({ where: { code } });
    }
}