import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Listing, ListingStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateListingDto } from './dto';
import { ProducerService } from '@/rabbitmq/queue.producer';

@Injectable()
export class ListingsService {
  constructor(
    private prisma: PrismaService,
    private readonly producerService: ProducerService,
  ) {}

  async getAllListings(
    status?: string,
    sellerId?: string,
    page = '1',
    limit = '5',
  ) {
    let listingStatus;

    switch (status) {
      case 'APPROVED':
        listingStatus = ListingStatus.APPROVED;
        break;
      case 'PENDING':
        listingStatus = ListingStatus.PENDING;
        break;
      case 'REJECTED':
        listingStatus = ListingStatus.REJECTED;
        break;
      default:
        listingStatus = undefined;
    }

    const pageNumber = parseInt(page, 10);
    const pageLimit = parseInt(limit, 10);

    const totalListings = await this.prisma.listing.count({
      where: {
        status: listingStatus,
        sellerId: sellerId ? parseInt(sellerId, 10) : undefined,
      },
    });

    const listings = await this.prisma.listing.findMany({
      where: {
        status: listingStatus,
        sellerId: sellerId ? parseInt(sellerId, 10) : undefined,
      },
      include: {
        seller: {
          select: {
            name: true,
          },
        },
      },
      skip: (pageNumber - 1) * pageLimit, // Corrected skip logic
      take: pageLimit,
    });

    return {
      count: totalListings,
      pages: Math.ceil(totalListings / pageLimit),
      hasNextPage: pageNumber * pageLimit < totalListings,
      hasPreviousPage: pageNumber > 1, // Fixed hasPreviousPage logic
      currentPage: pageNumber,
      data: listings,
    };
  }

  async getListingById(id: number) {
    return this.prisma.listing.findUnique({
      where: { id },
      include: {
        seller: true,
      },
    });
  }

  async createListing(sellerId: number, data: CreateListingDto) {
    let listing: Listing;
    try {
      listing = await this.prisma.listing.create({
        data: {
          ...data,
          seller: {
            connect: { id: sellerId },
          },
        },
      });
    } catch (error) {
      console.error('Error creating listing: ', error);
      throw new InternalServerErrorException('Error creating listing');
    }

    try {
      await this.producerService.addToListingQueue(listing);
    } catch (error) {
      console.error('Error sending RabbitMQ message: ', error);
      throw new InternalServerErrorException('Error sending RabbitMQ message');
    }

    return listing;
  }

  // async notifyListings() {
  //   const listings = [];
  //   try {
  //     await this.consumerService.onModuleInit('listings.created', (msg) => {
  //       listings.push(JSON.parse(msg.content.toString()));
  //     });
  //     return listings;
  //   } catch (error) {
  //     console.error('Error receiving RabbitMQ message: ', error);
  //     throw new InternalServerErrorException(
  //       'Error receiving RabbitMQ message',
  //     );
  //   }
  // }

  async changeListingStatus(
    id: number,
    approverId: number,
    status: ListingStatus,
  ) {
    return this.prisma.listing.update({
      where: { id },
      data: { status, approverId },
    });
  }
}
