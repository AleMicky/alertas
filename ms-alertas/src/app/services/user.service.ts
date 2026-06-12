import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { BaseService } from "src/shared/core/base.service";
import { Role, User } from "src/domain/entities";
import { UserRepository, RoleRepository } from "src/domain/repositories";
import { PasswordService } from "src/infrastructure/security/password.service";
import { CreateUserDto, UpdateUserDto } from "src/presentation/dto/user";

@Injectable()
export class UserService extends BaseService<User> {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly roleRepository: RoleRepository,
        private readonly passwordService: PasswordService,
    ) {
        super(userRepository);
    }

    async createFromDto(dto: CreateUserDto): Promise<User> {

        const existsUsername = await this.userRepository.findByUsername(
            dto.username,
        );

        if (existsUsername) {
            throw new BadRequestException('El username ya existe');
        }

        const existsEmail = await this.userRepository.findByEmail(dto.email);

        if (existsEmail) {
            throw new BadRequestException('El email ya existe');
        }

        const roles: Role[] = [];

        for (const roleCode of dto.roles ?? []) {
            const role = await this.roleRepository.findByCode(roleCode.toUpperCase());

            if (!role) {
                throw new BadRequestException(`Rol no encontrado: ${roleCode}`);
            }
            roles.push(role);
        }

        const passwordHash = await this.passwordService.hashPassword(dto.password);
        return this.userRepository.create({
            username: dto.username,
            email: dto.email,
            fullName: dto.fullName,
            passwordHash,
            roles
        });
    }

    async updateFromDto(id: string, dto: UpdateUserDto): Promise<User> {

        const user = await this.userRepository.findOne(id);

        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }

        const data: Partial<User> = {
            email: dto.email,
            fullName: dto.fullName,
        };

        if (dto.password) {
            data.passwordHash = await this.passwordService.hashPassword(dto.password);
        }

        if (dto.roles) {
            const roles: Role[] = [];
            for (const roleCode of dto.roles) {

                const role = await this.roleRepository.findByCode(roleCode);
                if (!role) {
                    throw new BadRequestException(`Rol no encontrado: ${roleCode}`);
                }
                roles.push(role);
            }
            data.roles = roles;
        }

        return this.userRepository.update(id, data);

    }

    async findByEmail(email: string) {

        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async findByUsername(username: string) {
        const user = await this.userRepository.findByUsername(username);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async findByEmailAndPassword(email: string, password: string) {
        const user = await this.userRepository.findByEmailAndPassword(email, password);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }
}