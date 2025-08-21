import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from 'src/auth/enums/role.enum';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { ObjectId } from 'mongodb';


@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly fileUploadService: FileUploadService
  ) { }

  async onModuleInit() {
    const adminEmail = 'reifyederya@gmail.com';
    const adminExists = await this.findOneByEmail(adminEmail);

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('123456', 10);
      const adminUser = this.userRepository.create({
        email: adminEmail,
        password: hashedPassword,
        name: 'Refiye Derya',
        surname: 'Gürses',
        phonenumber: 5368100880,
        roles: Role.Admin,
      })
      await this.userRepository.save(adminUser)
      console.log('Admin user created successfully.')
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10)
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      roles: Role.Member
    })
    return this.userRepository.save(newUser)
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } })
  }

  async uploadUserImage(id: string, file: Express.Multer.File): Promise<User> {
    const user = await this.userRepository.findOneBy({_id: new ObjectId(id)})
    if(!user){
      throw new NotFoundException('Kullanıcı Bulunamadı')
    }

    const imageUrl = await this.fileUploadService.uplaodFile(file)
    user.image = imageUrl
    return this.userRepository.save(user)
  }

  async findAll() {
    return this.userRepository.find()
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOneBy({_id: new ObjectId(id)})
    if(!user){
      throw new NotFoundException('Kullanıcı Bulunamadı')
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({_id: new ObjectId(id)})
    if(!user){
      throw new NotFoundException('Kullanıcı Bulunamadı')
    }
    for(const key in updateUserDto){
      user[key] = updateUserDto[key]
    }
    return this.userRepository.save(user)
  }

  async updatePassword(id: string, oldPassword: string, newPassword: string): Promise<{ message: string }>{
    const user = await this.userRepository.findOneBy({_id: new ObjectId(id)})
    if(user && await bcrypt.compare(oldPassword, user.password)){
      const hashedPassword = await bcrypt.hash(newPassword, 10)
      user.password = hashedPassword
      this.userRepository.save(user)
      return { message: 'Kullanıcı şifresi değiştirildi' }
    } 
    return { message: 'Kullanıcı şifresi yanlış' }
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.userRepository.delete(new ObjectId(id))
    if (result.affected === 0) {
      throw new NotFoundException('Böyle bir Id bulunamadı')
    }
    return { message: 'Kullanıcı başarı ile silindi' }
  }
}
