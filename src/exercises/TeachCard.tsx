import type { TeachPrompt } from "@/core/types";
import ScriptText from "@/components/ScriptText";
import { speakKazakh } from "@/core/tts";

// Renders a string with **bold** and *italic* spans. Every segment goes
// through ScriptText so inline Kazakh follows the learner's script preference
// (Latin characters pass through transliteration untouched).
function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*.+?\*\*|\*[^*\s][^*]*?\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
          return (
            <strong key={i} className="text-berkut-primary font-extrabold">
              <ScriptText>{part.slice(2, -2)}</ScriptText>
            </strong>
          );
        }
        if (part.length > 2 && part.startsWith("*") && part.endsWith("*")) {
          return (
            <em key={i}>
              <ScriptText>{part.slice(1, -1)}</ScriptText>
            </em>
          );
        }
        return part ? <ScriptText key={i}>{part}</ScriptText> : null;
      })}
    </>
  );
}

const plain = (s: string) => s.replace(/\*/g, "");

export default function TeachCard({ prompt }: { prompt: TeachPrompt }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <span className="chip bg-berkut-primary/10 text-berkut-primary text-xs uppercase tracking-wide">
          💡 Learn
        </span>
      </div>
      <h2 className="text-2xl font-extrabold">
        <Rich text={prompt.title} />
      </h2>

      {prompt.body?.map((p, i) => (
        <p key={i} className="text-lg leading-relaxed">
          <Rich text={p} />
        </p>
      ))}

      {prompt.table && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                {prompt.table.headers.map((h, i) => (
                  <th
                    key={i}
                    className="px-2 py-2 text-sm font-bold text-berkut-muted dark:text-berkut-muted-dark border-b-2 border-berkut-border dark:border-berkut-border-dark"
                  >
                    <Rich text={h} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {prompt.table.rows.map((row, r) => (
                <tr key={r} className="border-b border-berkut-border dark:border-berkut-border-dark">
                  {row.map((cell, c) => (
                    <td key={c} className="px-2 py-2 align-top text-[15px] sm:text-base">
                      <Rich text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {prompt.examples && prompt.examples.length > 0 && (
        <div className="grid grid-cols-1 gap-2">
          {prompt.examples.map((ex, i) => (
            <button
              key={i}
              onClick={() => speakKazakh(plain(ex.kk))}
              className="card !p-3 text-left flex items-center gap-3 hover:border-berkut-primary transition"
            >
              <span className="text-base">🔊</span>
              <span className="flex-1">
                <span className="block text-lg font-bold">
                  <Rich text={ex.kk} />
                </span>
                <span className="block text-sm text-berkut-muted dark:text-berkut-muted-dark">
                  {ex.en}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}

      {prompt.tip && (
        <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 dark:bg-amber-500/10 dark:border-amber-500/40 p-4 text-base">
          <span className="font-bold">Tip: </span>
          <Rich text={prompt.tip} />
        </div>
      )}
    </div>
  );
}
