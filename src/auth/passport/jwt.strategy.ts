
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUser } from 'src/user/user.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET') as string, //mã hóa token với signature giống như trong AuthModule để giải mã payload
    });
  }

  async validate(payload: IUser) { //hàm này được gọi tự động bởi Passport sau khi token được xác thực thành công
    const { _id, username, email, displayName, phone, avatarUrl, avatarId, bio } = payload;
    //return for request.user
    return { userId: _id, username, email, displayName, phone, avatarUrl, avatarId, bio };
  }
}
