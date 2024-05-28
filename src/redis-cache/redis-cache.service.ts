import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  private makeKeyString(id: number | string) {
    return `${id}`;
  }

  async get(id: number | string) {
    const data = await this.cacheManager.get(this.makeKeyString(id));
    if (data) {
      return data;
    }
    return -1;
  }

  async set(id: number | string, value: string | number, ttl: number = 60) {
    await this.cacheManager.set(this.makeKeyString(id), value, ttl);
    return value;
  }

  async del(id: number | string) {
    await this.cacheManager.del(this.makeKeyString(id));
    return 1;
  }
}
