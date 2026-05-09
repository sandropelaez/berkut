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
