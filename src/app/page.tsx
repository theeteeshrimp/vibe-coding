import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { signOut } from "@/lib/auth";
import { Plus, FolderOpen, LogOut, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DeleteProjectButton } from "@/components/DeleteProjectButton";

export default async function Home() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const userId = (session.user as any).id;
  const userProjects = await db.query.projects.findMany({ where: eq(projects.userId, userId), orderBy: desc(projects.updatedAt) });

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/[0.03] rounded-full blur-3xl" />
      </div>
      <header className="border-b border-[var(--border)] bg-[var(--bg-secondary)]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className="text-lg font-bold tracking-tight">Vibe Coding</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-tertiary)] rounded-full border border-[var(--border)]">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold">{(session.user.name || session.user.email || "U")[0].toUpperCase()}</div>
              <span className="text-xs text-[var(--text-secondary)]">{session.user.name || session.user.email}</span>
            </div>
            <form action={async () => { "use server"; await signOut({ redirectTo: "/login" }); }}>
              <button type="submit" className="p-2 rounded-[var(--radius-md)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-all"><LogOut size={16} /></button>
            </form>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8 relative z-10">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{userProjects.length > 0 ? "Your Projects" : "Welcome to Vibe Coding"}</h2>
            <p className="text-sm text-[var(--text-tertiary)] mt-1">{userProjects.length > 0 ? `${userProjects.length} project${userProjects.length !== 1 ? "s" : ""} in your workspace` : "Create your first project to get started"}</p>
          </div>
          <form action={createProject}><Button type="submit"><Plus size={16} className="mr-2" />New Project</Button></form>
        </div>
        {userProjects.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-6"><Sparkles size={36} className="text-[var(--accent)]" /></div>
            <h3 className="text-xl font-semibold mb-2">Start your first project</h3>
            <p className="text-[var(--text-tertiary)] mb-6 max-w-sm mx-auto">Describe what you want to build and AI will generate the code. No setup required.</p>
            <form action={createProject}><Button type="submit" size="lg"><Plus size={18} className="mr-2" />Create Project</Button></form>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userProjects.map((project) => (
              <div key={project.id} className="group relative border border-[var(--border)] rounded-[var(--radius-lg)] bg-[var(--bg-secondary)] hover:border-[var(--accent-border)] card-hover">
                <Link href={`/project/${project.id}`} className="block p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-[var(--radius-md)] bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center"><FolderOpen size={18} className="text-[var(--accent)]" /></div>
                  </div>
                  <h3 className="font-semibold text-base mb-1 group-hover:text-[var(--accent)] transition-colors">{project.name}</h3>
                  {project.description && <p className="text-sm text-[var(--text-tertiary)] mb-3 line-clamp-2">{project.description}</p>}
                  <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-tertiary)]"><Clock size={11} /><span>Updated {new Date(project.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span></div>
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
    { projectId: project.id, name: "index.html", path: "/index.html", language: "html", content: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Vibe Project</title>\n  <script src="https://cdn.tailwindcss.com"><\/script>\n</head>\n<body class="bg-gray-900 text-white min-h-screen flex items-center justify-center">\n  <div class="text-center">\n    <h1 class="text-4xl font-bold mb-4">Hello, Vibe! 🚀</h1>\n    <p class="text-gray-400">Start coding by chatting with the AI.</p>\n  </div>\n</body>\n</html>' },
    { projectId: project.id, name: "App.tsx", path: "/App.tsx", language: "typescriptreact", content: 'export default function App() {\n  return (\n    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">\n      <div className="text-center">\n        <h1 className="text-4xl font-bold mb-4">Hello, Vibe! 🚀</h1>\n        <p className="text-gray-400">Start coding by chatting with the AI.</p>\n      </div>\n    </div>\n  );\n}' },
    { projectId: project.id, name: "styles.css", path: "/styles.css", language: "css", content: "/* Your styles here */" },
  ]);
  redirect(`/project/${project.id}`);
}
