import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { FeatureOptionsService } from './feature-options.service';
import { CreateFeatureOptionDto } from './dto/create-feature-option.dto';
import { UpdateFeatureOptionDto } from './dto/update-feature-option.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('feature-options')
export class FeatureOptionsController {
  constructor(private readonly featureOptionsService: FeatureOptionsService) {}

  @Post()
  @Roles(Role.Admin, Role.Member)
  create(@Body() createFeatureOptionDto: CreateFeatureOptionDto) {
    return this.featureOptionsService.create(createFeatureOptionDto);
  }

  @Public()
  @Get()
  findAllGrouped() {
    return this.featureOptionsService.findAllGrouped();
  }

  @Public()
  @Get('findall')
  findAll() {
    return this.featureOptionsService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.featureOptionsService.findOne(id);
  }

  @Put(':id')
  @Roles(Role.Admin, Role.Member)
  update(@Param('id') id: string, @Body() updateFeatureOptionDto: UpdateFeatureOptionDto) {
    return this.featureOptionsService.update(id, updateFeatureOptionDto);
  }

  @Delete(':id')
  @Roles(Role.Admin, Role.Member)
  remove(@Param('id') id: string) {
    return this.featureOptionsService.remove(id);
  }
}
