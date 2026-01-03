import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards, Query, BadRequestException, Req } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto, SendGroupMessageDto } from './dto/create-message.dto';
import { ResponseMessage } from 'src/decorator/metadata';
import { User } from 'src/decorator/user.decorator';
import { CheckFriendship } from 'src/decorator/check-friendship.decorator';
import { CheckFriendshipGuard } from 'src/guard/check-friendship.guard';
import type { IUser } from 'src/user/user.interface';
import { updateConversationAfterCreateMessage } from './utills/massageHelper';
import { Conversation } from 'src/conversation/schema/conversation.schema';
import { CheckGroupMemberShipGuard } from 'src/guard/checkGroupMemberShip';
import { CheckGroupMembership } from 'src/decorator/checkGroupMemberShip.decorator';

@Controller('message')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
  ) { }

  @Post('direct')
  @CheckFriendship('body', 'recipientId') // lấy recipientId từ body để kiểm tra friendship
  @UseGuards(CheckFriendshipGuard) // Sử dụng guard để kiểm tra friendship
  @ResponseMessage('Message sent successfully.')
  async sendDirect(@Body() createMessageDto: CreateMessageDto, @User() user: IUser) {
    return this.messageService.create(createMessageDto, user._id);
  };

  @Post('group')
  @CheckGroupMembership('body', 'conversationId') // Lấy conversationId từ body để kiểm tra membership
  @UseGuards(CheckGroupMemberShipGuard) // Sử dụng guard để kiểm tra membership
  @ResponseMessage('Group message sent successfully.')
  async sendGroundMessage(@Body() sendGroupMessageDto: SendGroupMessageDto, @User() user: IUser, @Req() req: any) {
    const senderId = user._id;
    const Conversation = req?.conversation as Conversation;
    if (!Conversation) {
      throw new BadRequestException('Conversation not found in request');
    };
    if (!sendGroupMessageDto.content) {
      throw new BadRequestException('Content is required');
    };
    const message = await this.messageService.CreateGroupMessage({ ...sendGroupMessageDto }, senderId);
    await updateConversationAfterCreateMessage(Conversation, message, senderId);
    return message;
  };


  @Get(':conversationId/messages')
  @ResponseMessage('Messages retrieved successfully.')
  async findAll(@Param('conversationId') conversationId: string, @Query('cursor') cursor: string, @Query('limit') limit: string = '50') {
    const query: any = { conversationId };
    if (cursor) {
      query.createdAt = { $lt: new Date(cursor) };// Lấy các tin nhắn trước cursor nhỏ hơn thời gian cursor
    }
    let message = await this.messageService.findAll(query, parseInt(limit));
    let nextCursor = null;
    if (message.length > parseInt(limit)) { // Nếu có nhiều hơn limit tin nhắn, tức là còn tin nhắn tiếp theo
      const nextMessage: any = message[message.length - 1]; // Lấy tin nhắn cuối cùng làm nextCursor
      nextCursor = nextMessage.createdAt.toISOString();
      message.pop(); // Xóa tin nhắn cuối cùng để trả về đúng số lượng limit
    }

    message = message.reverse(); // Đảo ngược thứ tự tin nhắn để trả về từ cũ đến mới
    return { messages: message, nextCursor };
  };


}
