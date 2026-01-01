import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { ResponseMessage } from 'src/decorator/metadata';
import { User } from 'src/decorator/user.decorator';
import { CheckFriendship } from 'src/decorator/check-friendship.decorator';
import { CheckFriendshipGuard } from 'src/guard/check-friendship.guard';
import type { IUser } from 'src/user/user.interface';

@Controller('message')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
  ) {}

  @Post('direct')
  @CheckFriendship('body', 'recipientId') // lấy recipientId từ body để kiểm tra friendship
  @UseGuards(CheckFriendshipGuard) // Sử dụng guard để kiểm tra friendship
  @ResponseMessage('Message sent successfully.')
  async sendDirect(@Body() createMessageDto: CreateMessageDto, @User() user: IUser) {
    return this.messageService.create(createMessageDto, user._id);
  };

  @Post('group')
  @ResponseMessage('Message sent successfully.')
  async sendGroup(@Body() createMessageDto: CreateMessageDto) {
    // return this.messageService.create(createMessageDto);
  }

}
