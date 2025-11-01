// app/components/ChatShell.tsx
"use client";

// FIXES:
// - Define correct state types (messages are objects, not string[])
// - Define and use input/busy state (they were undefined)
// - Use AbortController via ref
// - Use ReadableStream + TextDecoder (NOT res.json())
// - Parse SSE "data: ..." packets
// - Render Message components

import { useEffect, useRef, useState } from "react";
import Message from "./Message";

type Msg = { id: string; role: "user" | "assistant"; text: string };

const T = {
  emit: (name: string, data?: any) => console.log("[telemetry]", name, data ?? {}),
};

export default function ChatShell() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [busy, setBusy] = useState(false);
  const ctrlRef = useRef<AbortController | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight });
  }, [messages]);

  const onSend = async () => {
    const q = input.trim();
    if (!q || busy) return;

    const uid = crypto.randomUUID();
    const aid = crypto.randomUUID();
    const start = performance.now();

    setInput("");
    setMessages((m) => [
      ...m,
      { id: uid, role: "user", text: q },
      { id: aid, role: "assistant", text: "" },
    ]);
    setBusy(true);

    const ctrl = new AbortController();
    ctrlRef.current = ctrl;

    try {
      T.emit("send", { q });

      const res = await fetch("http://localhost:8000/api/chat/stream/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q }),
        signal: ctrl.signal,
      });
      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let first = true;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Handle SSE: packets separated by blank line
        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? "";

        for (const pkt of parts) {
          const line = pkt.replace(/^data:\s?/, "");
          if (first) {
            first = false;
            T.emit("first_token", { ttft_ms: Math.round(performance.now() - start) });
          }
          setMessages((m) =>
            m.map((it) => (it.id === aid ? { ...it, text: it.text + line } : it))
          );
        }
      }

      T.emit("done", { latency_ms: Math.round(performance.now() - start) });
    } catch (err: any) {
      if (ctrl.signal.aborted) {
        T.emit("abort", { reason: "user" });
      } else {
        T.emit("error", { message: String(err?.message || err) });
        setMessages((m) =>
          m.map((it) =>
            it.role === "assistant"
              ? { ...it, text: it.text + "\n\n*Error: stream ended unexpectedly.*" }
              : it
          )
        );
      }
    } finally {
      setBusy(false);
      ctrlRef.current = null;
    }
  };

  const onAbort = () => {
    ctrlRef.current?.abort();
  };

  return (
    <div className="mx-auto max-w-2xl space-y-3">
      <div ref={boxRef} className="h-[60vh] overflow-y-auto space-y-2 p-3 border rounded-2xl">
        {messages.map((m) => (
          <Message key={m.id} role={m.role} text={m.text} />
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
          placeholder="Ask something…"
          className="flex-1 border rounded-xl px-3 py-2"
          disabled={busy}
        />
        <button onClick={onSend} disabled={busy} className="px-3 py-2 rounded-xl border">
          {busy ? "Streaming…" : "Send"}
        </button>
        <button onClick={onAbort} disabled={!busy} className="px-3 py-2 rounded-xl border">
          Abort
        </button>
      </div>
    </div>
  );
}
