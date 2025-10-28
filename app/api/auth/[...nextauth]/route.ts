//CredentialsProvider is only for test.
//We are servicing Github Oauth.
import { PrismaAdapter } from "@auth/prisma-adapter";
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
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
      },
      async authorize(credentials, req) {
        if (process.env.NODE_ENV !== "development") {
          throw new Error("Test login is only available in development.");
        }
        if (!credentials?.email) {
          throw new Error("Email not provided for test login.");
        }
        try {
          console.log(
            `(Server) Searching for user with email: ${credentials.email}`,
          );
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });
          if (user) {
            console.log("(Server) Test user found:", user);
            return user;
          } else {
            console.error("(Server) Test user not found in database.");
            throw new Error(
              "Test user with that email not found in the database.",
            );
          }
        } catch (e) {
          console.error("(Server) Error in authorize function:", e);
          throw new Error("An error occurred during authentication.");
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // GitHub OAuth로 가입하고 프로필이 있는 경우
      if (account?.provider === "github" && profile) {
        // user 객체에 nickname과 name 값을 직접 설정합니다.
        // 이렇게 하면 Prisma 어댑터가 이 정보를 사용하여 사용자를 생성합니다.
        user.nickname = profile.name || profile.login;
        user.name = null; // 기존 로직에 따라 name은 null로 설정
      }
      return true;
    },
    async jwt({ token, user }) {
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
