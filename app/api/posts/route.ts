import { NextResponse } from "next/server";
import { prisma } from "@/lib/api";

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return NextResponse.json(posts);
}
