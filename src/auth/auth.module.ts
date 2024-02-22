import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: '88888888',
            signOptions: { expiresIn: '1h' },
        }),
        ConfigModule,
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
