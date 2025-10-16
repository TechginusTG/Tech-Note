import { PrismaClient } from '@prisma/client';

// 개발 환경에서 hot-reload 시 PrismaClient가 계속 새로 생성되는 것을 방지하기 위한 코드
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;