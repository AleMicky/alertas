import { Injectable } from "@nestjs/common";
import { BaseService } from "src/shared/core/base.service";
import { Role } from "src/domain/entities/role";
import { RoleRepository } from "src/domain/repositories/role.repository";

@Injectable()
export class RoleService extends BaseService<Role> {
    constructor(private readonly roleRepository: RoleRepository) {
        super(roleRepository);
    }

    findByCode(code: string) {
        return this.roleRepository.findByCode(code);
    }
}