import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //config .env file
  const configService: ConfigService = app.get(ConfigService);
  

  //global prefix and versioning
  const globalPrefix = 'api';
  const version = '1';
  app.setGlobalPrefix(globalPrefix);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: [version], //default version
  });

  //config Pipe for validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, //tự động loại bỏ các thuộc tính không được định nghĩa trong DTOs
    forbidNonWhitelisted: true, //nếu có thuộc tính không được định nghĩa trong DTO thì sẽ ném ra lỗi
    transform: true, //tự động chuyển đổi payload thành các instance của lớp DTO
  }));

  //use config values
  await app.listen(configService.get<number>('PORT') ?? '', configService.get<string>('HOST') ?? '');
  console.log(`Application is running on: http://${configService.get<string>('HOST')}:${configService.get<number>('PORT')}/${globalPrefix}/v${version}`);
}
bootstrap();
