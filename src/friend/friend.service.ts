import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Friend } from './schema/friend.schema';
import { Model } from 'mongoose';

@Injectable()
export class FriendService {
  constructor(
    @InjectModel(Friend.name) private friendModel: Model<Friend>,
  ) { }

  create(createFriendDto: CreateFriendDto) {
    const createdFriend = this.friendModel.create(createFriendDto);
    return createdFriend;
  }

  async findAll(_id: string) {
    const friends = await this.friendModel.find({ $or: [{ userA: _id }, { userB: _id }] }).populate(['userA', 'userB'], ['_id', 'username', 'email', 'displayName', 'avatarUrl', 'avatarId']).lean();
    if (!friends) {
      return { friends: [] };
    }
    return { friends };
  }

  findOne(id: number) {
    return `This action returns a #${id} friend`;
  }

  async CheckFriendship(userAId: string, userBId: string): Promise<boolean> {
    // Logic to check if userA and userB are friends (both directions)
    const Check = await this.friendModel.findOne({
      $or: [
        { userA: userAId, userB: userBId },
        { userA: userBId, userB: userAId }
      ]
    });
    return Check !== null; // Return true if they are friends, false otherwise
  }

  update(id: number, updateFriendDto: UpdateFriendDto) {
    return `This action updates a #${id} friend`;
  }

  remove(id: number) {
    return `This action removes a #${id} friend`;
  }
}
