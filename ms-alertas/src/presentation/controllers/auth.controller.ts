import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { AuthService } from 'src/infrastructure/auth/auth.service';
import { Public } from 'src/infrastructure/auth/public.decorator';
import { LoginDto } from '../dto/auth/login.dto';
import { AuthResponseSchema } from '../schemas/auth-response.schema';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @ApiOperation({ summary: 'Iniciar sesión en el dashboard' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    description: 'Sesión iniciada correctamente',
    type: AuthResponseSchema,
  })
  @ApiUnauthorizedResponse({ description: 'Credenciales inválidas' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.username, dto.password);
  }
}
