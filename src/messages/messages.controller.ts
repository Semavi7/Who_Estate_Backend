import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @Public()
  create(@Body() createDto: CreateMessageDto) {
    return this.messagesService.create(createDto);
  }

  @Get()
  @Roles(Role.Admin)
  findAll() {
    return this.messagesService.findAll();
  }

  @Get(':id')
  @Roles(Role.Admin)
  findOne(@Param('id') id: string) {
    return this.messagesService.findOne(id);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id') id: string) {
    return this.messagesService.remove(id);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  patchIsRead(@Param('id') id: string) {
    return this.messagesService.patchIsRead(id)
  }
}
