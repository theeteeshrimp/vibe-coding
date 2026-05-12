import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { signOut } from "@/lib/auth";
import { Plus, Folder, LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DeleteProjectButton } from "@/components/DeleteProjectButton";

export default async function Home() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userId = (session.user as any).id;
  const userProjects = await db.query.projects.findMany({
    where: eq(projects.userId, userId),
    orderBy: desc(projects.updatedAt),
  });

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <header className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">V</div>
            <h1 className="text-xl font-semibold">Vibe Coding</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">{session.user.email}</span>
            <form action={async () => { "use server"; await signOut({ redirectTo: "/login" }); }}>
              <button type="submit" className="text-gray-400 hover:text-white transition-colors"><LogOut size={18} /></button>
            </form>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Your Projects</h2>
          <form action={createProject}>
            <Button type="submit"><Plus size={16} className="mr-2" />New Project</Button>
          </form>
        </div>
        {userProjects.length === 0 ? (
          <div className="text-center py-20">
            <Folder size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400 mb-4">No projects yet. Create your first one!</p>
            <form action={createProject}><Button type="submit"><Plus size={16} className="mr-2" />New Project</Button></form>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userProjects.map((project) => (
              <div key={project.id} className="group relative border border-[var(--border)] rounded-xl bg-[var(--bg-secondary)] hover:border-indigo-500/50 transition-all">
                <Link href={`/project/${project.id}`} className="block p-5">
                  <h3 className="font-semibold text-lg mb-1 group-hover:text-indigo-400 transition-colors">{project.name}</h3>
                  {project.description && <p className="text-sm text-gray-400 mb-3">{project.description}</p>}
                  <p className="text-xs text-gray-500">Updated {new Date(project.updatedAt).toLocaleDateString()}</p>
                </Link>
                <div className="absolute top-3 right-3"><DeleteProjectButton projectId={project.id} /></div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

async function createProject() {
  "use server";
  const session = await auth();
  if (!session?.user) redirect("/login");
  const userId = (session.user as any).id;
  const [project] = await db.insert(projects).values({ userId, name: "Untitled Project" }).returning();
  const { db: database } = await import("@/lib/db");
  const { files } = await import("@/lib/db/schema");
  await database.insert(files).values([
    { projectId: project.id, name: "index.html", path: "/index.html", language: "html",
      content: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Vibe Project</title>\n  <script src="https://cdn.tailwindcss.com"><\/script>\n</head>\n<body class="bg-gray-900 text-white min-h-screen flex items-center justify-center">\n  <div class="text-center">\n    <h1 class="text-4xl font-bold mb-4">Hello, Vibe! 🚀</h1>\n    <p class="text-gray-400">Start coding by chatting with the AI.</p>\n  </div>\n</body>\n</html>' },
    { projectId: project.id, name: "App.tsx", path: "/App.tsx", language: "typescriptreact",
      content: 'export default function App() {\n  return (\n    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">\n      <div className="text-center">\n        <h1 className="text-4xl font-bold mb-4">Hello, Vibe! 🚀</h1>\n        <p className="text-gray-400">Start coding by chatting with the AI.</p>\n      </div>\n    </div>\n  );\n}' },
    { projectId: project.id, name: "styles.css", path: "/styles.css", language: "css", content: "/* Your styles here */" },
  ]);
  redirect(`/project/${project.id}`);
}
