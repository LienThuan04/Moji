import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseMessage } from 'src/decorator/metadata';
import { ApiBody } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ResponseMessage('User created successfully')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ResponseMessage('Users retrieved successfully')
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ResponseMessage('User retrieved successfully')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateUserDto })
  @ResponseMessage('User updated successfully')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ResponseMessage('User deleted successfully')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
