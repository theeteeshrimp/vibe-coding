"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function DeleteProjectButton({ projectId }: { projectId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const handleDelete = () => {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    startTransition(async () => {
      await fetch(`/api/projects/${projectId}`, { method: "DELETE" });
      router.refresh();
    });
  };
  return (
    <button onClick={handleDelete} disabled={isPending}
      className="p-1.5 rounded-md text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100">
      <Trash2 size={14} />
    </button>
  );
}
