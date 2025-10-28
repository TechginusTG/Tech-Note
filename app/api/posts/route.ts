import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest, response: NextResponse) {
  try {
    const body = await request.json();
    const { title, content, author, attachments };
  } catch (e) {
    console.error("Couldn't post this post", e);
    return response.status(500).json({ error: "Couldn't post this post" });
  }
}
