import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IUser } from 'src/user/user.interface';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as IUser;
  },
);