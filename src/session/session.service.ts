import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Session } from './schema/session.schema';
import { Model, mongo, ObjectId, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import ms, { StringValue } from 'ms';

@Injectable()
export class SessionService {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<Session>,
    private readonly configService: ConfigService,
  ) { }


  async create(createSessionDto: CreateSessionDto) {
    const TimeSession = this.configService.get<StringValue>('SESSION_EXPIRES_IN') ?? '1h' as StringValue; //default 1 day
    const newSession = await this.sessionModel.findOneAndUpdate({
      userId: createSessionDto.userId
    }, {
      ...createSessionDto,
      expiresAt: new Date(Date.now() + ms(TimeSession)),
    }, { upsert: true, new: true }
    );
    if (!newSession) {
      throw new BadRequestException('Cannot create session');
    }
    return newSession;
  }

  async findAll() {
    return `This action returns all session`;
  }

  async findOne(id: string) {
    return `This action returns a #${id} session`;
  }

  async findRefreshToken(refreshToken: string): Promise<Session | null> {
    const session = await this.sessionModel.findOne({ refreshToken });
    return session ? session : null;
  }

  async update(id: string, updateSessionDto: UpdateSessionDto) {
    return `This action updates a #${id} session`;
  }

  async remove(id: string) {
    return `This action removes a #${id} session`;
  }
}
