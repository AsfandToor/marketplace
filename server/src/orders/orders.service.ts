import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async getAllOrders(
    status?: string,
    buyerId?: string,
    sellerId?: string,
    page = '1',
    limit = '5',
  ) {
    let orderStatus;

    switch (status) {
      case 'APPROVED':
        orderStatus = OrderStatus.APPROVED;
        break;
      case 'PENDING':
        orderStatus = OrderStatus.PENDING;
        break;
      case 'REJECTED':
        orderStatus = OrderStatus.REJECTED;
        break;
      default:
        orderStatus = undefined;
    }

    const pageNumber = parseInt(page, 10);
    const pageLimit = parseInt(limit, 10);

    const totalOrders = await this.prisma.order.count({
      where: {
        status: orderStatus,
        buyerId: buyerId ? parseInt(buyerId, 10) : undefined,
        listings: {
          every: {
            listing: {
              sellerId: sellerId ? parseInt(sellerId, 10) : undefined,
            },
          },
        },
      },
    });

    const orders = await this.prisma.order.findMany({
      where: {
        status: orderStatus,
        buyerId: buyerId ? parseInt(buyerId, 10) : undefined,
        listings: {
          every: {
            listing: {
              sellerId: sellerId ? parseInt(sellerId, 10) : undefined,
            },
          },
        },
      },
      include: {
        buyer: {
          select: {
            name: true,
          },
        },
        listings: {
          select: {
            listing: {
              select: {
                price: true,
              },
            },
          },
        },
      },
      skip: (pageNumber - 1) * pageLimit, // Corrected skip logic
      take: pageLimit,
    });

    return {
      count: totalOrders,
      pages: Math.ceil(totalOrders / pageLimit),
      hasNextPage: pageNumber * pageLimit < totalOrders,
      hasPreviousPage: pageNumber > 1, // Fixed hasPreviousPage logic
      currentPage: pageNumber,
      data: orders,
    };
  }

  async getOrderById(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      select: {
        listings: {
          select: {
            listing: {
              select: {
                id: true,
                title: true,
                price: true,
              },
            },
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
          },
        },
        approver: {
          select: {
            id: true,
            name: true,
          },
        },
        createdAt: true,
      },
    });

    return {
      ...order,
      listings: order.listings.map((listing) => listing.listing),
    };
  }

  async getOrderMetrics(sellerId: number) {
    const totalOrders = await this.prisma.order.count({
      where: { listings: { some: { listing: { sellerId } } } },
    });
    const totalApprovedOrders = await this.prisma.order.count({
      where: {
        status: OrderStatus.APPROVED,
        listings: { some: { listing: { sellerId } } },
      },
    });
    const totalOrdersAmount = await this.prisma.order.aggregate({
      where: {
        status: OrderStatus.APPROVED,
        listings: { some: { listing: { sellerId } } },
      },
      _sum: {
        totalPrice: true,
      },
    });

    const totalRejectedOrders = await this.prisma.order.count({
      where: {
        status: OrderStatus.REJECTED,
        listings: { some: { listing: { sellerId } } },
      },
    });

    return {
      totalOrders,
      totalApprovedOrders,
      totalRejectedOrders,
      totalOrdersAmount: totalOrdersAmount._sum.totalPrice,
    };
  }

  async createOrder(buyerId: number, data: CreateOrderDto) {
    const totalPrice = data.listings.reduce(
      (acc, listing) => acc + listing.price * listing.quantity,
      0,
    );

    return this.prisma.order.create({
      data: {
        buyer: {
          connect: {
            id: buyerId,
          },
        },
        listings: {
          createMany: {
            data: data.listings.map((listing) => ({
              listingId: listing.listingId,
              quantity: listing.quantity,
            })),
          },
        },
        totalPrice,
      },
    });
  }

  async changeOrderStatus(
    orderId: number,
    sellerId: number,
    status: OrderStatus,
  ) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: status,
        approver: {
          connect: {
            id: sellerId,
          },
        },
      },
    });
  }
}
