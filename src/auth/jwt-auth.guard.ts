import { ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from 'src/decorator/metadata';
import * as request from 'supertest';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),// kiểm tra metadata ở method
            context.getClass(), // kiểm tra metadata ở controller
        ]);
        if (isPublic) {
            return true;
        }
        return super.canActivate(context); // Gọi phương thức canActivate của AuthGuard('jwt') để thực hiện xác thực JWT
    }


    handleRequest(err, user, info, context: ExecutionContext) {  // Override phương thức handleRequest để tùy chỉnh xử lý kết quả xác thực
        // You can throw an exception based on either "info" or "err" arguments
        const request: Request = context.switchToHttp().getRequest(); //Lấy đối tượng request từ ExecutionContext
        if (err || !user) {
            throw err || new UnauthorizedException('Invalid or expired token');
        } else if (info) { //thông tin từ chiến lược JwtStrategy khi xác thực không thành công
            throw new UnauthorizedException(info.message);
        }
        return user;
    }

}