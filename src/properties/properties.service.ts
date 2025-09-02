import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { FindOptionsWhere, MongoRepository } from 'typeorm';
import { GeoPoint, Location, Property } from './entities/property.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PropertiesService implements OnModuleInit {

  constructor(
    @InjectRepository(Property)
    private readonly propertyRepositories: MongoRepository<Property>,
    private readonly fileUploadService: FileUploadService,
    private readonly userService: UserService
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
      selectedFeatures: selectedFeaturesData,
      userId: createDto.userId
    })
    return this.propertyRepositories.save(newProperty)
  }

  async findAll(): Promise<Property[]> {
    const properties = await this.propertyRepositories.find()
    const propertiesWithUsers = await Promise.all(properties.map(async (property) => {
      if (property.userId) {
        try {
          const user = await this.userService.findOne(property.userId.toString());
          (property as any).user = user
        } catch (error) {
          (property as any).user = null
          console.warn(`Kullanıcı bulunamadı: ${property.userId} için ilan ID: ${property._id}`)
        }
      }
      return property
    }))
    return propertiesWithUsers
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
    if (property.userId) {
      const user = await this.userService.findOne(property.userId.toString());
      (property as any).user = user
    }
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

  async findLastSix(): Promise<Property[]> {
    const properties = await this.propertyRepositories.find({
      order: { createdAt: 'DESC' },
      take: 6
    })
    const propertiesWithUsers = await Promise.all(properties.map(async (property) => {
      if (property.userId) {
        try {
          const user = await this.userService.findOne(property.userId.toString());
          (property as any).user = user
        } catch (error) {
          (property as any).user = null
          console.warn(`Kullanıcı bulunamadı: ${property.userId} için ilan ID: ${property._id}`)
        }
      }
      return property
    }))
    return propertiesWithUsers
  }

  async getCurrentYearListingStats(): Promise<{ month: string; count: number }[]> {
    const year = new Date().getFullYear()
    const collection = this.propertyRepositories.manager.getMongoRepository(Property)

    const result = await collection.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${year}-01-01T00:00:00Z`),
            $lte: new Date(`${year}-12-31T23:59:59Z`)
          }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();

    // Eksik ayları sıfır ile dolduralım
    const months = Array.from({ length: 12 }, (_, i) => {
      const month = (i + 1).toString().padStart(2, "0")
      const found = result.find(r => r._id === `${year}-${month}`)
      return {
        month: `${year}-${month}`,
        count: found ? found.count : 0
      }
    })

    return months
  }

  async countAll(): Promise<number> {
    return this.propertyRepositories.count()
  }

  async getSubtypeAndTypePercentages(): Promise<any> {
    const total = await this.propertyRepositories.count()

    if (total === 0) {
      return {
        message: 'Database boş.'
      };
    }
    const collection = this.propertyRepositories.manager.getMongoRepository(Property)
    const daireCount = await collection.countDocuments({ subType: { $regex: "^Daire$", $options: "i" } })
    const villaCount = await collection.countDocuments({ subType: { $regex: "^Villa$", $options: "i" } })
    const dukkanCount = await collection.countDocuments({ subType: { $regex: "^Dükkan$", $options: "i" } })
    const arsaCount = await collection.countDocuments({ propertyType: { $regex: "^Arsa$", $options: "i" } })

    return [
      {
        name: "Daire",
        value: (daireCount / total) * 100,
        color: "#0088FE"
      },
      {
        name: "Villa",
        value: (villaCount / total) * 100,
        color: "#00C49F"
      },
      {
        name: "Dükkan",
        value: (dukkanCount / total) * 100,
        color: "#FFBB28"
      },
      {
        name: "Arsa",
        value: (arsaCount / total) * 100,
        color: "#FF8042"
      }
    ]
  }

  async updateUserId(id: string, userId: string): Promise<any> {
    const existingProperty = await this.propertyRepositories.findOneBy({ _id: new ObjectId(id) })
    if (!existingProperty) {
      throw new NotFoundException('Bu ıd ye ait kayıt bulunamadı')
    }

    existingProperty.userId = new ObjectId(userId)

    return this.propertyRepositories.save(existingProperty)
  }
}
