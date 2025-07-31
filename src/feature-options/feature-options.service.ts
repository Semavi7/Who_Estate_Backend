import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFeatureOptionDto } from './dto/create-feature-option.dto';
import { UpdateFeatureOptionDto } from './dto/update-feature-option.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FeatureOption } from './entities/feature-option.entity';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';

@Injectable()
export class FeatureOptionsService {
  constructor(
    @InjectRepository(FeatureOption)
    private readonly featureOptionRepository: Repository<FeatureOption>
  ) { }


  async create(createFeatureOptionDto: CreateFeatureOptionDto): Promise<FeatureOption> {
    try {
      const newOption = this.featureOptionRepository.create(createFeatureOptionDto)
      return await this.featureOptionRepository.save(newOption)
    } catch (error) {
      if (error.code === 11000 || error.message.includes('duplicate key')) {
        throw new ConflictException('Bu özellik zaten mevcut.');
      }
      throw error;
    }
  }

  async findAllGrouped(): Promise<Record<string, string[]>> {
    const allOptions = await this.featureOptionRepository.find()
    return allOptions.reduce((acc, option) => {
      const { category, value } = option
      if (!acc[category]) acc[category] = []
      acc[category].push(value)
      return acc
    }, {} as Record<string, string[]>)
  }

  async findOne(id: string): Promise<FeatureOption> {
    const findOption = await this.featureOptionRepository.findOneBy({ _id: new ObjectId(id) })
    if (!findOption) {
      throw new NotFoundException('Özellik bulunamadı')
    }
    return findOption
  }

  async update(id: string, updateFeatureOptionDto: UpdateFeatureOptionDto): Promise<FeatureOption> {
    const existingOption = await this.featureOptionRepository.findOneBy({ _id: new ObjectId(id) })
    if (!existingOption) {
      throw new NotFoundException('Özellik bulunamadı')
    }
    if (updateFeatureOptionDto.category || updateFeatureOptionDto.value) {
      const potentialDuplicate = await this.featureOptionRepository.findOneBy({
        category: updateFeatureOptionDto.category || existingOption.category,
        value: updateFeatureOptionDto.value || existingOption.value,
      })
      if (potentialDuplicate && potentialDuplicate._id.toHexString() !== id) {
        throw new ConflictException('Güncelleme sonucunda başka bir özellikle aynı olacak. Lütfen farklı bir değer girin.');
      }
    }
    this.featureOptionRepository.merge(existingOption, updateFeatureOptionDto)
    return this.featureOptionRepository.save(existingOption)
  }

  async remove(id: string): Promise<{message: string}> {
    const result = await this.featureOptionRepository.delete(new ObjectId(id))
    if(result.affected === 0){
      throw new NotFoundException('Özellik bulunamadı')
    }
    return { message: 'özellik başarı ile silindi'}
  }
}
