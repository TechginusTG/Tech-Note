// This file is no longer used for OAuth providers.
// Authentication is now handled by the backend.
// We are adding a CredentialsProvider here ONLY for the development-mode test login.

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
      },
      async authorize(credentials, req) {
        if (process.env.NODE_ENV !== 'development') {
          throw new Error("Test login is only available in development.");
        }
        if (!credentials?.email) {
          throw new Error("Email not provided for test login.");
        }

        try {
          console.log(`(Server) Searching for user with email: ${credentials.email}`);
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (user) {
            console.log("(Server) Test user found:", user);
            return user;
          } else {
            console.error("(Server) Test user not found in database.");
            throw new Error("Test user with that email not found in the database.");
          }
        } catch (e) {
          console.error("(Server) Error in authorize function:", e);
          throw new Error("An error occurred during authentication.");
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // user 객체는 로그인 직후에만 사용 가능합니다.
      // 이 user 객체의 id를 token에 저장합니다.
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // 위 jwt 콜백에서 저장한 token의 id를 session.user에 넣어줍니다.
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

