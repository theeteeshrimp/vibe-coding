import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { messages, files } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const SYSTEM_PROMPT = `You are an expert coding assistant in a vibe coding platform. You help users build web applications.

When the user asks you to create or modify code:
1. Think through the requirements
2. Provide clear, working code
3. Use modern best practices
4. For React/TypeScript, use functional components with hooks
5. For styling, use Tailwind CSS classes

When outputting file changes, use this exact format:
FILE: /path/to/file.ext
\`\`\`language
code here
\`\`\`

Be concise but thorough. Focus on working code over explanations unless asked.`;

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return new Response("Unauthorized", { status: 401 });
  const { id: projectId } = await params;
  const { messages: chatMessages, model = "openai/gpt-4o" } = await req.json();

  const projectFiles = await db.query.files.findMany({ where: eq(files.projectId, projectId) });
  const fileContext = projectFiles.map((f) => `--- ${f.path} ---\n${f.content}`).join("\n\n");

  const messagesWithSystem = [
    { role: "system" as const, content: SYSTEM_PROMPT + "\n\nCurrent project files:\n\n" + fileContext },
    ...chatMessages,
  ];

  const apiKey = process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY;
  const baseUrl = process.env.OPENAI_BASE_URL || "https://openrouter.ai/api/v1";

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      ...(baseUrl.includes("openrouter") && {
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "Vibe Coding Platform",
      }),
    },
    body: JSON.stringify({ model, messages: messagesWithSystem, stream: true }),
  });

  if (!response.ok) return new Response(await response.text(), { status: response.status });

  const reader = response.body?.getReader();
  const encoder = new TextEncoder();
  let fullContent = "";

  const stream = new ReadableStream({
    async start(controller) {
      if (!reader) { controller.close(); return; }
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const text = new TextDecoder().decode(value);
          const lines = text.split("\n").filter((l) => l.startsWith("data: "));
          for (const line of lines) {
            const data = line.replace("data: ", "");
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content || "";
              fullContent += delta;
              controller.enqueue(encoder.encode(delta));
            } catch {}
          }
        }
      } finally {
        try {
          const lastUserMsg = chatMessages[chatMessages.length - 1];
          await db.insert(messages).values([
            { projectId, role: "user", content: lastUserMsg.content },
            { projectId, role: "assistant", content: fullContent },
          ]);
        } catch {}
        controller.close();
      }
    },
  });

  return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache" } });
}
