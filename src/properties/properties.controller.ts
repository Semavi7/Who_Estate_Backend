import { Controller, Get, Post, Body, Param, Delete, UploadedFiles, UseInterceptors, Query, ParseFloatPipe, Put } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { categoryStructure } from './config/category-structure.config';
import { FilterPropertyDto } from './dto/filter-property.dto';
import { getCities, getDistrictsAndNeighbourhoodsByCityCode, getDistrictsAndNeighbourhoodsOfEachCity } from 'turkey-neighbourhoods';

@Controller('properties')
export class PropertiesController {
  constructor(
    private readonly propertiesService: PropertiesService,
    private readonly fileUploadService: FileUploadService
  ) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images', 20))
  async create(@Body() createDto: CreatePropertyDto, @UploadedFiles() files: Array<Express.Multer.File>) {
    const imageUrls = await Promise.all(
      files.map(file => this.fileUploadService.uplaodFile(file))
    )
    return this.propertiesService.create(createDto, imageUrls);
  }

  @Get()
  findAll() {
    return this.propertiesService.findAll();
  }

  @Get('category')
  findAllCategory(@Query() fiterDto: FilterPropertyDto){
    return this.propertiesService.findAllCategory(fiterDto)
  }

  @Get('categories')
  getCategoryStructure(){
    return categoryStructure
  }

  @Get('near')
  findNearBy(
    @Query('lon', ParseFloatPipe) lon: number,
    @Query('lat', ParseFloatPipe) lat: number,
    @Query('distance', ParseFloatPipe) distance: number
  ){
    return this.propertiesService.findNear(lon, lat, distance)
  }

  @Get('adress')
  getCities(){
    return getCities()
  }


  @Get('adress/:id')
  getDistrictsAndNeighbourhoodsByCityCode(@Param('id') id: string){
    return getDistrictsAndNeighbourhoodsByCityCode(id)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertiesService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(FilesInterceptor('newImages', 20))
  update(@Param('id') id: string, @Body() updateDto: UpdatePropertyDto, @UploadedFiles() newfiles?: Array<Express.Multer.File>) {
    return this.propertiesService.update(id, updateDto, newfiles);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propertiesService.remove(id);
  }

}
