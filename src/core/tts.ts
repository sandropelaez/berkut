// Web Speech API wrapper. Falls back gracefully when unavailable.
// MVP audio strategy per §5.4: pre-recorded clips would replace TTS in production
// (Supabase Storage at /audio/{unit}/{lesson}/{word_id}.mp3).

let cachedVoices: SpeechSynthesisVoice[] | null = null;

function loadVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return [];
  if (cachedVoices && cachedVoices.length) return cachedVoices;
  cachedVoices = window.speechSynthesis.getVoices();
  return cachedVoices;
}

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  window.speechSynthesis.addEventListener?.("voiceschanged", () => {
    cachedVoices = window.speechSynthesis.getVoices();
  });
}

export function ttsSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function speakKazakh(text: string, opts: { rate?: number } = {}): void {
  if (!ttsSupported()) return;
  const synth = window.speechSynthesis;
  synth.cancel();

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "kk-KZ";
  utter.rate = opts.rate ?? 0.85;
  utter.pitch = 1;

  const voices = loadVoices();
  const kk =
    voices.find((v) => v.lang === "kk-KZ") ||
    voices.find((v) => v.lang.startsWith("kk")) ||
    voices.find((v) => v.lang === "ru-RU") ||
    voices.find((v) => v.lang.startsWith("ru"));
  if (kk) utter.voice = kk;

  synth.speak(utter);
}
