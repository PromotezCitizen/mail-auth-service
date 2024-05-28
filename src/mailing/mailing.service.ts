import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';

@Injectable()
export class MailingService {
  constructor(
    private readonly cacheService: RedisCacheService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  private TTL: number = 300;

  async generateCode(email: string) {
    const rand = Math.floor(Math.random() * 10000) + 10000;
    try {
      await this.cacheService.set(email, rand, this.TTL);
      return rand;
    } catch (err) {
      return -1;
    }
  }

  async sendMail(email: string, code: number) {
    const emailOptions: ISendMailOptions = {
      from: this.configService.get<string>('mailing.host_user'),
      to: email,
      subject: '가입 인증 메일',
      html: `<h1> 인증 코드를 입력하면 가입 인증이 완료됩니다.</h1><br/>${code}`,
    };
    this.mailerService
      .sendMail(emailOptions)
      .then((result) => console.log(result))
      .catch((err) => new ConflictException(err));
  }

  async verifyCode(email: string, value: number) {
    const cacheValue = await this.cacheService.get(email);
    if (value === cacheValue) {
      return 200;
    } else {
      return 400;
    }
  }
}
