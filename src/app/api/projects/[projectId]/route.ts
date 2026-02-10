import { prisma } from "@/lib/prisma";
import { ProjectStatus } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { projectId: string } },
) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token || token.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const status = body?.status as unknown;

  if (
    typeof status !== "string" ||
    !Object.values(ProjectStatus).includes(status as ProjectStatus)
  ) {
    return NextResponse.json({ message: "Invalid status" }, { status: 400 });
  }

  const project = await prisma.project.update({
    where: { id: params.projectId },
    data: { status: status as ProjectStatus },
  });

  return NextResponse.json(project);
}
