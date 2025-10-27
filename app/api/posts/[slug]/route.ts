import { NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { allowedNodeEnvironmentFlags } from "process";
import { NextResponse } from "next/server";

export async function GET(
  requst: Request,
  { params }: { params: { slug: string } },
) {
  const slug = params.slug;

  try {
    const post = await prisma.post.findUnique({
      where: {
        slug: slug,
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
