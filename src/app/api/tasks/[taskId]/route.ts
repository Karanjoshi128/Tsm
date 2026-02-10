import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ taskId: string }> },
) {
  const { taskId } = await context.params;
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task) {
    return NextResponse.json({ message: "Task not found" }, { status: 404 });
  }

  const body = await req.json();

  // 👑 ADMIN: full update
  if (token.role === "ADMIN") {
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        title: body.title,
        description: body.description,
        priority: body.priority,
        status: body.status,
        dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
        assignedToId: body.assignedToId,
      },
    });

    return NextResponse.json(updatedTask);
  }

  // 👤 MEMBER: only update status of own task
  if (token.role === "MEMBER" && task.assignedToId === token.id) {
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        status: body.status,
      },
    });

    return NextResponse.json(updatedTask);
  }

  return NextResponse.json({ message: "Forbidden" }, { status: 403 });
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ taskId: string }> },
) {
  const { taskId } = await context.params;
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token || token.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await prisma.task.delete({
    where: { id: taskId },
  });

  return NextResponse.json({ message: "Task deleted" }, { status: 200 });
}
