import { Body, Controller, Get, Ip, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from 'src/app/services/auth.service';
import { CurrentUser, JwtAuthGuard, Public } from 'src/infrastructure/security';
import { ChangePasswordDto, LoginDto, RefreshDto } from '../dto/auth';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

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

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(
    @CurrentUser('id')
    userId: string,
  ) {
    return this.authService.me(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(
    @CurrentUser('id')
    userId: string,
  ) {
    return this.authService.logout(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
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
