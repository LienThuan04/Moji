import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, UseGuards, Res } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { CreateConversationGroupDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
// import { CheckFriendshipGuard } from 'src/guard/check-friendship.guard';
// import { CheckFriendship } from 'src/decorator/check-friendship.decorator';
import { User } from 'src/decorator/user.decorator';
import type { IUser } from 'src/user/user.interface';
import { ResponseMessage } from 'src/decorator/metadata';
import { Participant } from './schema/participant.schema';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) { }

  @Post()
  // @CheckFriendship('body', 'memberIds') // lấy recipientId từ body để kiểm tra friendship
  // @UseGuards(CheckFriendshipGuard)
  @ResponseMessage('Conversation created successfully')
  async create(@Body() createConversationGroupDto: CreateConversationGroupDto, @User() user: IUser) {
    const userId = user._id;
    let conversation: any;
    if (createConversationGroupDto.type !== 'group' && createConversationGroupDto.type !== 'direct') {
      throw new BadRequestException('Invalid conversation type.');
    }

    if (createConversationGroupDto.type === 'direct') { //create with direct type
      const participantId = createConversationGroupDto?.memberIds[0];
      conversation = await this.conversationService.findDirectConversation(
        userId,
        participantId
      );
      if (!conversation) {
        conversation = await this.conversationService.create({
          type: createConversationGroupDto.type,
          participants: [
            { userId: userId, joinedAt: new Date() },
            { userId: participantId, joinedAt: new Date() }
          ],
          lastMessage: new Date(),
          unreadCounts: new Map(),
        });
      }
    };

    if (createConversationGroupDto.type === 'group') { // create with group type
      conversation = await this.conversationService.create({
        type: createConversationGroupDto.type,
        participants: [
          { userId: userId, joinedAt: new Date() },
          ...createConversationGroupDto.memberIds.map(id => ({ userId: id, joinedAt: new Date() }))
        ],
        group: {
          name: createConversationGroupDto.name,
          createdBy: userId,

        },
        lastMessage: new Date(),
        unreadCounts: new Map(),
      });
    };

    if (!conversation) {
      throw new BadRequestException('Conversation type is not valid.');
    };

    await conversation.populate([
      {
        path: 'participants.userId',
        select: '_id displayName avatarUrl avatarId bio phone email',
      },
      {
        path: 'seenby',
        select: '_id displayName avatarUrl avatarId bio phone email',
      },
      {
        path: 'lastMessage.senderId',
        select: '_id displayName avatarUrl avatarId bio phone email',
      }
    ]);
    return {conversation};
  };

  @Get()
  @ResponseMessage('Conversations fetched successfully')
  async findAll(@User() user: IUser) {
    const userId = user._id;
    const conversations = await this.conversationService.findAll(userId);
    const fomattedConversations = conversations.map(conversation => {
      const Participants = (conversation.participants).map((p) => ({
        _id: (p.userId as any)?._id,
        displayName: (p.userId as any)?.displayName ?? null,
        avatarUrl: (p.userId as any)?.avatarUrl ?? null,
        avatarId: (p.userId as any)?.avatarId ?? null,
        bio: (p.userId as any)?.bio ?? null,
        phone: (p.userId as any)?.phone ?? null,
        email: (p.userId as any)?.email ?? null,
        joinedAt: p.joinedAt,
      }));
      return ({
        ...conversation.toObject(),
        unreadCounts: conversation.unreadCounts || {},
        participants: Participants,
      });
    });
    return { conversations: fomattedConversations };
  };

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.conversationService.findOne(id);
  };

  @Get(':id/message')
  async findOneMessage(@Param('id') id: string) {

  };

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateConversationDto: UpdateConversationDto) {
    return this.conversationService.update(id, updateConversationDto);
  };

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.conversationService.remove(id);
  };
}
