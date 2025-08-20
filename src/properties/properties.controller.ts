import { Controller, Get, Post, Body, Param, Delete, UploadedFiles, UseInterceptors, Query, ParseFloatPipe, Put } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { categoryStructure } from './config/category-structure.config';
import { getCities, getDistrictsAndNeighbourhoodsByCityCode } from 'turkey-neighbourhoods';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Controller('properties')
export class PropertiesController {
  constructor(
    private readonly propertiesService: PropertiesService,
    private readonly fileUploadService: FileUploadService
  ) { }

  @Post()
  @Roles(Role.Admin, Role.Member)
  @UseInterceptors(FilesInterceptor('images', 20))
  async create(@Body() createDto: CreatePropertyDto, @UploadedFiles() files: Array<Express.Multer.File>) {
    const imageUrls = await Promise.all(
      files.map(file => this.fileUploadService.uplaodFile(file))
    )
    return this.propertiesService.create(createDto, imageUrls);
  }

  @Public()
  @Get()
  findAll() {
    return this.propertiesService.findAll();
  }

  @Public()
  @Get('count')
  async getCount(): Promise<{ total: number }> {
    const total = await this.propertiesService.countAll()
    return { total }
  }

  @Public()
  @Get('yearlistings')
  getCurrentYearListingStats(){
    return this.propertiesService.getCurrentYearListingStats()
  }

  @Public()
  @Get('query')
  findAllCategory(@Query() queryParams: any) {
    return this.propertiesService.query(queryParams)
  }

  @Public()
  @Get('categories')
  getCategoryStructure() {
    return categoryStructure
  }

  @Public()
  @Get('near')
  findNearBy(
    @Query('lon', ParseFloatPipe) lon: number,
    @Query('lat', ParseFloatPipe) lat: number,
    @Query('distance', ParseFloatPipe) distance: number
  ) {
    return this.propertiesService.findNear(lon, lat, distance)
  }

  @Public()
  @Get('adress')
  getCities() {
    return getCities()
  }

  @Roles(Role.Admin, Role.Member)
  @Get('lastsix')
  findLastSix() {
    return this.propertiesService.findLastSix()
  }

  @Public()
  @Get('piechart')
  getSubtypeAndTypePercentages() {
    return this.propertiesService.getSubtypeAndTypePercentages()
  }

  @Public()
  @Get('adress/:id')
  getDistrictsAndNeighbourhoodsByCityCode(@Param('id') id: string) {
    return getDistrictsAndNeighbourhoodsByCityCode(id)
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertiesService.findOne(id);
  }

  @Put(':id')
  @Roles(Role.Admin, Role.Member)
  @UseInterceptors(FilesInterceptor('newImages', 20))
  update(@Param('id') id: string, @Body() updateDto: UpdatePropertyDto, @UploadedFiles() newfiles?: Array<Express.Multer.File>) {
    return this.propertiesService.update(id, updateDto, newfiles);
  }

  @Delete(':id')
  @Roles(Role.Admin, Role.Member)
  remove(@Param('id') id: string) {
    return this.propertiesService.remove(id);
  }

}
