"use client";
import { useMemo, useRef, useEffect, useState } from "react";
import { RefreshCw, Smartphone, Monitor, Tablet, Loader2 } from "lucide-react";

interface File { id: string; name: string; path: string; content: string; language: string; }

type ViewportSize = "mobile" | "tablet" | "desktop";
const VIEWPORT_WIDTHS: Record<ViewportSize, string> = { mobile: "375px", tablet: "768px", desktop: "100%" };
const VIEWPORT_HEIGHTS: Record<ViewportSize, string> = { mobile: "667px", tablet: "1024px", "desktop": "100%" };

export function Preview({ files }: { files: File[] }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [viewport, setViewport] = useState<ViewportSize>("desktop");
  const [key, setKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const htmlContent = useMemo(() => {
    const htmlFile = files.find((f) => f.name === "index.html" || f.path === "/index.html");
    const cssFile = files.find((f) => f.name === "styles.css" || f.path === "/styles.css");
    const tsxFile = files.find((f) => f.name === "App.tsx" || f.path === "/App.tsx");

    if (htmlFile) {
      let html = htmlFile.content;
      if (cssFile) {
        const inject = `<style>${cssFile.content}</style>`;
        html = html.includes("</head>") ? html.replace("</head>", `${inject}</head>`) : inject + html;
      }
      return html;
    }

    if (tsxFile) {
      return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  ${cssFile ? `<style>${cssFile.content}</style>` : ""}
</head>
<body><div id="root"></div>
<script type="text/babel" data-presets="react,typescript">
${tsxFile.content.replace(/export\s+default\s+/, "")}
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
</script></body></html>`;
    }

    return `<!DOCTYPE html><html><head><style>body{font-family:ui-monospace,monospace;padding:24px;background:#09090b;color:#a1a1aa;white-space:pre-wrap;font-size:13px;line-height:1.6;}</style></head><body>${files.map((f) => `<h3 style="color:#818cf8;margin-top:16px;">${f.path}</h3><code>${f.content.replace(/</g,"&lt;").replace(/>/g,"&gt;")}</code>`).join("<hr style=\"border-color:#27272a;margin:16px 0;\"/>")}</body></html>`;
  }, [files]);

  useEffect(() => {
    if (iframeRef.current) {
      setIsLoading(true);
      const doc = iframeRef.current.contentDocument;
      if (doc) { doc.open(); doc.write(htmlContent); doc.close(); }
    }
  }, [htmlContent, key]);

  const viewportOptions: { key: ViewportSize; icon: any; label: string }[] = [
    { key: "mobile", icon: Smartphone, label: "Mobile" },
    { key: "tablet", icon: Tablet, label: "Tablet" },
    { key: "desktop", icon: Monitor, label: "Desktop" },
  ];

  return (
    <div className="h-full flex flex-col bg-[var(--bg-primary)]">
      <div className="h-10 border-b border-[var(--border)] bg-[var(--bg-secondary)] flex items-center px-3 gap-1.5">
        <div className="flex items-center bg-[var(--bg-tertiary)] rounded-[var(--radius-sm)] p-0.5 gap-0.5">
          {viewportOptions.map(({ key: v, icon: VIcon, label }) => (
            <button key={v} onClick={() => setViewport(v)} title={label}
              className={`p-1.5 rounded-[var(--radius-sm)] transition-all ${viewport === v ? "bg-[var(--accent)] text-white shadow-sm" : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"}`}>
              <VIcon size={13} />
            </button>
          ))}
        </div>
        <div className="w-px h-4 bg-[var(--border)] mx-1" />
        <button onClick={() => setKey((k) => k + 1)} title="Refresh preview"
          className="p-1.5 rounded-[var(--radius-sm)] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-all">
          <RefreshCw size={13} />
        </button>
        <div className="flex-1" />
        <div className="flex items-center gap-1.5">
          {isLoading && <Loader2 size={11} className="text-[var(--accent)] animate-spin" />}
          <span className="text-[10px] text-[var(--text-tertiary)] font-mono uppercase tracking-wider">Preview</span>
        </div>
      </div>
      <div className="flex-1 flex items-start justify-center bg-[#09090b] p-4 overflow-auto">
        <div className="bg-white rounded-[var(--radius-lg)] overflow-hidden shadow-2xl shadow-black/40 transition-all duration-300 border border-[var(--border)]"
          style={{ width: VIEWPORT_WIDTHS[viewport], height: VIEWPORT_HEIGHTS[viewport], maxWidth: "100%" }}>
          <iframe ref={iframeRef} title="Preview" className="w-full h-full border-0" sandbox="allow-scripts allow-modals" onLoad={() => setIsLoading(false)} />
        </div>
      </div>
    </div>
  );
}
