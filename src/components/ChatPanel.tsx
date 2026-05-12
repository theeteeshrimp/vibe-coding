"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Bot, User, Sparkles, Copy, Check } from "lucide-react";

interface ChatPanelProps {
  messages: { role: string; content: string }[];
  onSend: (content: string) => void;
  isStreaming: boolean;
}

function MessageContent({ content }: { content: string }) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const renderContent = () => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    return parts.map((part, i) => {
      if (part.startsWith("```") && part.endsWith("```")) {
        const lines = part.slice(3, -3).split("\n");
        const lang = lines[0]?.trim() || "";
        const code = lang ? lines.slice(1).join("\n") : lines.join("\n");
        return (
          <div key={i} className="my-3 rounded-[var(--radius-md)] overflow-hidden border border-[var(--border)]">
            {lang && (
              <div className="flex items-center justify-between px-3 py-1.5 bg-[var(--bg-tertiary)] border-b border-[var(--border)]">
                <span className="text-[10px] font-mono text-[var(--text-tertiary)] uppercase">{lang}</span>
                <button onClick={() => { navigator.clipboard.writeText(code); setCopiedIdx(i); setTimeout(() => setCopiedIdx(null), 2000); }} className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">
                  {copiedIdx === i ? <Check size={12} /> : <Copy size={12} />}
                </button>
              </div>
            )}
            <pre className="p-3 text-xs font-mono overflow-x-auto bg-[var(--bg-primary)]/50"><code className="text-[var(--text-secondary)]">{code}</code></pre>
          </div>
        );
      }
      return part.split("\n").map((line, j) => (<span key={`${i}-${j}`}>{j > 0 && <br />}{line}</span>));
    });
  };
  return <div className="text-sm leading-relaxed">{renderContent()}</div>;
}

export function ChatPanel({ messages, onSend, isStreaming }: ChatPanelProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  const handleSubmit = () => { if (!input.trim() || isStreaming) return; onSend(input.trim()); setInput(""); if (inputRef.current) inputRef.current.style.height = "auto"; };
  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); } };
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => { setInput(e.target.value); e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px"; };
  const suggestions = ["Todo app", "Landing page", "Dashboard", "Chat UI"];

  return (
    <div className="h-full flex flex-col bg-[var(--bg-primary)]">
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center p-6">
            <div className="text-center max-w-xs animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center mx-auto mb-5"><Sparkles size={28} className="text-[var(--accent)]" /></div>
              <h3 className="font-semibold text-lg mb-2">What do you want to build?</h3>
              <p className="text-sm text-[var(--text-tertiary)] leading-relaxed">Describe your idea and I will generate the code.</p>
              <div className="mt-6 flex flex-wrap gap-2 justify-center">
                {suggestions.map((s) => (
                  <button key={s} onClick={() => { setInput(`Create a ${s.toLowerCase()} with React and Tailwind`); inputRef.current?.focus(); }}
                    className="px-3 py-1.5 text-xs rounded-full bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent-border)] hover:text-[var(--accent)] transition-all">{s}</button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-5">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
                {msg.role === "assistant" && (<div className="w-8 h-8 rounded-[var(--radius-md)] bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5"><Bot size={15} className="text-[var(--accent)]" /></div>)}
                <div className={`max-w-[85%] rounded-[var(--radius-lg)] px-4 py-3 ${msg.role === "user" ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/20" : "bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)]"}`}>
                  {msg.content ? <MessageContent content={msg.content} /> : isStreaming && i === messages.length - 1 ? (
                    <div className="flex items-center gap-1.5 py-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse-dot" style={{ animationDelay: "0ms" }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse-dot" style={{ animationDelay: "200ms" }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse-dot" style={{ animationDelay: "400ms" }} />
                    </div>
                  ) : null}
                </div>
                {msg.role === "user" && (<div className="w-8 h-8 rounded-[var(--radius-md)] bg-[var(--bg-tertiary)] border border-[var(--border)] flex items-center justify-center shrink-0 mt-0.5"><User size={15} className="text-[var(--text-tertiary)]" /></div>)}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      <div className="p-4 border-t border-[var(--border)] bg-[var(--bg-secondary)]/50">
        <div className="flex gap-2 items-end">
          <textarea ref={inputRef} value={input} onChange={handleInput} onKeyDown={handleKeyDown} placeholder="Describe what you want to build..." rows={1}
            className="flex-1 px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-[var(--radius-lg)] text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 focus:border-[var(--accent)]/40 resize-none"
            style={{ maxHeight: "160px" }} />
          <button onClick={handleSubmit} disabled={!input.trim() || isStreaming}
            className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 disabled:opacity-30 disabled:cursor-not-allowed rounded-[var(--radius-lg)] text-white transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 disabled:shadow-none">
            {isStreaming ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
