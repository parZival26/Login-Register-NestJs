import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto/register-user.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {

    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,
        private readonly userService: UserService
    ) { }

    async login(loginDto: LoginDto): Promise<{ accessToken: string, refreshToken: string }> {
        const { username, password } = loginDto;

        const user = await this.prismaService.user.findUnique({
            where: {
                username
            }
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const validatePassword = await bcrypt.compare(password, user.password);

        if (!validatePassword) {
            throw new NotFoundException('Invalid password');
        }

        const payload = { username };

        const accessToken = this.jwtService.sign(payload, { expiresIn: process.env.JWT_EXPIRES_IN });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN });

        return {
            accessToken,
            refreshToken
        };
    }

    async register(registerDto: RegisterUserDto): Promise<void> {
        await this.userService.createUser(registerDto);
    }

    async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
        try {
            const payload = this.jwtService.verify(refreshToken, { secret: process.env.JWT_SECRET });
            const accessToken = this.jwtService.sign({ username: payload.username }, { expiresIn: process.env.JWT_EXPIRES_IN });
            return { accessToken };
        } catch (error) {
            throw new NotFoundException('Invalid refresh token');
        }
    }
}
