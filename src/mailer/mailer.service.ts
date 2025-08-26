import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(private readonly mailer: MailerService){}

    async sendResetPasswordMail(to: string, resetUrl: string){
        await this.mailer.sendMail({
            to,
            subject: 'Şifre Sıfırlama Talebi',
            template: 'reset-password',
            context: {
                resetUrl
            }
        })
    }
}
