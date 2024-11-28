import { Listing } from "./listing";
import { User } from "./user";

export type Order = {
    id: number;
    status: string;
    buyer: User;
    approver: User;
    listings: Listing[];
    createdAt: string;
    totalPrice: number;
};

export type OrderMetrics = {
    totalOrders: number;
    totalApprovedOrders: number;
    totalRejectedOrders: number;
    totalOrdersAmount: number;
};