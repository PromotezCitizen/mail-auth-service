import { Module } from '@nestjs/common';
import { CacheServiceModule } from 'src/redis-cache/redis-cache.module';
import { MailingService } from './mailing.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailingController } from './mailing.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    CacheServiceModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        return {
          transport: {
            host: config.get<string>('mailing.host'),
            port: config.get<number>('mailing.port'),
            auth: {
              user: config.get<string>('mailing.user'),
              pass: config.get<string>('mailing.pass'),
            },
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [MailingController],
  providers: [MailingService],
  exports: [MailingService],
})
export class MailingModule {}
