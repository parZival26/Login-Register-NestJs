import { IsString, Length } from "class-validator";


export class LoginDto {
    @IsString()
    @Length(4, 20)
    username: string;

    @IsString()
    @Length(8, 20)
    password: string;
}