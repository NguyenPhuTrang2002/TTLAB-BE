import { LoginUserDto } from './dto/login-user.dto';
import { LoginAminDto } from './dto/login-admin.dto';
import { UserRepository } from '../modules/user/user.repository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from '../database/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SuccessResponse } from '../common/helpers/response';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async register(registerUserDto: RegisterUserDto): Promise<User> {
        try {
            const existingUser = await this.userRepository.checkUser({
                email: registerUserDto.email,
                deletedAt: null,
            });
            if (existingUser) {
                throw new HttpException(
                    {
                        status: HttpStatus.BAD_REQUEST,
                        error: 'Email already exists',
                    },
                    HttpStatus.BAD_REQUEST,
                );
            }

            const user: SchemaCreateDocument<User> = {
                ...(registerUserDto as any),
            };

            return await this.userRepository.createOne(user);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            console.error('Error in UserService createUser: ' + error);
        }
    }

    async login(loginUserDto: LoginUserDto): Promise<any> {
        const user = await this.userRepository.findOneByCondition({
            email: loginUserDto.email,
        });
        if (user.role != 'user') {
            throw new HttpException(
                'Quyền không đúng',
                HttpStatus.UNAUTHORIZED,
            );
        }
        const checkPass = bcrypt.compareSync(
            loginUserDto.password,
            user.password,
        );
        if (!checkPass) {
            throw new HttpException(
                'Mật khẩu không đúng',
                HttpStatus.UNAUTHORIZED,
            );
        }
        const payload = {
            id: user.id,
            email: user.email,
        };
        return this.generateToken(payload);
    }

    async loginAdmin(LoginAminDto: LoginAminDto): Promise<any> {
        const admin = await this.userRepository.findOneByCondition({
            email: LoginAminDto.email,
        });

        const checkPass = bcrypt.compareSync(
            LoginAminDto.password,
            admin.password,
        );
        if (!checkPass) {
            throw new HttpException(
                'Mật khẩu không đúng',
                HttpStatus.UNAUTHORIZED,
            );
        }
        if (admin.role != 'admin') {
            throw new HttpException(
                'Quyền không đúng',
                HttpStatus.UNAUTHORIZED,
            );
        }
        const payload = {
            id: admin.id,
            email: admin.email,
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
    async profile(access_token: { access_token: string }): Promise<any> {
        try {
            const decodedToken = await this.jwtService.verifyAsync(
                access_token.access_token,
                {
                    secret: this.configService.get<string>('SECRET'),
                },
            );
            const admin = await this.userRepository.findOneByCondition({
                email: decodedToken.email,
            });

            return new SuccessResponse({
                id: admin.id,
                email: admin.email,
                role: admin.role,
                avatar: admin.avatar,
                name: admin.name,
                birthday: admin.birthday,
                phone: admin.phone,
            });
        } catch (error) {
            console.error('Error decoding token:', error);
            throw new HttpException(
                'Failed to decode access token',
                HttpStatus.UNAUTHORIZED,
            );
        }
    }

    private convertTimeToSeconds(expTime: string): number {
        const numericValue = parseInt(expTime);
        const unit = expTime.slice(-1);

        let seconds = 0;
        switch (unit) {
            case 's':
                seconds = numericValue;
                break;
            case 'm':
                seconds = numericValue * 60;
                break;
            case 'h':
                seconds = numericValue * 60 * 60;
                break;
            case 'd':
                seconds = numericValue * 24 * 60 * 60;
                break;
            default:
                throw new Error('Invalid time unit');
        }

        return seconds;
    }
    private async generateToken(payload: { id: string; email: string }) {
        const access_Token = await this.jwtService.signAsync(payload);
        const timeToken = this.configService.get<string>('EXP_IN_ACCESS_TOKEN');
        const time_Token = this.convertTimeToSeconds(timeToken);
        const refresh_Token = await this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('SECRET'),
            expiresIn: this.configService.get<string>('EXP_IN_REFRESH_TOKEN'),
        });
        await this.userRepository.update(payload.email, refresh_Token);

        return new SuccessResponse({ access_Token, refresh_Token, time_Token });
    }

    private async re_refreshToken(payload: { id: string; email: string }) {
        const access_Token = await this.jwtService.signAsync(payload);
        return new SuccessResponse({ access_Token });
    }
    async findUserByEmail(email: string): Promise<User | undefined> {
        return this.userRepository.checkUser({
            email,
        });
    }
}
