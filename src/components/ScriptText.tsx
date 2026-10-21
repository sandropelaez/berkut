import { useStore } from "@/store/useStore";
import { toScript } from "@/core/transliterate";

export default function ScriptText({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  const script = useStore((s) => s.scriptPref);
  return <span className={`kk ${className}`}>{toScript(children, script)}</span>;
}

/**
 * Kazakh text for components that take a plain string (SpokenPrompt): the text in
 * the learner's script, plus a Latin transliteration while they read Cyrillic.
 */
export function useKazakh() {
  const script = useStore((s) => s.scriptPref);
  return (text: string) => ({
    text: toScript(text, script),
    transliteration: script === "CYRILLIC" ? toScript(text, "LATIN") : undefined,
  });
}
