import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({
    description: 'Kullanıcı e-posta adresi',
    example: 'test@example.com', 
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Kullanıcı şifresi',
    example: 'password123', 
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;
}