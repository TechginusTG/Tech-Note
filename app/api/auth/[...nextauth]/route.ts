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
      // GitHub OAuth로 가입하는 경우
      if (account?.provider === "github" && profile) {
        try {
          // GitHub name을 nickname으로 저장하고 name은 null로
          await prisma.user.update({
            where: { id: user.id },
            data: {
              nickname: profile.name || profile.login, // GitHub 이름 또는 username을 닉네임으로
              name: null, // 실명 필드는 비워둠
            },
          });
        } catch (error) {
          console.error("Error in signIn callback:", error);
        }
      }

      return true;
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;

        // DB에서 nickname 가져오기
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { nickname: true, name: true },
        });

        token.nickname = dbUser?.nickname;
        token.name = dbUser?.name; // 실명 (처음엔 null)
      }
      return token;
    },
    async session({ session, token, user }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string; // 실명
        session.user.nickname = token.nickname as string; // 닉네임
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
