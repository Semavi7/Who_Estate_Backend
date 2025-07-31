import { ConflictException, Injectable } from '@nestjs/common';
import { CreateFeatureOptionDto } from './dto/create-feature-option.dto';
import { UpdateFeatureOptionDto } from './dto/update-feature-option.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FeatureOption } from './entities/feature-option.entity';
import { Repository } from 'typeorm';

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

  findOne(id: number) {
    return `This action returns a #${id} featureOption`;
  }

  update(id: number, updateFeatureOptionDto: UpdateFeatureOptionDto) {
    return `This action updates a #${id} featureOption`;
  }

  remove(id: number) {
    return `This action removes a #${id} featureOption`;
  }
}
