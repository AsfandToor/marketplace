import { Module } from '@nestjs/common';
import { ListingsController } from './listings.controller';
import { ListingsService } from './listings.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';
import { RabbitMQService } from '@/rabbitmq/rabbitmq.service';

@Module({
  imports: [PrismaModule],
  controllers: [ListingsController],
  providers: [ListingsService, JwtService, RabbitMQService],
})
export class ListingsModule {}
