import { Body, Controller, HttpException, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-user.dto';
import { Response } from 'express';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() loginDto: LoginDto): Promise<{ accessToken: string, refreshToken: string }> {
        try {
            return this.authService.login(loginDto);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
        }
    }

    @Post('register')
    async register(@Body() registerDto: RegisterUserDto, @Req() request: Request, @Res() response: Response): Promise<void> {
        try {
            await this.authService.register(registerDto);
            response.status(HttpStatus.OK).json({ message: 'User registered successfully' });
        } catch (error) {
            response.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
    }

    @Post('refresh')
    async refresh(@Body('refreshToken') refreshToken: string): Promise<{ accessToken: string }> {
        try {
            return this.authService.refreshToken(refreshToken);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
        }
    }
}
