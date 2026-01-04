import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMessageDto, SendGroupMessageDto } from './dto/create-message.dto';
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

  async findAll(query: any, limit: number) {
    const messages = await this.messageModel.find(query)
      .sort({ createdAt: -1 }) // Sắp xếp theo createdAt giảm dần
      .limit(limit + 1) // Lấy thêm 1 tin nhắn để kiểm tra còn tin nhắn tiếp theo hay không
      .exec();
    if (messages.length === 0) {
      throw new BadRequestException('No messages found.');
    }
    return messages;
  }

  async CreateGroupMessage(sendGroupMessageDto: SendGroupMessageDto, senderId: string) {
    const createdMessage = await this.messageModel.create({
      conversationId: sendGroupMessageDto.conversationId,
      senderId: senderId,
      content: sendGroupMessageDto.content,
    });
    if (!createdMessage) {
      throw new BadRequestException('Failed to create group message.');
    }
    return createdMessage;
  }
}
