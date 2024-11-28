import { withAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

export default withAuth(
  async (req) => {
    const token = await getToken({ req });

    const pathname = req.nextUrl.pathname;

    if (!token) {
      const url = new URL("/signin", req.url);
      return Response.redirect(url, 302);
    }

    const roleBasedPaths = {
      buyer: "/buyer",
      seller: "/seller",
      approver: "/approver",
    };

    const allowedPath = roleBasedPaths[token.user.role.toLowerCase() as keyof typeof roleBasedPaths]

    if (!allowedPath || !pathname.includes(allowedPath)) {
      const url = new URL("/signin", req.url);
      return Response.redirect(url, 302);
    }

    return null;
  },
  {
    pages: {
      signIn: "/signin",
    },
  }
);

export const config = {
  matcher: [
    "/approver/:path*",
    "/seller/:path*",
    "/buyer/:path*",
  ],
};