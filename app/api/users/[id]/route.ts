import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params: paramsPromise }: { params: Promise<{ id: string }> },
) {
  const params = await paramsPromise;
  const { id } = params;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export const PUT = async (
  request: Request,
  { params: paramsPromise }: { params: Promise<{ id: string }> },
) => {
  const params = await paramsPromise;
  const { id } = params;
  try {
    const updatedData = await request.json();

    const updatedUser = await prisma.user.update({
      where: {
        id: id,
      },
      data: updatedData,
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    // Prisma's P2025 error code means "Record to update not found".
    if (error.code === "P2025") {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.error("Error updating user", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};
