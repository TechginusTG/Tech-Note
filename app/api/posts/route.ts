import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const data = await request.json();
  const { title, content, category } = data;
  const post = await prisma.post.create({
    data: {
      title,
      content,
      category,
      authorId: 1, // TODO: Replace with actual authorId from session
    },
  });
  return NextResponse.json(post);
}
