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
    const sessions = await this.sessionModel.find();
    if (!sessions) {
      throw new BadRequestException('No sessions found');
    }
    return sessions;
  }

  async findOne(id: string) {
    let session = await this.sessionModel.findById(id);
    if (!session) {
      session = await this.sessionModel.findOne({ userId: id });
    }
    if (!session) {
      throw new BadRequestException('Session not found');
    }
    return session;
  }

  async findRefreshToken(refreshToken: string): Promise<Session | null> {
    const session = await this.sessionModel.findOne({ refreshToken });
    if (!session) {
      throw new BadRequestException('Session not found');
    }
    return session;
  }

  async update(id: string, updateSessionDto: UpdateSessionDto) {
    const updatedSession = await this.sessionModel.findByIdAndUpdate(id, updateSessionDto, { new: true });
    if (!updatedSession) {
      throw new BadRequestException('Cannot update session');
    }
    return updatedSession;
  }

  async remove(id: string) {
    let deletedSession = await this.sessionModel.findOneAndDelete({ _id: id });
    if (!deletedSession) {
      deletedSession = await this.sessionModel.findOneAndDelete({ userId: id });
    }
    if (!deletedSession) {
      throw new BadRequestException('Cannot delete session because you don\'t have a session');
    }
    return deletedSession;
  }
}
