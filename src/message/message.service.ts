import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from './schema/message.schema';
import { Model } from 'mongoose';
import { ConversationService } from 'src/conversation/conversation.service';
import { CreateConversationDto } from '../conversation/dto/create-conversation.dto';
import { ConversationDocument } from 'src/conversation/schema/conversation.schema';
import { updateConversationAfterCreateMessage } from './utills/massageHelper';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    private readonly ConversationService: ConversationService

  ) { };

  async create(createMessageDto: CreateMessageDto, userId: string) {
    // Check if conversation already exists between the two users
    let conversation: ConversationDocument | null = await this.ConversationService.findDirectConversation(
      userId,
      createMessageDto.recipientId
    );

    // If conversation doesn't exist, create it
    if (!conversation) {
      const CreateConversationDto: CreateConversationDto = {
        type: 'direct',
        participants: [
          { userId: userId, joinedAt: new Date() },
          { userId: createMessageDto.recipientId, joinedAt: new Date() }
        ],
        lastMessage: new Date(),
        unreadCounts: new Map(),
      };
      conversation = await this.ConversationService.create(CreateConversationDto);
      if (!conversation) {
        throw new BadRequestException('Failed to create conversation for the message.');
      }
    }

    // Create the message in the conversation
    const createdMessage = await this.messageModel.create({
      conversationId: conversation._id,
      senderId: userId,
      content: createMessageDto.content,
    });
    await updateConversationAfterCreateMessage(conversation, createdMessage, userId);
    return createdMessage;
  }

}
