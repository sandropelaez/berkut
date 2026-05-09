import { Link } from "react-router-dom";

export default function Welcome() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md text-center">
        <div className="text-6xl mb-4">🦅</div>
        <h1 className="text-4xl font-extrabold tracking-tight">
          Welcome to <span className="text-berkut-primary">Berkut</span>
        </h1>
        <p className="mt-3 text-berkut-muted dark:text-berkut-muted-dark">
          Learn Kazakh — the language of the Steppe — in 3-minute bursts.
          Cyrillic and Latin, real culture, smart review.
        </p>
        <div className="mt-8 grid gap-3">
          <Link to="/" className="btn-primary">
            Start learning
          </Link>
          <Link to="/auth/register" className="btn-outline">
            Create an account
          </Link>
          <Link to="/auth/login" className="text-sm text-berkut-muted dark:text-berkut-muted-dark hover:underline">
            I already have an account
          </Link>
        </div>
      </div>
    </div>
  );
}
