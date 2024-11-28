import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { ListingsService } from '@/listings/listings.service';
import { JwtAuthGuard } from '@/auth/guards/jwt.guard';
import { RolesGuard } from '@/auth/guards/role.guard';
import { Role } from '@/enums';
import { Roles } from '@/decorators/role.decorators';
import { CreateListingDto } from './dto';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { ListingStatus } from '@prisma/client';

@Controller('listings')
@UseGuards(JwtAuthGuard)
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get()
  @Roles(Role.APPROVER, Role.BUYER)
  @UseGuards(RolesGuard)
  @HttpCode(200)
  async getAllListings(
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.listingsService.getAllListings(status, null, page, limit);
  }

  @Get('/seller')
  @Roles(Role.SELLER)
  @UseGuards(RolesGuard)
  @HttpCode(200)
  async getAllListingsBySeller(
    @CurrentUser('id') sellerId: number,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.listingsService.getAllListings(
      status,
      sellerId.toString(),
      page,
      limit,
    );
  }

  @Get(':id')
  @Roles(Role.APPROVER)
  @UseGuards(RolesGuard)
  @HttpCode(200)
  async getListingById(@Param('id') id: string) {
    return this.listingsService.getListingById(+id);
  }

  @Post()
  @Roles(Role.SELLER)
  @UseGuards(RolesGuard)
  @HttpCode(201)
  async createListing(
    @CurrentUser('id') sellerId: number,
    @Body()
    dto: CreateListingDto,
  ) {
    return this.listingsService.createListing(sellerId, dto);
  }

  @Patch(':id/approve')
  @Roles(Role.APPROVER)
  @UseGuards(RolesGuard)
  @HttpCode(200)
  async approveListing(
    @CurrentUser('id') approverId: number,
    @Param('id') id: string,
  ) {
    return this.listingsService.changeListingStatus(
      +id,
      approverId,
      ListingStatus.APPROVED,
    );
  }

  @Patch(':id/reject')
  @Roles(Role.APPROVER)
  @UseGuards(RolesGuard)
  @HttpCode(200)
  async rejectListing(
    @CurrentUser('id') approverId: number,
    @Param('id') id: string,
  ) {
    return this.listingsService.changeListingStatus(
      +id,
      approverId,
      ListingStatus.REJECTED,
    );
  }
}
