export class OrderListing {
  listingId: number;
  quantity: number;
  price: number;
}

export class CreateOrderDto {
  listings: OrderListing[];
}
