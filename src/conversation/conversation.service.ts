import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Conversation, ConversationDocument } from './schema/conversation.schema';
import { Model } from 'mongoose';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name) private conversationModel: Model<ConversationDocument>,
    // private readonly messageService: MessageService,
  ) { };

  async create(createConversationDto: CreateConversationDto): Promise<ConversationDocument> {
    const createdConversation = await this.conversationModel.create({
      type: createConversationDto.type,
      participants: [
        ...createConversationDto.participants,
      ],
      lastMessage: createConversationDto.lastMessage,
      unreadCounts: createConversationDto.unreadCounts,
    } as any);
    if (!createdConversation) {
      throw new BadRequestException('Failed to create conversation');
    }
    return createdConversation as unknown as ConversationDocument;
  }

  async findAll(userId: string) {
    const conversations = await this.conversationModel.find({
      'participants.userId': { $all: [userId] }
    }).sort({ lastMessageAt: -1, updatedAt: -1 })
    .populate({
      path: 'participants.userId',
      select: '_id displayName avatarUrl avatarId bio phone email',
    })
    .populate({
      path: 'seenby',
      select: '_id displayName avatarUrl avatarId bio phone email',
    })
    .populate({
      path: 'lastMessage.senderId',
      select: '_id displayName avatarUrl avatarId bio phone email',
    });
    return conversations;
  }

  async findOne(id: string) {
    const conversation = this.conversationModel.findById(id);
    return conversation;
  }

  async findOneWithParticipants(ParticipantId: string, userId: string) {
    const conversation = await this.conversationModel.findOne({
      'participants.userId': { $all: [ParticipantId, userId] }
    });
    return conversation;
  }
  async findDirectConversation(userId1: string, userId2: string) {
    const conversation = await this.conversationModel.findOne({
      type: 'direct',
      participants: {
        $all: [
          { $elemMatch: { userId: userId1 } },
          { $elemMatch: { userId: userId2 } }
        ]
      }
    });
    return conversation;
  }

  async update(id: string, updateConversationDto: UpdateConversationDto) {
    return `This action updates a #${id} conversation`;
  }

  async remove(id: string) {
    return `This action removes a #${id} conversation`;
  }
}
