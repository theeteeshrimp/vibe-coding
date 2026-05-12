"use client";
import { Trash2 } from "lucide-react";

interface FileItem { id: string; name: string; path: string; language: string; }

function getFileIcon(name: string) {
  const ext = name.split(".").pop() || "";
  if (["ts","tsx"].includes(ext)) return "TS";
  if (["js","jsx"].includes(ext)) return "JS";
  if (ext === "html") return "HTML";
  if (ext === "css") return "CSS";
  if (ext === "json") return "JSON";
  if (ext === "md") return "MD";
  return "";
}

export function FileTree({ files, activeFileId, onSelect, onDelete }: {
  files: FileItem[]; activeFileId: string | null; onSelect: (id: string) => void; onDelete: (id: string) => void;
}) {
  return (
    <div className="space-y-0.5">
      {files.map((file) => (
        <div key={file.id} onClick={() => onSelect(file.id)}
          className={`group flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer text-sm transition-colors ${
            activeFileId === file.id ? "bg-indigo-600/20 text-indigo-300" : "text-gray-400 hover:bg-[var(--bg-tertiary)] hover:text-gray-200"
          }`}>
          <span className="text-[10px] font-bold text-gray-500 w-5 text-center shrink-0">{getFileIcon(file.name)}</span>
          <span className="truncate flex-1">{file.name}</span>
          <button onClick={(e) => { e.stopPropagation(); onDelete(file.id); }}
            className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all">
            <Trash2 size={12} />
          </button>
        </div>
      ))}
    </div>
  );
}
