"use client";
import { Trash2, FileCode, FileText, FileJson, FileType, Palette } from "lucide-react";

interface FileItem { id: string; name: string; path: string; language: string; }

function getFileConfig(name: string) {
  const ext = name.split(".").pop() || "";
  const configs: Record<string, { icon: any; color: string }> = {
    tsx: { icon: FileCode, color: "text-blue-400" },
    ts: { icon: FileCode, color: "text-blue-400" },
    jsx: { icon: FileCode, color: "text-yellow-400" },
    js: { icon: FileCode, color: "text-yellow-400" },
    html: { icon: FileType, color: "text-orange-400" },
    css: { icon: Palette, color: "text-pink-400" },
    json: { icon: FileJson, color: "text-green-400" },
    md: { icon: FileText, color: "text-gray-400" },
  };
  return configs[ext] || { icon: FileText, color: "text-[var(--text-tertiary)]" };
}

export function FileTree({ files, activeFileId, onSelect, onDelete }: {
  files: FileItem[]; activeFileId: string | null; onSelect: (id: string) => void; onDelete: (id: string) => void;
}) {
  return (
    <div className="space-y-0.5 py-1">
      {files.map((file) => {
        const config = getFileConfig(file.name);
        const Icon = config.icon;
        const isActive = activeFileId === file.id;
        return (
          <div key={file.id} onClick={() => onSelect(file.id)}
            className={`group flex items-center gap-2 px-2.5 py-1.5 rounded-[var(--radius-sm)] cursor-pointer text-[13px] transition-all ${
              isActive
                ? "bg-[var(--accent-bg)] text-[var(--accent)] border border-[var(--accent-border)]"
                : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] border border-transparent"
            }`}>
            <Icon size={14} className={`shrink-0 ${isActive ? "text-[var(--accent)]" : config.color}`} />
            <span className="truncate flex-1 font-medium">{file.name}</span>
            <button onClick={(e) => { e.stopPropagation(); onDelete(file.id); }}
              className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-red-500/10 text-[var(--text-tertiary)] hover:text-[var(--error)] transition-all">
              <Trash2 size={12} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
