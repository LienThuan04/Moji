import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SessionService } from './session.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { ResponseMessage } from 'src/decorator/metadata';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  @ResponseMessage('Session created successfully')
  create(@Body() createSessionDto: CreateSessionDto) {
    return this.sessionService.create(createSessionDto);
  }

  @Get()
  @ResponseMessage('Sessions retrieved successfully')
  findAll() {
    return this.sessionService.findAll();
  }

  @Get(':id')
  @ResponseMessage('Session retrieved successfully')
  findOne(@Param('id') id: string) {
    return this.sessionService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Session updated successfully')
  update(@Param('id') id: string, @Body() updateSessionDto: UpdateSessionDto) {
    return this.sessionService.update(id, updateSessionDto);
  }

  @Delete(':id')
  @ResponseMessage('Session deleted successfully')
  remove(@Param('id') id: string) {
    return this.sessionService.remove(id);
  }
}
