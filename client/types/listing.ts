import { User } from "./user";

export type Listing = {
    id: number;
    title: string;
    description: string;
    price: number;
    status: string;
    seller: User;
    approver: User;
    quantity: number;
};