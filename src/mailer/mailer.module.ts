import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { MailService } from './mailer.service';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        NestMailerModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (config: ConfigService) => ({
                transport: {
                    host: config.get<string>('SMTP_HOST'),
                    port: config.get<number>('SMTP_PORT'),
                    secure: config.get<boolean>('SMTP_SECURE') === true,
                    auth: {
                        user: config.get<string>('SMTP_USER'),
                        pass: config.get<string>('SMTP_PASS')
                    },
                },
                template: {
                    dir: join(__dirname, 'templates'),
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true
                    }
                }
            }),
            inject: [ConfigService]
        })
    ],
    providers: [MailService],
    exports: [MailService]
})
export class MailerModule {}
