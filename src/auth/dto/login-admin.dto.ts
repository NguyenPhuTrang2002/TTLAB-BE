import { IsEmail, IsNotEmpty } from 'class-validator';
export class LoginAminDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;
    @IsNotEmpty()
    password: string;
}
