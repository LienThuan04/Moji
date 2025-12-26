<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

# Doccumentation this project:
# 1 Connecttion MongoDB

- [Xem tài liệu tham khảo](https://docs.nestjs.com/techniques/mongodb).

- Tải thue viện cần thiết trước tiên:
```bash
npm install @nestjs/mongoose mongoose
```

Sau đó setup trong `app.module.ts` như tài liệu của NestJS hoặc theo cách bên dưới:
```bash

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nest')
    ],
})
export class AppModule {}
```
# 2 [NestJS/config](https://docs.nestjs.com/techniques/configuration) (dotenv in NestJS):
```bash
npm i --save-exact @nestjs/config
```
- việc dùng `nestjs/config` thay vì dotenv để chúng ta có thể validate input đầu vào để dễ dàng fix bug khi gặp lỗi hơn.

Trong file `app.module.ts` setup như sau:
```bash

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, //cho phép sử dụng ConfigModule ở bất cứ đâu trong ứng dụng mà không cần import lại
      envFilePath: '.env', //đường dẫn tới file .env
    }),
  ],
})
export class AppModule {}
```
Tiếp đến làm sao để sử dụng được thư viện này. Ta cần tạo 1 file dotenv với môi trường cụ thể `(để ngắn gọn thì trong project này tui chỉ làm với 1 file dotenv duy nhất cho nhanh)`:
- Tạo 1 file dotenv ở root của dự án.
- Để lấy được thông số trong `.env` ở `controller` ta setup như ví dụ bên dưới:
```bash
import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService, 
    private configService: ConfigService, // Khai báo ở đây để dùng!
    ) {}

  @Get()
  @Render('home')
  getHello() {
    const message = this.appService.getHello();
    const port = this.configService.get<string>('PORT');
    return {
      message, port
    };
  }
}
```
- Đối với file `main.ts` ta setup như ví dụ sau:
```bash
import { ConfigService } from '@nestjs/config';

const configService = app.get(ConfigService);
await app.listen(configService.get<number>('PORT') || 3000, configService.get<string>('HOST') || 'localhost');
```
-  Đối với việc setup kết nối Database bằng link của `.env` trong file `app.module.ts` tham khảo với ví dụ bên dưới hoặc tham khảo [tài liệu](https://docs.nestjs.com/techniques/mongodb#async-configuration):
```bash
MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    })
```
# 3 Validate Data input with [`class-validator class-transformer`](https://docs.nestjs.com/techniques/validation):

# 4 [Authentication](https://docs.nestjs.com/security/authentication):

# 5 [Encryption-and-hashing](https://docs.nestjs.com/security/encryption-and-hashing#hashing):

# 6 [Cookies](https://docs.nestjs.com/techniques/cookies):





