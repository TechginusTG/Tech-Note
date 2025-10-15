import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Prisma 클라이언트 import
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]"; // NextAuth 설정 import

/**
 * GET /api/posts - 모든 게시물 목록을 가져오는 API
 * @param request - Next.js의 Request 객체
 * 쿼리 파라미터로 page, limit, category를 받을 수 있습니다.
 */
export async function GET(request: Request) {
  // URL에서 쿼리 파라미터를 파싱합니다.
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const category = searchParams.get("category");
  const skip = (page - 1) * limit; // 페이지네이션을 위한 offset 계산

  try {
    // Prisma를 사용해 데이터베이스에서 게시물을 조회합니다.
    const where: any = { published: true }; // 기본적으로 공개된 게시물만
    if (category) {
      where.category = { name: category }; // 카테고리 필터링 조건 추가
    }

    const posts = await prisma.post.findMany({
      where,
      include: {
        // 연관된 모델의 데이터를 함께 가져옵니다.
        author: {
          select: { name: true, image: true }, // 작성자 정보 중 이름과 이미지만 선택
        },
        category: true,
        tags: true,
      },
      orderBy: {
        createdAt: "desc", // 최신순으로 정렬
      },
      skip, // 건너뛸 개수
      take: limit, // 가져올 개수
    });

    // 전체 게시물 수를 계산하여 총 페이지 수를 구합니다.
    const totalPosts = await prisma.post.count({ where });

    // 성공적으로 조회된 게시물 목록과 페이지 정보를 JSON으로 반환합니다.
    return NextResponse.json({
      posts,
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    // 에러 발생 시 500 상태 코드와 에러 메시지를 반환합니다.
    return NextResponse.json(
      { error: "Error fetching posts" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/posts - 새로운 게시물을 생성하는 API
 * @param request - Next.js의 Request 객체
 * 요청 본문(body)에 title, content, slug 등의 게시물 정보가 포함되어야 합니다.
 * 인증된 사용자만 게시물을 생성할 수 있습니다.
 */
export async function POST(request: Request) {
  // 서버 사이드에서 현재 세션을 가져옵니다.
  const session = await getServerSession(authOptions);
  // 세션이 없거나 사용자 정보가 없으면 401 Unauthorized 에러를 반환합니다.
  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json(); // 요청 본문을 JSON으로 파싱합니다.
    const { title, content, slug, published, categoryId, tags } = body;

    // 세션의 이메일로 작성자 정보를 조회합니다.
    const author = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!author) {
      return NextResponse.json({ error: "Author not found" }, { status: 404 });
    }

    // Prisma를 사용해 새로운 게시물을 생성합니다.
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        slug,
        published,
        authorId: author.id, // 작성자 ID 연결
        categoryId,
        tags: tags
          ? {
              // 태그가 있으면, 기존 태그를 찾거나 새로 생성하여 연결합니다.
              connectOrCreate: tags.map((tag: string) => ({
                where: { name: tag },
                create: { name: tag },
              })),
            }
          : undefined,
      },
    });

    // 성공적으로 생성된 게시물 정보를 201 Created 상태 코드와 함께 반환합니다.
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Error creating post" }, { status: 500 });
  }
}
