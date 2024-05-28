import { Body, Controller, Post, Res } from '@nestjs/common';
import { MailingService } from './mailing.service';
import { Response } from 'express';
import { GenerateCodeDto } from './dto/generate-code.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';

@Controller('mail')
export class MailingController {
  constructor(private mailingService: MailingService) {}

  @Post('code/verify')
  async verifyCode(@Body() dto: VerifyCodeDto, @Res() res: Response) {
    try {
      const { email, code } = dto;
      const result = await this.mailingService.verifyCode(email, +code);
      res.status(result).send();
    } catch (err) {
      res.status(500).send(err);
    }
  }

  @Post('code/generate')
  async generateCode(@Body() dto: GenerateCodeDto) {
    const email: string = dto.email;
    const code = await this.mailingService.generateCode(email);
    await this.mailingService.sendMail(email, code);
  }
}
