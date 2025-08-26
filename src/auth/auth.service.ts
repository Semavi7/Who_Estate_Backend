import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginResponseDto } from './dto/login-response.dto';
import { User } from 'src/user/entities/user.entity';
import { plainToClass } from 'class-transformer';
import { createHash, randomBytes } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResetToken } from './entities/reset-token.entity';
import { MailService } from 'src/mailer/mailer.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectRepository(ResetToken) private resetTokenRepo: Repository<ResetToken>,
    private mailService: MailService
  ) { }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email)
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user
      return result
    }
    return null
  }

  async login(user: User): Promise<LoginResponseDto> {
    const payload = { email: user.email, sub: user._id, roles: user.roles }
    const responseObject: LoginResponseDto = {
      access_token: this.jwtService.sign(payload),
      email: user.email,
      _id: user._id,
      name: user.name,
      surname: user.surname,
      phonenumber: user.phonenumber,
      role: user.roles,
      image: user.image
    }

    return plainToClass(LoginResponseDto, responseObject)
  }

  private hashToken(plain: string) {
    return createHash('sha256').update(plain).digest('hex')
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findOneByEmail(email)
    const genericMessage = 'Eğer bu e-posta sistemimizde kayıtlı ise, şifre sıfırlama bağlantısı gönderildi.'
    if (!user) return { message: genericMessage }

    const plainToken = randomBytes(32).toString('hex')
    const tokenHash = this.hashToken(plainToken)
    const expires = new Date(Date.now() + 15 * 60 * 1000)

    await this.resetTokenRepo.delete({ userId: String(user._id) })

    const resetToken = this.resetTokenRepo.create({
      tokenHash,
      userId: String(user._id),
      expires
    })
    await this.resetTokenRepo.save(resetToken)

    const resetUrl = `http://localhost:3000/reset-password?token=${plainToken}`
    await this.mailService.sendResetPasswordMail(user.email, resetUrl)

    return { message: genericMessage}
  }

  async resetPassword(plainToken: string, newPassword: string){
    const tokenHash = this.hashToken(plainToken)
    const record = await this.resetTokenRepo.findOne({ where: { tokenHash }})

    if(!record) throw new BadRequestException('Token geçersiz')
    if(record.expires < new Date()) throw new BadRequestException(' Token Süresi Dolmuş')

    const user = await this.userService.findOne(record.userId)
    if(!user) throw new NotFoundException('Kullanıcı bulunamadı')

    user.password = await bcrypt.hash(newPassword, 10)
    await this.userService.update(String(user._id), user)

    await this.resetTokenRepo.delete({ _id: record._id })

    return { message: 'Şifre başarıyla güncellendi'}
  }
}
