import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function GET() {
  const hash = await bcrypt.hash("adminPassword", 10);
  return NextResponse.json({ hash });
}
