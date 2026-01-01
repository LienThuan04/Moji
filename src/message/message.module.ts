import { Module, forwardRef } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './schema/message.schema';
import { ConversationModule } from 'src/conversation/conversation.module';
import { FriendModule } from 'src/friend/friend.module';
import { CheckFriendshipGuard } from 'src/guard/check-friendship.guard';

@Module({
  imports: [
    forwardRef(() => ConversationModule),
    FriendModule,
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema}])
  ],
  controllers: [MessageController],
  providers: [MessageService, CheckFriendshipGuard],
  exports: [MessageService],
})
export class MessageModule {}
