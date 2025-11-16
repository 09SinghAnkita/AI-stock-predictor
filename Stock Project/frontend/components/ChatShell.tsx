// app/components/ChatShell.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Message from "./Message";

type Msg = { id: string; role: "user" | "assistant"; text: string };

const T = {
  emit: (name: string, data?: any) =>
    console.log("[telemetry]", name, data ?? {}),
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

  const getApiBase = () => {
    // Default for local dev
    let apiBase = "http://localhost:8001";

    if (typeof window !== "undefined") {
      const origin = window.location.origin;

      // Localhost → keep default http://localhost:8001
      if (
        origin.includes("localhost:3000") ||
        origin.includes("127.0.0.1:3000")
      ) {
        apiBase = "http://localhost:8001";
      } else {
        // GitHub Codespaces pattern:  ...-3000.app.github.dev → ...-8001.app.github.dev
        apiBase = origin.replace("-3000", "-8001");
      }
    }

    return apiBase;
  };

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

      const apiBase = getApiBase();

      const res = await fetch(`${apiBase}/api/chat/stream/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q }),
        signal: ctrl.signal,
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let first = true;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? "";

        for (const pkt of parts) {
          const line = pkt.replace(/^data:\s?/, ""); // strip "data:"
          if (first) {
            first = false;
            T.emit("first_token", {
              ttft_ms: Math.round(performance.now() - start),
            });
          }
          setMessages((m) =>
            m.map((it) =>
              it.id === aid ? { ...it, text: it.text + line } : it
            )
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
              ? {
                  ...it,
                  text:
                    it.text + "\n\n*Error: stream ended unexpectedly (" +
                    String(err?.message || err) +
                    ").*",
                }
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
      <div
        ref={boxRef}
        className="h-[60vh] overflow-y-auto space-y-2 p-3 border rounded-2xl"
      >
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
        <button
          onClick={onAbort}
          disabled={!busy}
          className="px-3 py-2 rounded-xl border"
        >
          Abort
        </button>
      </div>
    </div>
  );
}
