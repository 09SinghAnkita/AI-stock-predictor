export const runtime = "nodejs";

export async function POST(req) {
  const { q } = await req.json();

  // Auto-detect backend base
  const backendBase =
    process.env.BACKEND_BASE ||
    (process.env.CODESPACE_NAME && process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN
      ? `https://${process.env.CODESPACE_NAME}-8001.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}`
      : "http://localhost:8001");

  const upstream = await fetch(`${backendBase}/api/chat/stream/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ q }),
  });

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "X-Accel-Buffering": "no",
    },
  });
}