// app/components/Message.tsx
// FIXES:
// - Correct Prism imports (typescript spelling, theme path)
// - Fix 'neutral' class name typos
// - Give the component a name (helps React DevTools)
// - Keep code block highlighting; basic HTML injection for markdown-ish text

import Prism from "prismjs";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/themes/prism.css";

type Props = { role: "user" | "assistant"; text: string };

export default function Message({ role, text }: Props) {
  const html = text
    // ```lang\n ... ```
    .replace(/```(\w+)?\n([\s\S]*?)```/g, (_m, lang, code) => {
      const l = (lang || "typescript").toLowerCase();
      const grammar =
        // @ts-ignore
        (Prism.languages[l] as Prism.Grammar) || Prism.languages.typescript;
      const highlighted = Prism.highlight(code, grammar, l);
      return `<pre class="rounded-xl overflow-auto p-3 bg-neutral-100 dark:bg-neutral-900"><code class="language-${l}">${highlighted}</code></pre>`;
    })
    // line breaks for non-code text
    .replace(/\n/g, "<br/>");

  return (
    <div
      className={`rounded-2xl p-3 ${
        role === "user"
          ? "bg-blue-50 dark:bg-blue-900/30"
          : "bg-neutral-50 dark:bg-neutral-800"
      }`}
    >
      <div
        className="prose prose-sm max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <button
        className="mt-2 text-xs underline"
        onClick={() => navigator.clipboard.writeText(text)}
      >
        copy
      </button>
    </div>
  );
}
