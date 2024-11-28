// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            email: string,
            role: string,
            id: string,
            name: string
        },
        token: string;
    } 
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
    interface JWT {
        user: {
            email: string,
            role: string,
            id: string,
            name: string
        },
        token: string;
    }
}