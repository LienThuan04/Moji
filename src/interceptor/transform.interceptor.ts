// Source - https://stackoverflow.com/a
// Posted by Jackie McDoniel, modified by community. See post 'Timeline' for change history
// Retrieved 2025-12-17, License - CC BY-SA 4.0
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RESPONSE_MESSAGE } from 'src/decorator/metadata';

export interface Response<T> {
    statusCode: number;
    message?: string;
    data: any;
}

@Injectable()
export class TransformInterceptor<T>
    implements NestInterceptor<T, Response<T>> {
    constructor(private reflector: Reflector) { }
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<Response<T>> {
        return next.handle().pipe(
            map((data) => ({
                statusCode: context.switchToHttp().getResponse().statusCode,
                message: data?.message || this.reflector.get<string>(RESPONSE_MESSAGE, context.getHandler()) || 'Request successful',
                data: data,
                meta: data?.meta || undefined,
            })),
        );
    }
}