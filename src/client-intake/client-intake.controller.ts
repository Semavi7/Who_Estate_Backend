import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClientIntakeService } from './client-intake.service';
import { CreateClientIntakeDto } from './dto/create-client-intake.dto';
import { UpdateClientIntakeDto } from './dto/update-client-intake.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Controller('client-intake')
export class ClientIntakeController {
  constructor(private readonly clientIntakeService: ClientIntakeService) {}

  @Post()
  @Roles(Role.Admin, Role.Member)
  create(@Body() createClientIntakeDto: CreateClientIntakeDto) {
    return this.clientIntakeService.create(createClientIntakeDto);
  }

  @Get()
  @Roles(Role.Admin, Role.Member)
  findAll() {
    return this.clientIntakeService.findAll();
  }

  @Get(':id')
  @Roles(Role.Admin, Role.Member)
  findOne(@Param('id') id: string) {
    return this.clientIntakeService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.Admin, Role.Member)
  update(@Param('id') id: string, @Body() updateClientIntakeDto: UpdateClientIntakeDto) {
    return this.clientIntakeService.update(id, updateClientIntakeDto);
  }

  @Delete(':id')
  @Roles(Role.Admin, Role.Member)
  remove(@Param('id') id: string) {
    return this.clientIntakeService.remove(id);
  }
}
