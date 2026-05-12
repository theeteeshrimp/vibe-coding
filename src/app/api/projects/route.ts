import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { projects, files } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;
  const userProjects = await db.query.projects.findMany({ where: eq(projects.userId, userId), orderBy: desc(projects.updatedAt) });
  return NextResponse.json(userProjects);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;
  const { name, description } = await req.json();
  const [project] = await db.insert(projects).values({ userId, name: name || "Untitled Project", description }).returning();
  await db.insert(files).values([
    { projectId: project.id, name: "index.html", path: "/index.html", language: "html", content: "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Vibe Project</title>\n  <script src=\"https://cdn.tailwindcss.com\"></script>\n</head>\n<body class=\"bg-gray-900 text-white min-h-screen flex items-center justify-center\">\n  <div class=\"text-center\">\n    <h1 class=\"text-4xl font-bold mb-4\">Hello, Vibe! 🚀</h1>\n    <p class=\"text-gray-400\">Start coding by chatting with the AI.</p>\n  </div>\n</body>\n</html>" },
    { projectId: project.id, name: "App.tsx", path: "/App.tsx", language: "typescriptreact", content: "export default function App() {\n  return (\n    <div className=\"min-h-screen bg-gray-900 text-white flex items-center justify-center\">\n      <div className=\"text-center\">\n        <h1 className=\"text-4xl font-bold mb-4\">Hello, Vibe! 🚀</h1>\n        <p className=\"text-gray-400\">Start coding by chatting with the AI.</p>\n      </div>\n    </div>\n  );\n}" },
    { projectId: project.id, name: "styles.css", path: "/styles.css", language: "css", content: "/* Your styles here */" },
  ]);
  return NextResponse.json(project);
}
