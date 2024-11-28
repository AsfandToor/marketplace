import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule],
  controllers: [OrdersController],
  providers: [JwtService, OrdersService],
})
export class OrdersModule {}
