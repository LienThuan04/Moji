import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, Res } from '@nestjs/common';
import { FriendRequestService } from './friend-request.service';
import { CreateFriendRequestDto } from './dto/create-friend-request.dto';
import { User } from 'src/decorator/user.decorator';
import type { IUser } from 'src/user/user.interface';
import { UserService } from '../user/user.service';
import { FriendService } from 'src/friend/friend.service';
import { ResponseMessage } from 'src/decorator/metadata';

@Controller('friend-request')
export class FriendRequestController {
  constructor(
    private readonly friendRequestService: FriendRequestService, 
    private readonly userService: UserService,
    private readonly friendService: FriendService,
  ) {};

  @Post()
  @ResponseMessage('Friend request sent successfully.')
  async sendFriendRequest(@Body() createFriendRequestDto: CreateFriendRequestDto, @User() user: IUser) {
    const from = user._id;
    if(from === createFriendRequestDto.to) {
      throw new BadRequestException("You cannot send a friend request to yourself.");
    };
    if(!await this.userService.findOne(createFriendRequestDto.to)) {
      throw new BadRequestException("The user you are trying to send a friend request to does not exist.");
    }
    let userA = from.toString();
    let userB = createFriendRequestDto.to.toString();
    if (userA > userB) {
      [userA, userB] = [userB, userA]; // Swap to ensure userA is always the smaller ID
    }
    const alreadyFriends = await this.friendService.CheckFriendship(userA, userB);
    const existingRequest = await this.friendRequestService.findExistingRequest(from, createFriendRequestDto.to);
    if (alreadyFriends) {
      throw new BadRequestException("You are already friends with this user.");
    }
    if (existingRequest) {
      throw new BadRequestException("A friend request already exists between you and this user.");
    }

    return this.friendRequestService.create(createFriendRequestDto, from);

  };

  @Post(':requestId/accept')
  @ResponseMessage('Friend request accepted successfully.')
  async accept(@Param('requestId') requestId: string, @User() user: IUser) {
    const request = await this.friendRequestService.findOne(requestId);
    if(!request) {
      throw new BadRequestException("Friend request not found.");
    }
    if(request.to.toString() !== user._id.toString()) {
      throw new BadRequestException("You are not authorized to accept this friend request.");
    }
    const Friend = await this.friendService.create({
      userA: request.from.toString(),
      userB: request.to.toString(),
    });
    if (!Friend) {
      throw new BadRequestException("Failed to create friendship.");
    }
    await this.friendRequestService.remove(requestId);
    const from: any = await this.userService.findOne(request.from.toString());
    return { newFriend: {
      _id: from._id,
      username: from.username,
      email: from.email,
      displayName: from.displayName,
      avatarUrl: from.avatarUrl,
      avatarId: from.avatarId,
    } };
  };

  @Post(':requestId/decline')
  @ResponseMessage('Friend request declined successfully.')
  async decline(@Param('requestId') requestId: string, @User() user: IUser) {
    const request = await this.friendRequestService.findOne(requestId);
    if(!request) {
      throw new BadRequestException("Friend request not found.");
    }
    if(request.to.toString() !== user._id.toString()) {
      throw new BadRequestException("You are not authorized to decline this friend request.");
    }
    return this.friendRequestService.remove(requestId);
  };

  @Get()
  @ResponseMessage('Friend requests retrieved successfully.')
  async findAll(@User() user: IUser) {
    return await this.friendRequestService.findAll(user._id);
  };

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.friendRequestService.findOne(id);
  };

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.friendRequestService.remove(id);
  };
}
