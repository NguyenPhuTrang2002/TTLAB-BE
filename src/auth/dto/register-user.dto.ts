import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterUserDto {
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    @IsEmail()
    email: string;
    @IsNotEmpty()
    password: string;
    @IsNotEmpty()
    birthday: string;
    @IsNotEmpty()
    phone: string;
    @IsNotEmpty()
    avatar: string;
    @IsNotEmpty()
    role: string;
}
