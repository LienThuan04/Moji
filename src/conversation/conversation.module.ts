import { Module, forwardRef } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Conversation, ConversationSchema } from './schema/conversation.schema';
import { FriendModule } from 'src/friend/friend.module';
import { CheckFriendshipGuard } from 'src/guard/check-friendship.guard';
import { MessageModule } from 'src/message/message.module';

@Module({
  imports: [
    FriendModule,
    forwardRef(() => MessageModule), // Thêm MessageModule vào đây để tránh lỗi vòng lặp phụ thuộc
    MongooseModule.forFeature([{ name: Conversation.name, schema: ConversationSchema }])
  ],
  controllers: [ConversationController],
  providers: [ConversationService, CheckFriendshipGuard],
  exports: [ConversationService],
})
export class ConversationModule {}
