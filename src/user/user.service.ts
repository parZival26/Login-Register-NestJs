import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { encodePassword } from 'src/utils/bcrypt';

@Injectable()
export class UserService {

    constructor(private readonly prismaService: PrismaService) { }

    async getUserById(id: number): Promise<Prisma.UserCreateInput> {
        return this.prismaService.user.findUnique({
            where: {
                id: id
            }
        });
    }

    async createUser(data: CreateUserDto): Promise<Prisma.UserCreateInput> {
        const existing = await this.prismaService.user.findFirst({
            where: {
                OR: [
                    { username: data.username }
                ]
            }
        });

        if (existing) {
            throw new ConflictException('Username or email already exists');
        }

        return this.prismaService.user.create({ data: { username: data.username, password: encodePassword(data.password) } });
    }

    async updateUser(id: number, data: UpdateUserDto): Promise<Prisma.UserUpdateInput> {
        return this.prismaService.user.update({
            where: {
                id: id
            },
            data: {
                username: data.username,
                password: encodePassword(data.password)
            }
        })

    }

    async deleteUser(id: number): Promise<Prisma.UserCreateInput> {
        return this.prismaService.user.delete({
            where: {
                id: id
            }
        });
    }
}
