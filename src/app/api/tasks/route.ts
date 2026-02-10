import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token || token.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    title,
    description,
    priority,
    status,
    dueDate,
    projectId,
    assignedToId,
  } = body;

  // Basic validation
  if (!title || !projectId || !assignedToId) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 },
    );
  }

  const isAssigneeMember = await prisma.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId: assignedToId,
        projectId,
      },
    },
    select: { id: true },
  });

  if (!isAssigneeMember) {
    return NextResponse.json(
      { message: "Assigned user is not a member of this project" },
      { status: 400 },
    );
  }

  const task = await prisma.task.create({
    data: {
      title,
      description,
      priority,
      status,
      dueDate: dueDate ? new Date(dueDate) : null,
      projectId,
      assignedToId,
    },
  });

  return NextResponse.json(task, { status: 201 });
}

export async function GET(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (token.role === "ADMIN") {
    const tasks = await prisma.task.findMany({
      include: {
        project: true,
        assignedTo: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tasks);
  }

  const tasks = await prisma.task.findMany({
    where: {
      assignedToId: token.id as string,
    },
    include: {
      project: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(tasks);
}
