import { Module } from '@nestjs/common';
import { ListingsController } from './listings.controller';
import { ListingsService } from './listings.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';
import { ProducerService } from '@/rabbitmq/queue.producer';
import { QueueModule } from '@/rabbitmq/queue.module';

@Module({
  imports: [PrismaModule, QueueModule],
  controllers: [ListingsController],
  providers: [ListingsService, JwtService, ProducerService],
})
export class ListingsModule {}
