import { Body, Controller, Ip, Post, Req } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from 'src/app/services/auth.service';
import { CurrentUser, Public } from 'src/infrastructure/security';
import { LoginDto, RefreshDto } from '../dto/auth';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
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
  @ApiOperation({ summary: 'Renovar access token' })
  refresh(@Body() body: RefreshDto) {
    return this.authService.refresh(body);
  }

  @Post('logout')
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Cerrar sesión e invalidar refresh token' })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: { message: { type: 'string', example: 'Sesión cerrada' } },
    },
  })
  logout(@CurrentUser('id') userId: string) {
    return this.authService.logout(userId);
  }
}
