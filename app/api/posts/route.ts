import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET /api/posts - 모든 게시물 가져오기
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const category = searchParams.get("category");
  const skip = (page - 1) * limit;

  try {
    const where: any = {};
    if (category) {
      where.category = {
        name: category,
      };
    }

    const posts = await prisma.post.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    const totalPosts = await prisma.post.count({ where });
    const totalPages = Math.ceil(totalPosts / limit);

    return NextResponse.json({
      posts,
      totalPosts,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Error fetching posts" },
      { status: 500 },
    );
  }
}

// POST /api/posts - 새 게시물 만들기
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, content, categoryName } = await req.json();

    // Slug 생성 (간단한 버전)
    const slug = title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // categoryName이 없으면 'uncategorized'를 기본값으로 사용
    const finalCategoryName = categoryName || "uncategorized";

    // 해당 이름의 카테고리가 있으면 찾고, 없으면 새로 생성
    const category = await prisma.category.upsert({
      where: { name: finalCategoryName },
      update: {},
      create: { name: finalCategoryName },
    });

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        slug,
        authorId: user.id,
        categoryId: category.id, // 생성되거나 찾은 카테고리의 ID를 연결
      },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Error creating post" }, { status: 500 });
  }
}
