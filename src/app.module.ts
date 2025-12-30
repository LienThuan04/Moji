import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SessionModule } from './session/session.module';
import { MessageModule } from './message/message.module';
import { ConversationModule } from './conversation/conversation.module';
import { FriendModule } from './friend/friend.module';
import { FriendRequestModule } from './friend-request/friend-request.module';

@Module({
  imports: [
    //config .env file
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    //config mongoose
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_MONGO_URL'),
        connectionFactory: (connection) => {
          // Bạn có thể thêm các thiết lập hoặc sự kiện tùy chỉnh ở đây nếu cần
          return connection;
        }
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    SessionModule,
    MessageModule,
    ConversationModule,
    FriendModule,
    FriendRequestModule,


  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
