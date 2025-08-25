"use client";

import { useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

export default function Page() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    const next = [...messages, { role: "user", content: input } as Msg];
    setMessages(next);
    setInput("");
    setBusy(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        messages: [
          { role: "system", content: "You are a helpful web dev tutor." },
          ...next,
        ],
      }),
    });

    const data = await res.json();
    setMessages([...next, { role: "assistant", content: data.text } as Msg]);
    setBusy(false);
  }

  return (
    <main className="mx-auto max-w-2xl p-6 space-y-4">
      <h1 className="text-xl font-semibold">AI Chatbot (OpenAI + Next.js)</h1>

      <div className="border rounded p-4 space-y-2 h-[60vh] overflow-auto bg-black/5">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
            <span className="inline-block rounded px-3 py-2 bg-white shadow">
              <strong>{m.role === "user" ? "You" : "AI"}:</strong> {m.content}
            </span>
          </div>
        ))}
        {busy && <div className="text-sm opacity-60">Thinking…</div>}
      </div>

      <form onSubmit={send} className="flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything about Next.js, Python, LLMs…"
        />
        <button
          className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
          disabled={busy}
        >
          Send
        </button>
      </form>
    </main>
  );
}
