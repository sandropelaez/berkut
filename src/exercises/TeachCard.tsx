import type { TeachPrompt } from "@/core/types";
import ScriptText from "@/components/ScriptText";
import { speakKazakh } from "@/core/tts";
import { Icon, Tag } from "@/components/ui";

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
            <strong key={i} className="text-berkut-turquoise-ink font-semibold">
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
      <div>
        <Tag>
          <Icon name="bulb" size={16} /> Learn
        </Tag>
      </div>
      <h2 className="text-title-md">
        <Rich text={prompt.title} />
      </h2>

      {prompt.body?.map((p, i) => (
        <p key={i} className="text-body">
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
                    className="px-2 py-2 text-small font-semibold text-berkut-ink-muted border-b-2 border-berkut-line"
                  >
                    <Rich text={h} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {prompt.table.rows.map((row, r) => (
                <tr key={r} className="border-b border-berkut-line">
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
              className="flex items-center gap-3 rounded-tile bg-berkut-surface p-3 pr-4 text-left transition-colors hover:bg-berkut-turquoise-soft"
            >
              <span className="iconbtn iconbtn-accent" aria-hidden="true"><Icon name="speaker" size={20} /></span>
              <span className="flex-1">
                <span lang="kk" className="block text-title-sm">
                  <Rich text={ex.kk} />
                </span>
                <span className="block text-small text-berkut-ink-muted">
                  {ex.en}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}

      {prompt.tip && (
        <div className="rounded-tile bg-berkut-turquoise-soft p-5 text-body">
          <span className="font-semibold text-berkut-turquoise-ink">Tip: </span>
          <Rich text={prompt.tip} />
        </div>
      )}
    </div>
  );
}
