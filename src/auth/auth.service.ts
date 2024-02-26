import { LoginUserDto } from './dto/login-user.dto';
import { UserRepository } from '../modules/user/user.repository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from '../database/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SuccessResponse } from '../common/helpers/response';

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async register(registerUserDto: RegisterUserDto): Promise<User> {
        try {
            const user: SchemaCreateDocument<User> = {
                ...(registerUserDto as any),
            };
            return await this.userRepository.createOne(user);
        } catch (error) {
            console.error('Error in UserService createUser: ' + error);
            throw error;
        }
    }

    async login(loginUserDto: LoginUserDto): Promise<any> {
        const user = await this.userRepository.findOneByCondition({
            email: loginUserDto.email,
        });
        if (!user) {
            throw new HttpException(
                'Email hoặc mật khẩu không đúng',
                HttpStatus.UNAUTHORIZED,
            );
        }
        // const checkPass = bcrypt.compareSync(loginUserDto.password, user.password);
        // const checkPass = loginUserDto.password == user.password;
        // if (!checkPass) {
        //     throw new HttpException(
        //         'Mật khẩu không đúng',
        //         HttpStatus.UNAUTHORIZED,
        //     );
        // }
        const payload = {
            id: user.id,
            email: user.email,
        };
        return this.generateToken(payload);
    }

    async refreshToken(refresh_Token: string): Promise<any> {
        try {
            const verify = await this.jwtService.verifyAsync(refresh_Token, {
                secret: this.configService.get<string>('SECRET'),
            });

            const checkExistToken = await this.userRepository.findOneBy({
                email: verify.email,
                refresh_Token,
            });

            if (checkExistToken) {
                return this.generateToken({
                    id: verify.id,
                    email: verify.email,
                });
            } else {
                throw new HttpException(
                    'Refresh token is not valid',
                    HttpStatus.BAD_REQUEST,
                );
            }
        } catch (error) {
            throw new HttpException(
                'Refresh token is not valid',
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    private async generateToken(payload: { id: string; email: string }) {
        const access_Token = await this.jwtService.signAsync(payload);
        const time_Token = this.configService.get<string>(
            'EXP_IN_ACCESS_TOKEN',
        );
        const refresh_Token = await this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('SECRET'),
            expiresIn: this.configService.get<string>('EXP_IN_REFRESH_TOKEN'),
        });
        await this.userRepository.update(payload.email, refresh_Token);

        return new SuccessResponse({ access_Token, refresh_Token, time_Token });
    }

    // private async re_refreshToken(payload: { id: string; email: string }) {
    //   const access_Token = await this.jwtService.signAsync(payload);
    //   return new SuccessResponse({ access_Token });
    // }
}
