import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { FeatureOptionsService } from './feature-options.service';
import { CreateFeatureOptionDto } from './dto/create-feature-option.dto';
import { UpdateFeatureOptionDto } from './dto/update-feature-option.dto';

@Controller('feature-options')
export class FeatureOptionsController {
  constructor(private readonly featureOptionsService: FeatureOptionsService) {}

  @Post()
  create(@Body() createFeatureOptionDto: CreateFeatureOptionDto) {
    return this.featureOptionsService.create(createFeatureOptionDto);
  }

  @Get()
  findAllGrouped() {
    return this.featureOptionsService.findAllGrouped();
  }

  @Get('findall')
  findAll() {
    return this.featureOptionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.featureOptionsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateFeatureOptionDto: UpdateFeatureOptionDto) {
    return this.featureOptionsService.update(id, updateFeatureOptionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.featureOptionsService.remove(id);
  }
}
