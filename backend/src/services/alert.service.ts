import { Injectable } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { Consumable } from '../models/consumable.entity';
import { Reagent } from '../models/reagent.entity';
import { redisConfig } from '../config/redis.config';
import { isLowStock } from '../utils/stockAlert';

@Injectable()
export class AlertService {
  private client?: RedisClientType;

  private async redis() {
    if (!this.client) {
      this.client = createClient(redisConfig()) as RedisClientType;
      this.client.on('error', () => undefined);
      await this.client.connect();
    }
    return this.client;
  }

  async cacheLowStockAlert(item: Reagent | Consumable, type: string) {
    if (!isLowStock(Number(item.currentStock), Number(item.minStockThreshold))) return;
    try {
      const client = await this.redis();
      await client.setEx(`low-stock:${type}:${item.id}`, 3600, JSON.stringify({ name: item.name, currentStock: item.currentStock, minStockThreshold: item.minStockThreshold }));
    } catch {
      return;
    }
  }
}
