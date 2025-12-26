import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './passport/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import ms from 'ms';
import { JwtStrategy } from './passport/jwt.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_ACCESS_TOKEN_SECRET');
        // Lấy chuỗi thời gian hết hạn từ biến môi trường
        const expireStr = configService.get<string>('JWT_ACCESS_EXPIRE');
        const expiresInMs = Number(ms(expireStr as any));
        const expiresIn = Math.floor(expiresInMs / 1000);
        return {
          secret,
          signOptions: { expiresIn: expiresIn }, // chuyển từ milliseconds sang seconds
        };
      },
      inject: [ConfigService],
    }),

  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
