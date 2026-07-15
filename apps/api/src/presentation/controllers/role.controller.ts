import { Controller } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { BaseController } from 'src/shared/core/base.controller';
import { UpdateRoleDto, CreateRoleDto, ResponseRoleDto } from '../dto/role';
import { RoleService } from 'src/app/services/role.service';
import { ApiCrudDoc } from 'src/config/swagger/crud';
import { RoleCode } from 'src/domain/enums';
import { Roles } from 'src/infrastructure/security';

@ApiBearerAuth('jwt')
@Roles(RoleCode.ADMIN)
@Controller('roles')
@ApiCrudDoc({
    tag: 'Roles',
    createDto: CreateRoleDto,
    updateDto: UpdateRoleDto,
    responseDto: ResponseRoleDto,
  })
export class RoleController extends BaseController<
    ResponseRoleDto,
    CreateRoleDto,
    UpdateRoleDto
> {
    constructor(private readonly roleService: RoleService) {
        super(roleService);
    }
}