import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import { RedisCacheService } from './redis-cache/redis-cache.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly cacheService: RedisCacheService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/cache')
  async getCache(@Query('id') id: number | string) {
    const result = await this.cacheService.get(id);
    return result;
  }

  @Post('/cache')
  async setCache(@Body('id') id: number | string) {
    try {
      return await this.cacheService.set(id, 100);
    } catch (err) {
      return err;
    }
  }

  @Delete('/cache')
  async delCache(@Param('id') id: number | string) {
    try {
      await this.cacheService.del(id);
      return 1;
    } catch (err) {
      return err;
    }
  }
}
