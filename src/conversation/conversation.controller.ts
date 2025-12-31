import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post()
  async create(@Body() createConversationDto: CreateConversationDto) {
    const conversation = await this.conversationService.create(createConversationDto);
    if (!conversation){
      throw new BadRequestException('Failed to create conversation');
    }
    return conversation;
  }

  @Get()
  async findAll() {
    return this.conversationService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.conversationService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateConversationDto: UpdateConversationDto) {
    return this.conversationService.update(id, updateConversationDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.conversationService.remove(id);
  }
}
