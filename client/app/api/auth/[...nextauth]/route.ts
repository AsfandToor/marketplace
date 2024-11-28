import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "user@mail.com" },
                password: { label: "Password", type: "password" },
            },
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            async authorize(credentials, req) {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_INTERNAL_URL}/auth/signin`, {
                        method: 'POST',
                        body: JSON.stringify(credentials),
                        headers: { "Content-Type": "application/json" },
                    });
    
                    const response = await res.json();
    
                    if (res.status === 401) {
                        return null;
                    }
    
                    if (res.ok && response) {
                        return response;
                    }
                }
                catch (error) {
                    console.error(error);
                }
                return null;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                return { ...token, ...user };
            }

            return token;
        },
        async session({ token, session }) {
            session.user = token.user;
            session.token = token.token;

            return session;
        },
    },
    pages: {
        signIn: "/signin",
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };