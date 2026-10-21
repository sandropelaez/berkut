import { Link } from "react-router-dom";
import { Ornament, SunMark } from "@/components/ui";

export default function Welcome() {
  return (
    <div className="min-h-screen flex flex-col px-6 pt-[calc(48px+env(safe-area-inset-top))] pb-[calc(24px+env(safe-area-inset-bottom))]">
      <div className="mx-auto w-full max-w-sm flex-1 flex flex-col">
        <div className="flex-1 flex flex-col justify-center">
          <div className="relative mb-10 h-32">
            <span className="absolute left-0 top-0 h-32 w-32 rounded-[28px] bg-berkut-sky" aria-hidden="true" />
            <SunMark size={112} className="absolute left-[72px] -top-6" />
          </div>
          <p className="eyebrow">Қазақ тілі · Kazakh</p>
          <h1 className="mt-3 text-[40px] leading-[44px] tracking-[-0.02em]">
            Сәлем.
            <br />
            Learn the language of the steppe.
          </h1>
          <p className="mt-4 text-[17px] leading-[26px] text-berkut-muted">
            Three-minute lessons in Cyrillic and Latin, with real culture and smart review.
          </p>
        </div>

        <Ornament id="welcome" className="mb-6" />

        <div className="grid gap-3">
          <Link to="/" className="btn-primary w-full">
            Start learning
          </Link>
          <Link to="/auth/register" className="btn-secondary w-full">
            Create an account
          </Link>
          <Link to="/auth/login" className="btn-ghost w-full">
            I already have an account
          </Link>
        </div>
      </div>
    </div>
  );
}
