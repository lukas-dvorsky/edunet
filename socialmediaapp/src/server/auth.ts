import { type NextAuthHandlerParams } from "next-auth/core";
import NextAuth from "next-auth/next";
import { authOptions } from "~/pages/api/auth/[...nextauth]";

const handler: NextAuthHandlerParams = NextAuth(authOptions);

export default handler;

export { handler as GET, handler as POST };
