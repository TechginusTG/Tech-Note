import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]";
import bcrypt from "bcrypt";

export async function PUT(
  request: Request,
  context: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = context.params;
  if (parseInt(id, 10) !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, password, profilePicture } = body;

    const dataToUpdate: any = {};

    if (name) {
      dataToUpdate.name = name;
    }

    if (password && password.length > 0) {
      const hashedPassword = await bcrypt.hash(password, 10);
      dataToUpdate.password = hashedPassword;
    }

    if (profilePicture) {
      dataToUpdate.image = profilePicture;
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id, 10) },
      data: dataToUpdate,
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error(`Error updating user ${id}:`, error);
    return NextResponse.json({ error: "Error updating user" }, { status: 500 });
  }
}
