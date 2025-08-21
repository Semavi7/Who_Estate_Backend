import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { UpdatePasswordDto } from './dto/update-userpassword.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.Admin, Role.Member)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }

  @Roles(Role.Admin, Role.Member)
  @Patch(':id/upload-image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadUserImage(@Param('id') id: string, @UploadedFile() file:Express.Multer.File){
    return this.userService.uploadUserImage(id, file)
  }

  @Roles(Role.Admin, Role.Member)
  @Get()
  findAll() {
    return this.userService.findAll()
  }

  @Roles(Role.Admin, Role.Member)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id)
  }

  @Roles(Role.Admin, Role.Member)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto)
  }

  @Roles(Role.Admin, Role.Member)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id)
  }

  @Roles(Role.Admin, Role.Member)
  @Patch(':id/password')
  passwordUpdate(@Param('id') id: string, @Body() passwordDto: UpdatePasswordDto){
    const { oldPassword, newPassword } = passwordDto
    return this.userService.updatePassword(id, oldPassword, newPassword)
  }
}
