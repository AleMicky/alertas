import {
    Injectable,
    UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/domain/repositories';
import { PasswordService } from 'src/infrastructure/security/password.service';
import { LoginDto } from 'src/presentation/dto/auth';

@Injectable()
export class AuthService {

    constructor(
        private readonly userRepository: UserRepository,
        private readonly passwordService: PasswordService,
        private readonly jwtService: JwtService,
    ) { }


    async login(dto: LoginDto) {
        const user = await this.userRepository.findByUsername(dto.username);

        if (!user || !user.active) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const validPassword = await this.passwordService.comparePassword(
            dto.password,
            user.passwordHash,
        );

        if (!validPassword) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const roles = user.roles?.map((role) => role.code) ?? [];

        const accessToken = await this.jwtService.signAsync({
            sub: user.id,
            username: user.username,
            roles,
        });

        return {
            accessToken,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                roles,
            },
        };
    }
}