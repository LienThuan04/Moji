import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import mongoose, { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';
import { SessionService } from 'src/session/session.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly configService: ConfigService,
    private readonly SessionService: SessionService
  ) { }
  async checkUserIsExist(username: string, email: string): Promise<boolean> {
    const user = await this.userModel.findOne({ $or: [{ username }, { email }] });
    return !!user;//return true if user exists
  }
  async GetHashPassword(Password: string): Promise<string> {
    const rounds = Number(this.configService.get<string>('SALT_ROUNDS'));
    const salt = genSaltSync(rounds);
    return hashSync(Password, salt);
  };

  async IsValidPassword(passsword: string, hash: string): Promise<boolean> {
    if (!passsword || !hash) {
      return false;
    }
    return compareSync(passsword, hash);
  };

  async findOneByUsername(username: string) {
    return await this.userModel.findOne({ username });
  };

  async create(createUserDto: CreateUserDto) {
    if (await this.checkUserIsExist(createUserDto.username, createUserDto.email)) {
      throw new BadRequestException('Username or Email already exists');
    }
    const NewUser = await this.userModel.create({
      ...createUserDto,
      hashedPassword: await this.GetHashPassword(createUserDto.password),
    });
    if (!NewUser) {
      throw new BadRequestException('Cannot create user');
    }
    return NewUser; //return created user with default password
  }

  async findAll() {
    const AllUsers = await this.userModel.find().select(['-hashedPassword']);
    if (!AllUsers) {
      throw new BadRequestException('No users found');
    }
    return AllUsers;
  }


  async findOne(id: string): Promise<UserDocument | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid user ID');
    }
    return await this.userModel.findById(id).select(['-hashedPassword']);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).select(['-hashedPassword']);
    if (!updatedUser) {
      throw new BadRequestException('Cannot update user');
    }
    return updatedUser;
  }

  async remove(id: string) {
    await this.SessionService.remove(id);
    const deletedUser = await this.userModel.findByIdAndDelete(id);
    if (!deletedUser) {
      throw new BadRequestException('Cannot delete user');
    }
    
  }
}
