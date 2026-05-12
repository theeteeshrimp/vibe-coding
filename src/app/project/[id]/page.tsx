import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { projects, files as filesTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { ProjectEditor } from "@/components/ProjectEditor";

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const { id } = await params;
  const project = await db.query.projects.findFirst({ where: eq(projects.id, id) });
  if (!project) redirect("/");
  const projectFiles = await db.query.files.findMany({ where: eq(filesTable.projectId, id) });
  return <ProjectEditor project={project} initialFiles={projectFiles} />;
}
