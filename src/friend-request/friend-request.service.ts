import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFriendRequestDto } from './dto/create-friend-request.dto';
import { UpdateFriendRequestDto } from './dto/update-friend-request.dto';
import { InjectModel } from '@nestjs/mongoose';
import { FriendRequest, FriendRequestDocument } from './schema/friend-request.schema';
import { Model } from 'mongoose';

@Injectable()
export class FriendRequestService {
  constructor(
    @InjectModel( FriendRequest.name ) private friendRequestModel: Model<FriendRequestDocument>,
  ) {}
  async findExistingRequest(fromId: string, toId: string): Promise<FriendRequest | null> {
    return this.friendRequestModel.findOne({ $or: [ { from: fromId, to: toId }, { from: toId, to: fromId } ] });
  }

  async create(createFriendRequestDto: CreateFriendRequestDto, fromId: string) {
    const createdRequest = await this.friendRequestModel.create({
      from: fromId,
      to: createFriendRequestDto.to,
      Message: createFriendRequestDto.message,
    });
    if (!createdRequest) {
      throw new Error("Failed to create friend request.");
    }
    return createdRequest;
  }

  async findAll(_id: string) {
    const populateFields = ['_id', 'username', 'email', 'displayName', 'avatarUrl', 'avatarId'];
    const [ sent, received ] = await Promise.all([ // Parallel queries for efficiency
      this.friendRequestModel.find({ from: _id }).populate('to', populateFields).lean(),
      this.friendRequestModel.find({ to: _id }).populate('from', populateFields).lean(),
    ]);
    if (!sent && !received) {
      return { sent: [], received: [] };
    }
    return { sent, received };
  };

  async findOne(id: string) {
    const request = await this.friendRequestModel.findById(id);
    if (!request) {
      throw new BadRequestException("Friend request not found.");
    }
    return request;
  }

  async update(id: string, updateFriendRequestDto: UpdateFriendRequestDto) {
    return `This action updates a #${id} friendRequest`;
  }

  async remove(id: string) {
    const result = await this.friendRequestModel.findByIdAndDelete(id);
    if (!result) {
      throw new BadRequestException("Friend request not found or already deleted.");
    }
    return result;
  }
}
