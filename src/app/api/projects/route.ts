import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token || token.role !== "ADMIN") {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { name, description } = await req.json();

  if (!name) {
    return NextResponse.json(
      { message: "Name is required" },
      { status: 400 }
    );
  }

  const project = await prisma.project.create({
    data: {
      name,
      description,
    },
  });

  return NextResponse.json(project, { status: 201 });
}
