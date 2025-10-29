//api/auth/[...nextauth]/route.ts
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import prisma from "@/lib/prisma";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          nickname: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
        };
      },
    }),
    // 개발 환경 전용 테스트 계정 로그인
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
      },
      async authorize(credentials) {
        if (process.env.NODE_ENV !== "development") {
          throw new Error("Test login is only available in development.");
        }
        if (!credentials?.email) {
          throw new Error("Email not provided for test login.");
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            throw new Error(
              "Test user with that email not found in the database.",
            );
          }

          console.log("(Server) Test user found:", user);

          // DB에 저장된 테스트 유저 정보를 그대로 반환
          return {
            id: user.id,
            name: user.name,
            nickname: user.nickname,
            email: user.email,
            image: user.image,
          };
        } catch (e) {
          console.error("(Server) Error in test login:", e);
          throw e;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      // 최초 로그인 시에만 user 객체가 존재
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
