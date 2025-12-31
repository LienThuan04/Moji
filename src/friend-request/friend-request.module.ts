import { Module } from '@nestjs/common';
import { FriendRequestService } from './friend-request.service';
import { FriendRequestController } from './friend-request.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FriendRequest, FriendRequestSchema } from './schema/friend-request.schema';
import { UserModule } from 'src/user/user.module';
import { FriendModule } from 'src/friend/friend.module';

@Module({
  imports: [
    UserModule,
    FriendModule,
    MongooseModule.forFeature([{ name: FriendRequest.name, schema: FriendRequestSchema }]),
  ],
  controllers: [FriendRequestController],
  providers: [FriendRequestService],
  exports: [FriendRequestService],
})
export class FriendRequestModule {}
