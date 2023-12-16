import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInDto, SignUpDTO } from 'src/DTO';

@Controller('auth')
export class AuthController {

    constructor(private authSvc: AuthService) { }

    @HttpCode(HttpStatus.CREATED)
    @Post('signup')
    async signUp(@Body() dto: SignUpDTO) {
        return this.authSvc.signUp(dto)
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async logIn(@Body() dto: LogInDto) {
        return this.authSvc.logIn(dto)
    }
}
