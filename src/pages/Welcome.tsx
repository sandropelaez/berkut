import { Link } from "react-router-dom";
import ScriptText from "@/components/ScriptText";
import { Logo, Tag } from "@/components/ui";

export default function Welcome() {
  return (
    <div className="min-h-screen flex flex-col px-6 pt-[calc(32px+env(safe-area-inset-top))] pb-[calc(24px+env(safe-area-inset-bottom))]">
      <div className="mx-auto w-full max-w-content flex-1 flex flex-col">
        <Logo size={40} wordmark />
        <div className="flex-1 flex flex-col justify-center py-12">
          <div>
            <Tag>
              <span>
                <ScriptText>Қазақ тілі</ScriptText> · Kazakh
              </span>
            </Tag>
          </div>
          <h1 className="mt-6">
            <span className="block text-display-xl">
              <ScriptText>Сәлем.</ScriptText>
            </span>
            <span className="mt-3 block text-title-lg">Learn the language of the steppe.</span>
          </h1>
          <p className="mt-4 text-lede text-berkut-ink-muted">
            Three-minute lessons in Cyrillic and Latin, with real culture and smart review.
          </p>
        </div>

        <div className="grid gap-3">
          <Link to="/" className="btn-primary btn-block">
            Start learning
          </Link>
          <Link to="/auth/register" className="btn-secondary btn-block">
            Create an account
          </Link>
          <Link to="/auth/login" className="btn-ghost btn-block">
            I already have an account
          </Link>
        </div>
      </div>
    </div>
  );
}
