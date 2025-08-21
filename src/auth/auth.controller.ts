import { Controller, Post, UseGuards, Request, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from './decorators/public.decorator';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    const loginResult = await this.authService.login(req.user)

    res.cookie('accessToken', loginResult.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'development',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60,
      path: '/' 
    })

    const response = {
      email: loginResult.email,
      _id: loginResult._id.toString(),
      name: loginResult.name,
      surname: loginResult.surname,
      phonenumber: loginResult.phonenumber,
      role: loginResult.role,
      image: loginResult.image
    }
    
    return response
  }
}
