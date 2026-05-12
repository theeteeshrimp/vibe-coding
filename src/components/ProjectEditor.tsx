"use client";
import { useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Plus, FileCode, Eye, MessageSquare, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { ChatPanel } from "./ChatPanel";
import { Preview } from "./Preview";
import { FileTree } from "./FileTree";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

interface File { id: string; projectId: string; name: string; path: string; content: string; language: string; createdAt: Date; updatedAt: Date; }
interface Project { id: string; userId: string; name: string; description: string | null; createdAt: Date; updatedAt: Date; }

const LANG_MAP: Record<string, string> = { tsx: "typescript", ts: "typescript", jsx: "javascript", js: "javascript", html: "html", css: "css", json: "json", md: "markdown" };
function getLanguage(fileName: string) { const ext = fileName.split(".").pop() || ""; return LANG_MAP[ext] || "plaintext"; }

export function ProjectEditor({ project, initialFiles }: { project: Project; initialFiles: File[] }) {
  const [files, setFiles] = useState<File[]>(initialFiles);
  const [activeFileId, setActiveFileId] = useState<string | null>(initialFiles[0]?.id || null);
  const [activeTab, setActiveTab] = useState<"editor" | "preview" | "chat">("chat");
  const [isStreaming, setIsStreaming] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([]);
  const [showNewFile, setShowNewFile] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const editorRef = useRef<any>(null);
  const activeFile = files.find((f) => f.id === activeFileId);

  const updateFileContent = useCallback(async (fileId: string, content: string) => {
    setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, content } : f)));
    await fetch(`/api/projects/${project.id}/files/${fileId}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content }),
    });
  }, [project.id]);

  const createFile = useCallback(async () => {
    if (!newFileName.trim()) return;
    const path = newFileName.startsWith("/") ? newFileName : `/${newFileName}`;
    const res = await fetch(`/api/projects/${project.id}/files`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newFileName, path, content: "", language: getLanguage(newFileName) }),
    });
    const file = await res.json();
    setFiles((prev) => [...prev, file]);
    setActiveFileId(file.id); setNewFileName(""); setShowNewFile(false); setActiveTab("editor");
  }, [newFileName, project.id]);

  const deleteFile = useCallback(async (fileId: string) => {
    await fetch(`/api/projects/${project.id}/files/${fileId}`, { method: "DELETE" });
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    if (activeFileId === fileId) setActiveFileId(files.find((f) => f.id !== fileId)?.id || null);
  }, [project.id, activeFileId, files]);

  const sendMessage = useCallback(async (content: string) => {
    const userMessage = { role: "user", content };
    const newMessages = [...chatMessages, userMessage];
    setChatMessages(newMessages);
    setIsStreaming(true);
    try {
      const res = await fetch(`/api/projects/${project.id}/chat`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: newMessages }),
      });
      if (!res.ok) { setChatMessages((prev) => [...prev, { role: "assistant", content: "Error: Failed to get response." }]); setIsStreaming(false); return; }
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";
      setChatMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const text = decoder.decode(value);
          assistantContent += text;
          setChatMessages((prev) => { const u = [...prev]; u[u.length - 1] = { role: "assistant", content: assistantContent }; return u; });
        }
      }
    } catch { setChatMessages((prev) => [...prev, { role: "assistant", content: "Error: Connection failed." }]); }
    setIsStreaming(false);
  }, [chatMessages, project.id]);

  return (
    <div className="h-screen flex flex-col bg-[var(--bg-primary)]">
      <header className="h-12 border-b border-[var(--border)] bg-[var(--bg-secondary)] flex items-center px-4 gap-4 shrink-0">
        <Link href="/" className="text-gray-400 hover:text-white transition-colors"><ChevronLeft size={18} /></Link>
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">V</div>
        <span className="font-medium text-sm">{project.name}</span>
        <div className="flex-1" />
        <div className="flex items-center bg-[var(--bg-tertiary)] rounded-lg p-0.5">
          {([["chat", MessageSquare, "Chat"], ["editor", FileCode, "Code"], ["preview", Eye, "Preview"]] as const).map(([tab, Icon, label]) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 text-xs rounded-md transition-all ${activeTab === tab ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white"}`}>
              <Icon size={14} className="inline mr-1" />{label}
            </button>
          ))}
        </div>
      </header>
      <div className="flex-1 overflow-hidden">
        {activeTab === "chat" ? (
          <PanelGroup direction="horizontal">
            <Panel defaultSize={35} minSize={25} maxSize={50}>
              <ChatPanel messages={chatMessages} onSend={sendMessage} isStreaming={isStreaming} />
            </Panel>
            <PanelResizeHandle className="w-1 bg-[var(--border)] hover:bg-indigo-500/50 transition-colors" />
            <Panel defaultSize={65}><Preview files={files} /></Panel>
          </PanelGroup>
        ) : activeTab === "editor" ? (
          <PanelGroup direction="horizontal">
            <Panel defaultSize={20} minSize={15} maxSize={30}>
              <div className="h-full flex flex-col bg-[var(--bg-secondary)] border-r border-[var(--border)]">
                <div className="p-3 border-b border-[var(--border)] flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Files</span>
                  <button onClick={() => setShowNewFile(true)} className="text-gray-400 hover:text-white transition-colors"><Plus size={14} /></button>
                </div>
                {showNewFile && (
                  <div className="p-2 border-b border-[var(--border)]">
                    <input autoFocus value={newFileName} onChange={(e) => setNewFileName(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") createFile(); if (e.key === "Escape") setShowNewFile(false); }}
                      placeholder="filename.tsx"
                      className="w-full px-2 py-1.5 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                  </div>
                )}
                <div className="flex-1 overflow-y-auto p-2">
                  <FileTree files={files} activeFileId={activeFileId} onSelect={setActiveFileId} onDelete={deleteFile} />
                </div>
              </div>
            </Panel>
            <PanelResizeHandle className="w-1 bg-[var(--border)] hover:bg-indigo-500/50 transition-colors" />
            <Panel>
              {activeFile ? (
                <div className="h-full flex flex-col">
                  <div className="h-9 border-b border-[var(--border)] bg-[var(--bg-secondary)] flex items-center px-2 gap-1">
                    <div className="px-3 py-1.5 bg-[var(--bg-primary)] rounded-t text-xs text-indigo-400 border-t-2 border-indigo-500 flex items-center gap-2">
                      <FileCode size={12} />{activeFile.name}
                    </div>
                  </div>
                  <div className="flex-1">
                    <Editor height="100%" language={getLanguage(activeFile.name)} value={activeFile.content} theme="vs-dark"
                      onChange={(value) => { if (value !== undefined && activeFileId) updateFileContent(activeFileId, value); }}
                      onMount={(editor) => { editorRef.current = editor; }}
                      options={{ fontSize: 13, fontFamily: "JetBrains Mono, Menlo, monospace", minimap: { enabled: false }, scrollBeyondLastLine: false, automaticLayout: true, tabSize: 2, wordWrap: "on", padding: { top: 12 } }} />
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <div className="text-center"><FileCode size={32} className="mx-auto mb-2 opacity-50" /><p className="text-sm">Select a file to edit</p></div>
                </div>
              )}
            </Panel>
          </PanelGroup>
        ) : (
          <Preview files={files} />
        )}
      </div>
    </div>
  );
}
