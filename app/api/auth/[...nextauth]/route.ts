//api/auth/[...nextauth]/route.ts
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import prisma from "@/lib/prisma";

/**
 * Generates a unique username based on a nickname.
 * If the nickname is already taken, it appends a number until a unique username is found.
 * @param nickname The base nickname to use.
 */
async function generateUniqueUsername(nickname: string): Promise<string> {
  let username = nickname;
  let userWithSameUsername = await prisma.user.findUnique({
    where: { username: username },
  });
  let counter = 1;
  while (userWithSameUsername) {
    username = `${nickname}${counter}`;
    userWithSameUsername = await prisma.user.findUnique({
      where: { username: username },
    });
    counter++;
  }
  return username;
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      async profile(profile) {
        const nickname = profile.name || profile.login;
        const username = await generateUniqueUsername(nickname);

        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          nickname: nickname,
          username: username,
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
            username: user.username,
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
    async signIn({ user }) {
      if (user.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
        });

        if (dbUser && !dbUser.username) {
          const baseUsername = dbUser.nickname || dbUser.name;
          if (baseUsername) {
            let username = baseUsername;
            let existingUser = await prisma.user.findUnique({
              where: { username: username },
            });
            let counter = 1;
            while (existingUser && existingUser.id !== dbUser.id) {
              username = `${baseUsername}${counter}`;
              existingUser = await prisma.user.findUnique({
                where: { username: username },
              });
              counter++;
            }
            await prisma.user.update({
              where: { id: dbUser.id },
              data: { username: username },
            });
            // Mutate the user object to reflect the change in the same login flow
            user.username = username;
          }
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      // 최초 로그인 시에만 user 객체가 존재
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;

        const userFromDb = await prisma.user.findUnique({
          where: { id: token.id as string },
        });

        if (userFromDb) {
          session.user.name = userFromDb.name;
          session.user.email = userFromDb.email;
          session.user.image = userFromDb.image;
          session.user.username = userFromDb.username;
          session.user.nickname = userFromDb.nickname;
        }
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
