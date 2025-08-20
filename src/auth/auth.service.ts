import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginResponseDto } from './dto/login-response.dto';
import { User } from 'src/user/entities/user.entity';
import { plainToClass } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ){}

  async validateUser(email: string, pass: string): Promise<any>{
    const user = await this.userService.findOneByEmail(email)
    if(user && (await bcrypt.compare(pass, user.password))){
      const { password, ...result } = user
      return result
    }
    return null
  }

  async login(user: User): Promise<LoginResponseDto> {
    const payload = { email: user.email, sub: user._id, roles: user.roles }
    const responseObject = {
      access_token: this.jwtService.sign(payload),
      email: user.email,
      _id: user._id,
      name: user.name,
      surname: user.surname
    }

    return plainToClass(LoginResponseDto, responseObject)
  }
}
