import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { BaseController } from 'src/shared/core/base.controller';
import { User } from 'src/domain/entities';
import { RoleCode } from 'src/domain/enums';
import { UserService } from 'src/app/services/user.service';
import { Roles } from 'src/infrastructure/security';
import { CreateUserDto, UpdateUserDto, ResponseUserDto } from '../dto/user';
import { ApiCrudDoc } from 'src/config/swagger/crud';

@ApiBearerAuth('jwt')
@Roles(RoleCode.ADMIN)
@Controller('users')
@ApiCrudDoc({
    tag: 'Usuarios',
    createDto: CreateUserDto,
    updateDto: UpdateUserDto,
    responseDto: ResponseUserDto,
})
export class UserController extends BaseController<
    User,
    CreateUserDto,
    UpdateUserDto
> {
    constructor(private readonly userService: UserService) {
        super(userService);
    }

    @Post()
    create(@Body() dto: CreateUserDto) {
        return this.userService.createFromDto(dto);
    }
    
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
        return this.userService.updateFromDto(id, dto);
    }
}