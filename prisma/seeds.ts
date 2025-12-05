import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log(`db 초기값 설정중...`);

  const testUser = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      name: "TEST",
    },
  });

  // 테스트 유저와 연결된 Account 레코드를 생성합니다.
  await prisma.account.upsert({
    where: {
      provider_providerAccountId: {
        provider: "credentials",
        providerAccountId: testUser.id,
      },
    },
    update: {},
    create: {
      userId: testUser.id,
      type: "credentials",
      provider: "credentials",
      providerAccountId: testUser.id,
    },
  });

  console.log(
    `테스트 사용자 및 계정 생성 완료. name:${testUser.name}, email:${testUser.email}`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
