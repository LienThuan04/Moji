import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { FriendService } from './friend.service';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { User } from 'src/decorator/user.decorator';
import type { IUser } from 'src/user/user.interface';
import { ResponseMessage } from 'src/decorator/metadata';

@Controller('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Post()
  async create(@Body() createFriendDto: CreateFriendDto) {
    return await this.friendService.create(createFriendDto);
  }

  @Get()
  @ResponseMessage('Friends retrieved successfully.')
  async findAll(@User() user: IUser) {
    const result = await this.friendService.findAll(user._id);
    const friends = Array.isArray(result)
      ? result
      : Array.isArray((result as any).friends)
      ? (result as any).friends
      : [];
    const formattedFriends = friends.map(friend => {
      const friendData = friend.userA._id.toString() === user._id.toString() ? friend.userB : friend.userA;
      return {
        _id: friendData._id,
        username: friendData.username,
        email: friendData.email,
        displayName: friendData.displayName,
        avatarUrl: friendData.avatarUrl,
        avatarId: friendData.avatarId,
      };
    });
    return { friends: formattedFriends };
  };
  
}
