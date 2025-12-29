import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { TransformInterceptor } from './interceptor/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  //config .env file
  const configService: ConfigService = app.get(ConfigService);

  //config cors
  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN')?.split(','),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, //cho phép gửi cookie trong các yêu cầu cross-origin
  });

  //config reflector
  const reflector = app.get(Reflector); //lấy instance của Reflector để sử dụng.

  //global prefix and versioning
  const globalPrefix = 'api';
  const version = '1';
  app.setGlobalPrefix(globalPrefix);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: [version], //default version
  });

  //config Auards
  app.useGlobalGuards(new JwtAuthGuard(reflector)); //cấu hình guard toàn cục để bảo vệ tất cả các route bằng JWT Auth Guard
  app.useGlobalInterceptors(new TransformInterceptor(reflector)); //cấu hình interceptor toàn cục

  //config Pipe for validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, //tự động loại bỏ các thuộc tính không được định nghĩa trong DTOs
    forbidNonWhitelisted: true, //nếu có thuộc tính không được định nghĩa trong DTO thì sẽ ném ra lỗi
    transform: true, //tự động chuyển đổi payload thành các instance của lớp DTO
  }));

  //config cokie-parser
  app.use(cookieParser());

  //use config values
  await app.listen(configService.get<number>('PORT') ?? '', configService.get<string>('HOST') ?? '');
  console.log(`Application is running on: http://${configService.get<string>('HOST')}:${configService.get<number>('PORT')}/${globalPrefix}/v${version}`);
}
bootstrap();
