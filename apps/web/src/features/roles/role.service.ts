import { baseService } from '@/shared/core/base.service';
import type { CreateRoleDto, UpdateRoleDto } from './role.schema';
import type { Role } from './role.types';

const endpoint = '/roles';

export const roleService = baseService<Role, CreateRoleDto, UpdateRoleDto>(endpoint);
