import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>
  ) { }

  async create(createDto: CreateMessageDto): Promise<Message> {
    try {
      const newMessage = this.messagesRepository.create(createDto)
      return await this.messagesRepository.save(newMessage)
    } catch (error) {
      throw error
    }
  }

  async findAll(): Promise<Message[]> {
    const allMesssages = await this.messagesRepository.find()
    return allMesssages
  }

  async findOne(id: string): Promise<Message> {
    const findMessage = await this.messagesRepository.findOneBy({ _id: new ObjectId(id) })
    if(!findMessage){
      throw new NotFoundException('Mesaj Bulunamadı')
    }
    return findMessage
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.messagesRepository.delete(new ObjectId(id))
    if (result.affected === 0) {
      throw new NotFoundException('Mesaj Bulunamadı.')
    }
    return { message: 'Mesaj başarı ile silindi' }
  }
}
