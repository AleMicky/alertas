import { Body, Controller, Get, Ip, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from 'src/app/services/auth.service';
import { CurrentUser, JwtAuthGuard, Public } from 'src/infrastructure/security';
import {
  AuthUserResponseDto,
  ChangePasswordDto,
  LoginDto,
  LoginResponseDto,
  MessageResponseDto,
  RefreshDto,
  RefreshResponseDto,
} from '../dto/auth';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({
    summary: 'Iniciar sesión en el dashboard',
    description:
      'Autentica un usuario del dashboard con usuario y contraseña. ' +
      'Devuelve access token, refresh token y el perfil del usuario.',
  })
  @ApiOkResponse({ type: LoginResponseDto })
  @ApiUnauthorizedResponse({ description: 'Credenciales inválidas' })
  login(
    @Body() body: LoginDto,
    @Ip() ipAddress: string,
    @Req() request: Request,
  ) {
    return this.authService.login(
      body,
      ipAddress,
      request.headers['user-agent'],
    );
  }

  @Public()
  @Post('refresh')
  @ApiOperation({
    summary: 'Renovar access token',
    description: 'Emite un nuevo access token a partir de un refresh token válido.',
  })
  @ApiOkResponse({ type: RefreshResponseDto })
  @ApiUnauthorizedResponse({ description: 'Refresh token inválido o expirado' })
  refresh(@Body() body: RefreshDto) {
    return this.authService.refresh(body);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({
    summary: 'Perfil del usuario autenticado',
    description: 'Devuelve los datos del usuario asociado al JWT del dashboard.',
  })
  @ApiOkResponse({ type: AuthUserResponseDto })
  @ApiUnauthorizedResponse({ description: 'Token inválido o usuario inactivo' })
  me(
    @CurrentUser('id')
    userId: string,
  ) {
    return this.authService.me(userId);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiOperation({
    summary: 'Cerrar sesión',
    description: 'Invalida el refresh token almacenado para el usuario autenticado.',
  })
  @ApiOkResponse({ type: MessageResponseDto })
  logout(
    @CurrentUser('id')
    userId: string,
  ) {
    return this.authService.logout(userId);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  @ApiOperation({
    summary: 'Cambiar contraseña',
    description:
      'Actualiza la contraseña del usuario autenticado e invalida la sesión actual.',
  })
  @ApiOkResponse({ type: MessageResponseDto })
  changePassword(
    @CurrentUser('id') userId: string,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(
      userId,
      dto.currentPassword,
      dto.newPassword,
    );
  }
}
