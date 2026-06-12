import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from 'src/app/services/auth.service';
import { LoginDto } from '../dto/auth';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    login(@Body() body: LoginDto) {
        return this.authService.login(body);
    }
}