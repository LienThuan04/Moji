import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import mongoose, { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/auth/auth.service';
import { genSaltSync, hashSync } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly configService: ConfigService,
  ) { }
  async checkUserIsExist(username: string, email: string): Promise<boolean> {
    const user = await this.userModel.findOne({ $or: [{ username }, { email }] });
    return !!user;//return true if user exists
  }
  GetHashPassword(Password: string): string {
    const rounds = Number(this.configService.get<string>('SALT_ROUNDS'));
    const salt = genSaltSync(rounds);
    return hashSync(Password, salt);
  };

  async create(createUserDto: CreateUserDto) {
    if (await this.checkUserIsExist(createUserDto.username, createUserDto.email)) {
      throw new BadRequestException('Username or Email already exists');
    }
    const NewUser = await this.userModel.create({
      ...createUserDto,
      hashedPassword: this.GetHashPassword(createUserDto.password),
    });
    if (!NewUser) {
      throw new BadRequestException('Cannot create user');
    }
    return NewUser; //return created user with default password
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: string) {
    if(!mongoose.Types.ObjectId.isValid(id)){
      throw new BadRequestException('Invalid user ID');
    }
    return this.userModel.findById(id);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
