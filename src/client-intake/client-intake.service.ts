import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientIntakeDto } from './dto/create-client-intake.dto';
import { UpdateClientIntakeDto } from './dto/update-client-intake.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientIntake } from './entities/client-intake.entity';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';

@Injectable()
export class ClientIntakeService {
  constructor(
    @InjectRepository(ClientIntake)
    private readonly clientIntakeRepository: Repository<ClientIntake>
  ) { }

  async create(createClientIntakeDto: CreateClientIntakeDto): Promise<ClientIntake> {
    try {
      const newClientIntake = this.clientIntakeRepository.create(createClientIntakeDto)
      return await this.clientIntakeRepository.save(newClientIntake)
    } catch (error) {
      throw error
    }
  }

  async findAll(): Promise<ClientIntake[]> {
    const allClientIntake = await this.clientIntakeRepository.find()
    return allClientIntake
  }

  async findOne(id: string): Promise<ClientIntake> {
    const findClientIntake = await this.clientIntakeRepository.findOneBy({ _id: new ObjectId(id) })
    if (!findClientIntake) {
      throw new NotFoundException('Mesaj Bulunamadı')
    }
    return findClientIntake
  }

  async update(id: string, updateClientIntakeDto: UpdateClientIntakeDto): Promise<ClientIntake> {
    const findClientIntake = await this.clientIntakeRepository.findOneBy({ _id: new ObjectId(id) })
    if (!findClientIntake) {
      throw new NotFoundException('Mesaj Bulunamadı')
    }
    for(const key in updateClientIntakeDto){
      findClientIntake[key] = updateClientIntakeDto[key]
    }
    return this.clientIntakeRepository.save(findClientIntake)
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.clientIntakeRepository.delete(new ObjectId(id))
    if (result.affected === 0) {
      throw new NotFoundException('Kayıt Bulunamadı.')
    }
    return { message: 'Kayıt başarı ile silindi' }
  }
}
