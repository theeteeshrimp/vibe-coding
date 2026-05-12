import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id: projectId } = await params;
  const projectFiles = await db.query.files.findMany({ where: eq(files.projectId, projectId) });
  return NextResponse.json(projectFiles);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id: projectId } = await params;
  const { name, path, content, language } = await req.json();
  const [file] = await db.insert(files).values({ projectId, name, path, content: content || "", language: language || "typescript" }).returning();
  return NextResponse.json(file);
}
