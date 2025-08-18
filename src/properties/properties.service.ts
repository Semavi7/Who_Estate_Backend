import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { FindOptionsWhere, MongoRepository } from 'typeorm';
import { GeoPoint, Location, Property } from './entities/property.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import { FileUploadService } from 'src/file-upload/file-upload.service';

@Injectable()
export class PropertiesService implements OnModuleInit {

  constructor(
    @InjectRepository(Property)
    private readonly propertyRepositories: MongoRepository<Property>,
    private readonly fileUploadService: FileUploadService
  ) { }

  async onModuleInit() {
    await this.propertyRepositories.createCollectionIndex({ 'location.geo': '2dsphere' })
  }

  async create(createDto: CreatePropertyDto, imageUrls: string[]): Promise<Property> {


    const locationData = JSON.parse(createDto.location)
    const selectedFeaturesData = createDto.selectedFeatures ? JSON.parse(createDto.selectedFeatures) : {}

    const geoPoint = new GeoPoint()
    geoPoint.type = 'Point'
    geoPoint.coordinates = locationData.geo.coordinates.map(coord => parseFloat(coord))

    const location = new Location()
    location.city = locationData.city
    location.district = locationData.district
    location.neighborhood = locationData.neighborhood
    location.geo = locationData.geo

    const newProperty = this.propertyRepositories.create({
      title: createDto.title,
      description: createDto.description,
      price: createDto.price,
      gross: createDto.gross,
      net: createDto.net,
      numberOfRoom: createDto.numberOfRoom,
      buildingAge: createDto.buildingAge,
      floor: createDto.floor,
      numberOfFloors: createDto.numberOfFloors,
      heating: createDto.heating,
      numberOfBathrooms: createDto.numberOfBathrooms,
      kitchen: createDto.kitchen,
      balcony: createDto.balcony,
      lift: createDto.lift,
      parking: createDto.parking,
      furnished: createDto.furnished,
      availability: createDto.availability,
      dues: createDto.dues,
      eligibleForLoan: createDto.eligibleForLoan,
      titleDeedStatus: createDto.titleDeedStatus,
      images: imageUrls,
      location: location,
      propertyType: createDto.propertyType,
      listingType: createDto.listingType,
      subType: createDto.subType,
      selectedFeatures: selectedFeaturesData
    })
    return this.propertyRepositories.save(newProperty)
  }

  async findAll(): Promise<Property[]> {
    return this.propertyRepositories.find()
  }

  async query(queryParams: any): Promise<Property[]> {
    const where: FindOptionsWhere<Property> = {}
    const numericFields = ['price', 'gross', 'net', 'buildingAge', 'floor', 'numberOfFloors', 'numberOfBathrooms', 'dues']

    for (const key in queryParams) {
      if (Object.prototype.hasOwnProperty.call(queryParams, key)) {
        const value = queryParams[key]
        if (key === 'city' || key === 'district' || key === 'neighborhood') {
          where[`location.${key}`] = value
        }
        else if (numericFields.includes(key)) {
          where[key] = parseInt(value, 10);
        }
        else if (key === 'minNet' || key === 'minPrice') {
          const field = key.substring(3).toLowerCase();
          where[field] = { $gte: parseInt(value, 10) } as any;
        } 
        else if (key === 'maxNet' || key === 'maxPrice') {
          const field = key.substring(3).toLowerCase();
          where[field] = { ...where[field], $lte: parseInt(value, 10) } as any;
        }
        else {
          where[key] = value
        }
      }
    }
    return this.propertyRepositories.find({ where })
  }

  async findOne(id: string): Promise<Property> {
    const property = await this.propertyRepositories.findOneBy({ _id: new ObjectId(id) })
    if (!property) throw new NotFoundException('İlan Bulunamadı')
    return property
  }

  async update(id: string, updateDto: UpdatePropertyDto, newFiles?: Express.Multer.File[]): Promise<Property> {
    const existingProperty = await this.propertyRepositories.findOneBy({ _id: new ObjectId(id) })

    if (!existingProperty) {
      throw new NotFoundException('Bu ıd ye ait kayıt bulunamadı')
    }

    const keptImageUrls = updateDto.existingImageUrls ? JSON.parse(updateDto.existingImageUrls) : []
    const newImageUrls = newFiles ? await Promise.all(newFiles.map(file => this.fileUploadService.uplaodFile(file))) : []
    const finalImageUrls = [...keptImageUrls, ...newImageUrls]
    existingProperty.images = finalImageUrls

    for (const key in updateDto) {
      if (key !== 'existingImageUrls' && updateDto[key] !== undefined) {
        if (['location', 'selectedFeatures'].includes(key)) {
          existingProperty[key] = JSON.parse(updateDto[key])
        }
        else {
          existingProperty[key] = updateDto[key]
        }
      }
    }
    return this.propertyRepositories.save(existingProperty)
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.propertyRepositories.delete(new ObjectId(id))
    if (result.affected === 0) {
      throw new NotFoundException('Böyle bir Id bulunamadı')
    }
    return { message: 'İlan başarı ile silindi' }
  }

  async findNear(lon: number, lat: number, distance: number): Promise<Property[]> {
    return this.propertyRepositories.find({
      where: {
        'location.geo': {
          $nearSphere: { $geometry: { type: 'Point', coordinates: [lon, lat] }, $maxDistance: distance }
        }
      }
    })
  }

  async findLastSix() {
    return this.propertyRepositories.find({
      order: { createdAt: 'DESC'},
      take: 6
    })
  }
}
