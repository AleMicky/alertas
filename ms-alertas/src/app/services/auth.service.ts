import {
    BadRequestException,
    Injectable,
    UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginAuditRepository, UserRepository } from 'src/domain/repositories';
import { PasswordService } from 'src/infrastructure/security/password.service';
import { LoginDto, RefreshDto } from 'src/presentation/dto/auth';
import { RefreshTokenService } from './refresh-token.service';

@Injectable()
export class AuthService {

    constructor(
        private readonly userRepository: UserRepository,
        private readonly passwordService: PasswordService,
        private readonly jwtService: JwtService,
        private readonly loginAuditRepository: LoginAuditRepository,
        private readonly refreshTokenService: RefreshTokenService,
    ) { }

    async login(dto: LoginDto, ipAddress: string, userAgent: string) {
        const user = await this.userRepository.findByUsername(dto.username);

        if (!user || !user.active) {

            await this.loginAuditRepository.create({
                username: dto.username,
                ipAddress,
                userAgent,
                success: false,
                failureReason: 'Credenciales inválidas',
            });

            throw new UnauthorizedException('Credenciales inválidas');
        }

        const validPassword = await this.passwordService.comparePassword(
            dto.password,
            user.passwordHash,
        );

        if (!validPassword) {
            await this.loginAuditRepository.create({
                userId: user.id,
                username: user.username,
                ipAddress,
                userAgent,
                success: false,
                failureReason: 'Credenciales inválidas',
            });
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const roles = user.roles?.map((role) => role.code) ?? [];

        const accessToken = await this.jwtService.signAsync({
            sub: user.id,
            username: user.username,
            roles,
        });

        const refreshToken = this.refreshTokenService.generatePlainToken();
        const refreshTokenHash = await this.refreshTokenService.hash(refreshToken);
        const refreshTokenExpiresAt = this.refreshTokenService.expiresAt(7);

        await this.userRepository.update(user.id, {
            refreshTokenHash,
            refreshTokenExpiresAt,
        });

        await this.loginAuditRepository.create({
            userId: user.id,
            username: user.username,
            ipAddress,
            userAgent,
            success: true,
        });

        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                roles,
            },
        };
    }

    async refresh(dto: RefreshDto) {
        const users = await this.userRepository.findWithRefreshToken();

        for (const user of users) {
            if (
                !user.refreshTokenHash ||
                !user.refreshTokenExpiresAt ||
                user.refreshTokenExpiresAt < new Date()
            ) {
                continue;
            }

            const valid = await this.refreshTokenService.compare(
                dto.refreshToken,
                user.refreshTokenHash,
            );

            if (!valid) continue;

            const roles = user.roles?.map((role) => role.code) ?? [];

            const accessToken = await this.jwtService.signAsync({
                sub: user.id,
                username: user.username,
                roles,
            });

            return {
                accessToken,
            };
        }

        throw new UnauthorizedException('Refresh token inválido');
    }

    async me(userId: string) {
        const user = await this.userRepository.findOne(userId);

        if (!user || !user.active) {
            throw new UnauthorizedException('Usuario no autorizado');
        }

        return {
            id: user.id,
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            roles: user.roles?.map((role) => role.code) ?? [],
        };
    }

    async logout(userId: string) {
        await this.userRepository.update(userId, {
            refreshTokenHash: null,
            refreshTokenExpiresAt: null,
        });

        return {
            message: 'Sesión cerrada correctamente',
        };
    }
    async changePassword(
        userId: string,
        currentPassword: string,
        newPassword: string,
    ) {
        const user = await this.userRepository.findOne(userId);

        if (!user || !user.active) {
            throw new UnauthorizedException('Usuario no autorizado');
        }

        const validPassword = await this.passwordService.comparePassword(
            currentPassword,
            user.passwordHash,
        );

        if (!validPassword) {
            throw new BadRequestException('Contraseña actual incorrecta');
        }

        const passwordHash = await this.passwordService.hashPassword(newPassword);

        await this.userRepository.update(user.id, {
            passwordHash,
            refreshTokenHash: null,
            refreshTokenExpiresAt: null,
        });

        return {
            message: 'Contraseña actualizada correctamente',
        };
    }
}