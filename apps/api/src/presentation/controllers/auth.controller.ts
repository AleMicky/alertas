import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from 'src/app/services/auth.service';
import {
  CurrentUser,
  JwtAuthGuard,
  type DashboardAuthUser,
} from 'src/infrastructure/security';
import { AuthUserResponseDto, MessageResponseDto } from '../dto/auth';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({
    summary: 'Perfil del usuario autenticado',
    description:
      'Devuelve el perfil a partir de los claims del access token de Keycloak.',
  })
  @ApiOkResponse({ type: AuthUserResponseDto })
  @ApiUnauthorizedResponse({ description: 'Token inválido o ausente' })
  me(@CurrentUser() user: DashboardAuthUser) {
    return this.authService.me(user);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiOperation({
    summary: 'Cerrar sesión',
    description:
      'Indica que el cierre de sesión debe hacerse en Keycloak (end-session).',
  })
  @ApiOkResponse({ type: MessageResponseDto })
  logout() {
    return this.authService.logout();
  }
}
