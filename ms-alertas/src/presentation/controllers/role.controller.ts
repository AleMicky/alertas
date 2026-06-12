import { Controller } from "@nestjs/common";
import { BaseController } from "src/shared/core/base.controller";
import { UpdateRoleDto, CreateRoleDto, ResponseRoleDto } from "../dto/role";
import { RoleService } from "src/app/services/role.service";
import { ApiCrudDoc } from "src/config/swagger/crud";


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