import { Controller, Post, UseGuards, Request, Res, Body } from '@nestjs/common';
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

  @Public()
  @Post('forgot-password') forgot(@Body('email') email: string){
    return this.authService.forgotPassword(email)
  }

  @Public()
  @Post('reset-password') reset(@Body() body: { token: string, newPassword: string}){
    return this.authService.resetPassword(body.token, body.newPassword)
  }
}
