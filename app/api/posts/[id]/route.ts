import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]";

/**
 * GET /api/posts/[id] - 특정 게시물을 ID로 조회하는 API
 * @param request - Next.js의 Request 객체
 * @param context - URL 파라미터 (e.g., { params: { id: '123' } })
 */
export async function GET(
  request: Request,
  context: { params: { id: string } },
) {
  const { id } = context.params; // URL에서 게시물 ID를 가져옵니다.

  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id, 10) }, // ID는 숫자이므로 변환합니다.
      include: {
        // 연관된 데이터를 함께 로드합니다.
        author: { select: { name: true, image: true } },
        category: true,
        tags: true,
        comments: {
          include: {
            user: { select: { name: true, image: true } }, // 댓글 작성자 정보
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    // 조회수 증가 (선택적 기능)
    await prisma.post.update({
      where: { id: parseInt(id, 10) },
      data: { viewCount: { increment: 1 } },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error(`Error fetching post ${id}:`, error);
    return NextResponse.json({ error: "Error fetching post" }, { status: 500 });
  }
}

/**
 * PUT /api/posts/[id] - 특정 게시물을 수정하는 API
 * @param request - Next.js의 Request 객체
 * @param context - URL 파라미터
 */
export async function PUT(
  request: Request,
  context: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = context.params;
  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id, 10) },
      select: { authorId: true },
    });

    // 게시물이 없거나, 현재 사용자가 작성자가 아닌 경우 권한 없음 처리
    // (관리자 등 추가 권한 로직을 넣을 수도 있습니다)
    if (!post || post.authorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { title, content, slug, published, categoryId, tags } = body;

    const updatedPost = await prisma.post.update({
      where: { id: parseInt(id, 10) },
      data: {
        title,
        content,
        slug,
        published,
        categoryId,
        tags: tags
          ? {
              set: [], // 기존 태그 연결을 모두 끊고
              connectOrCreate: tags.map((tag: string) => ({
                // 새로 연결
                where: { name: tag },
                create: { name: tag },
              })),
            }
          : undefined,
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error(`Error updating post ${id}:`, error);
    return NextResponse.json({ error: "Error updating post" }, { status: 500 });
  }
}

/**
 * DELETE /api/posts/[id] - 특정 게시물을 삭제하는 API
 * @param request - Next.js의 Request 객체
 * @param context - URL 파라미터
 */
export async function DELETE(
  request: Request,
  context: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = context.params;

  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id, 10) },
      select: { authorId: true },
    });

    if (!post || post.authorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.post.delete({
      where: { id: parseInt(id, 10) },
    });

    return new Response(null, { status: 204 }); // 성공적으로 삭제되었으나 컨텐츠는 없음을 의미
  } catch (error) {
    console.error(`Error deleting post ${id}:`, error);
    return NextResponse.json({ error: "Error deleting post" }, { status: 500 });
  }
}
