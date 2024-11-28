import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  HttpCode,
  UseGuards,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '@/auth/guards/jwt.guard';
import { CreateOrderDto } from './dto';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { RolesGuard } from '@/auth/guards/role.guard';
import { Roles } from '@/decorators/role.decorators';
import { Role } from '@/enums';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('/seller')
  @Roles(Role.SELLER)
  @UseGuards(RolesGuard)
  @HttpCode(200)
  async getAllOrdersBySeller(
    @CurrentUser('id') sellerId: number,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.ordersService.getAllOrders(
      status,
      null,
      sellerId.toString(),
      page,
      limit,
    );
  }

  @Get('/buyer')
  @Roles(Role.BUYER)
  @UseGuards(RolesGuard)
  @HttpCode(200)
  async getAllOrdersByBuyer(
    @CurrentUser('id') buyerId: number,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.ordersService.getAllOrders(
      status,
      buyerId.toString(),
      null,
      page,
      limit,
    );
  }

  @Get('/metrics')
  @Roles(Role.SELLER)
  @UseGuards(RolesGuard)
  @HttpCode(200)
  async getOrdersMetrics(@CurrentUser('id') sellerId: number) {
    return this.ordersService.getOrderMetrics(sellerId);
  }

  @Get(':id')
  @HttpCode(200)
  async getOrderById(@Param('id') id: string) {
    return this.ordersService.getOrderById(+id);
  }

  @Post()
  @HttpCode(201)
  @Roles(Role.BUYER)
  @UseGuards(RolesGuard)
  async createOrder(
    @CurrentUser('id') buyerId: number,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.ordersService.createOrder(buyerId, createOrderDto);
  }

  @Patch(':orderId/approve')
  @HttpCode(200)
  @Roles(Role.SELLER)
  @UseGuards(RolesGuard)
  async approveOrder(
    @CurrentUser('id') sellerId: number,
    @Param('orderId') orderId: string,
  ) {
    return this.ordersService.changeOrderStatus(+orderId, sellerId, 'APPROVED');
  }

  @Patch(':orderId/reject')
  @HttpCode(200)
  @Roles(Role.SELLER)
  @UseGuards(RolesGuard)
  async rejectOrder(
    @CurrentUser('id') sellerId: number,
    @Param('orderId') orderId: string,
  ) {
    return this.ordersService.changeOrderStatus(+orderId, sellerId, 'REJECTED');
  }
}
