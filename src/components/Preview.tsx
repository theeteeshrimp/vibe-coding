"use client";
import { useMemo, useRef, useEffect, useState } from "react";
import { RefreshCw, Smartphone, Monitor, Tablet } from "lucide-react";

interface File { id: string; name: string; path: string; content: string; language: string; }

type ViewportSize = "mobile" | "tablet" | "desktop";
const VIEWPORT_WIDTHS: Record<ViewportSize, string> = { mobile: "375px", tablet: "768px", desktop: "100%" };

export function Preview({ files }: { files: File[] }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [viewport, setViewport] = useState<ViewportSize>("desktop");
  const [key, setKey] = useState(0);

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

    return `<!DOCTYPE html><html><head><style>body{font-family:monospace;padding:20px;background:#111;color:#ccc;white-space:pre-wrap;}</style></head><body>${files.map((f) => `<h3 style="color:#818cf8">${f.path}</h3><code>${f.content.replace(/</g,"&lt;").replace(/>/g,"&gt;")}</code>`).join("<hr/>")}</body></html>`;
  }, [files]);

  useEffect(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) { doc.open(); doc.write(htmlContent); doc.close(); }
    }
  }, [htmlContent, key]);

  return (
    <div className="h-full flex flex-col bg-[var(--bg-primary)]">
      <div className="h-9 border-b border-[var(--border)] bg-[var(--bg-secondary)] flex items-center px-3 gap-2">
        <div className="flex items-center bg-[var(--bg-tertiary)] rounded-md p-0.5">
          {(["mobile","tablet","desktop"] as ViewportSize[]).map((v) => (
            <button key={v} onClick={() => setViewport(v)}
              className={`p-1 rounded ${viewport === v ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white"}`}>
              {v === "mobile" ? <Smartphone size={12} /> : v === "tablet" ? <Tablet size={12} /> : <Monitor size={12} />}
            </button>
          ))}
        </div>
        <button onClick={() => setKey((k) => k + 1)} className="p-1 text-gray-400 hover:text-white transition-colors">
          <RefreshCw size={12} />
        </button>
        <div className="flex-1" />
        <span className="text-[10px] text-gray-500">Live Preview</span>
      </div>
      <div className="flex-1 flex items-start justify-center bg-[#0a0a0f] p-4 overflow-auto">
        <div className="bg-white rounded-lg overflow-hidden shadow-2xl transition-all duration-300"
          style={{ width: VIEWPORT_WIDTHS[viewport], height: viewport === "desktop" ? "100%" : "600px", maxWidth: "100%" }}>
          <iframe ref={iframeRef} title="Preview" className="w-full h-full border-0" sandbox="allow-scripts allow-modals" />
        </div>
      </div>
    </div>
  );
}
