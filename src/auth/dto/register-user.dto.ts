/*model User {
    id       Int @id @default (autoincrement())
    username String @unique @db.VarChar(255)
    email    String @unique @db.VarChar(255)
    password String @db.VarChar(255)
} */

import { IsNotEmpty, IsString, Length } from "class-validator";

export class RegisterUserDto {
    @IsNotEmpty()
    @IsString()
    @Length(4, 20)
    username: string;

    @IsNotEmpty()
    @IsString()
    @Length(8, 20)
    password: string;
}