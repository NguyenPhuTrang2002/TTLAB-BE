import {
    Body,
    Controller,
    Post,
    HttpException,
    HttpStatus,
    ValidationPipe,
    UsePipes,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthService } from './auth.service';
import { SuccessResponse } from '../common/helpers/response';
import { ApiTags } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginAminDto } from './dto/login-admin.dto';

@ApiTags('Auth Apis')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() registerUserDto: RegisterUserDto) {
        try {
            const hashedPassword = await this.hashPassword(
                registerUserDto.password,
            );
            registerUserDto.password = hashedPassword;

            const registeredUser =
                await this.authService.register(registerUserDto);
            return new SuccessResponse(registeredUser);
        } catch (error) {
            console.error(error);

            // Xử lý lỗi và trả về phản hồi phù hợp
            throw new HttpException(
                'Đăng ký không thành công.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    private async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    }

    @Post('loginAdmin')
    @UsePipes(ValidationPipe)
    loginAdmin(@Body() loginAdminDto: LoginAminDto): Promise<any> {
        console.log(loginAdminDto);
        return this.authService.loginAdmin(loginAdminDto);
    }

    @Post('login')
    @UsePipes(ValidationPipe)
    login(@Body() loginUserDto: LoginUserDto): Promise<any> {
        console.log(loginUserDto);
        return this.authService.login(loginUserDto);
    }

    @Post('profile')
    async profile(
        @Body() access_token: { access_token: string },
    ): Promise<any> {
        return this.authService.profile(access_token);
    }

    @Post('refresh-token')
    refeshToken(@Body() { refresh_Token }): Promise<any> {
        return this.authService.refreshToken(refresh_Token);
    }
}
