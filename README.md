# Berkut 🦅

Kazakh language learning app — bite-sized lessons, dual-script (Cyrillic ↔ Latin), gamified.

Implementation of the Berkut v1.1 spec: React + Vite + TypeScript, Tailwind, Zustand,
Supabase (Auth + Postgres + Storage), Vercel (frontend + serverless API),
Cloudflare (DNS + CDN).

---

## What's included

- **Skill tree** with Units 1–3 fully seeded (Greetings, Family, Food) and
  Units 4–10 stubbed.
- **Lesson player** with all 6 exercise types from §4: Multiple Choice,
  Translate EN→KK, Translate KK→EN, Listening (Web Speech TTS), Match Pairs,
  Fill-in-the-Blank.
- **Hearts**, **XP**, **streaks**, **gems**, **badges**, **dual-script toggle**,
  **dark mode**.
- **SRS** with the SM-2 algorithm (§7).
- **Auth** via Supabase: email + password, Google SSO, verify-email,
  forgot/reset password, account deletion. Falls back to localStorage-only
  when Supabase env vars aren't set.
- **Cross-device sync** via Supabase RLS-protected tables.
- **Leaderboard** via a Vercel serverless function reading the top 30 from Postgres.

## Project layout

```
berkut/
├── api/                      # Vercel serverless functions (REST endpoints)
│   ├── _lib/supabase.ts      # admin + user-scoped Supabase clients
│   ├── health.ts             # GET /api/health
│   ├── leaderboard.ts        # GET /api/leaderboard
│   ├── progress.ts           # GET/POST /api/progress
│   └── users/me.ts           # DELETE /api/users/me   (GDPR)
├── public/                   # static assets served as-is
├── src/
│   ├── core/                 # transliterate, srs, scoring, tts, types, supabase client
│   ├── components/           # Layout, GoogleButton, ScriptText, ProgressBar
│   ├── data/                 # unit1.ts / unit2.ts / unit3.ts seed content
│   ├── exercises/            # the 6 exercise components
│   ├── pages/                # Home, LessonPlayer, Practice, Profile, Settings, Leaderboard, auth/*
│   ├── store/useStore.ts     # Zustand + persist (offline-first progress)
│   ├── App.tsx               # router
│   ├── main.tsx              # entry
│   └── index.css             # tailwind + design tokens
├── supabase/
│   └── schema.sql            # tables, RLS policies, handle_new_user trigger
├── .env.example
├── tailwind.config.js
├── vite.config.ts
├── vercel.json
└── package.json
```

## Local development

```bash
git clone https://github.com/sandropelaez/berkut.git
cd berkut
cp .env.example .env.local        # fill in Supabase URL + keys (optional for offline mode)
npm install
npm run dev                       # http://localhost:5173
```

The app runs without Supabase configured — auth screens go into a
"local-only" mode and progress saves to `localStorage`. Add Supabase env vars
to enable real accounts and cross-device sync.

---

## Production deployment

You need three accounts: **Supabase** (DB + Auth + OAuth broker), **Vercel**
(frontend + API), **Cloudflare** (DNS — already set up). All free tier.

### 1 · Supabase project (≈5 min)

1. Sign up at <https://supabase.com> → **New project** → name it `berkut-prod`.
   Choose a region near your users (Singapore, Frankfurt, US-East).
2. Wait ~2 min for provisioning.
3. **SQL Editor** → paste the contents of [`supabase/schema.sql`](supabase/schema.sql) →
   **Run**. This creates the tables, RLS policies, and the
   `handle_new_user` trigger.
4. **Project Settings → API** → copy the three values you'll need:
   - `Project URL` → `SUPABASE_URL` and `VITE_SUPABASE_URL`
   - `anon public` key → `SUPABASE_ANON_KEY` and `VITE_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (server-only — never to the client)

### 2 · Google OAuth (≈10 min, optional but recommended)

Follows §12.3 of the spec.

1. <https://console.cloud.google.com> → **New Project** → `berkut-prod`.
2. **APIs & Services → OAuth consent screen** → User type **External** →
   - App name: `Berkut`
   - User support email: your email
   - App domain: `berkutai.com`
   - Authorised domains: `berkutai.com` and `supabase.co`
   - Scopes: `openid`, `userinfo.email`, `userinfo.profile`
   - Publish the app (our scopes are non-sensitive — verification is automatic).
3. **APIs & Services → Credentials → Create Credentials → OAuth client ID**:
   - Type: **Web application**, name: `Berkut Web`
   - Authorised JavaScript origins: `https://berkutai.com`, `http://localhost:5173`
   - Authorised redirect URIs: `https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback`
     (copy the exact URL from the Supabase Providers screen — it must match)
4. Copy the **Client ID** and **Client Secret**.
5. Supabase dashboard → **Authentication → Providers → Google** → toggle on,
   paste Client ID + Secret → **Save**.
6. Supabase dashboard → **Authentication → URL Configuration**:
   - Site URL: `https://berkutai.com`
   - Additional Redirect URLs (one per line):
     - `https://berkutai.com/auth/callback`
     - `http://localhost:5173/auth/callback`

### 3 · Vercel project (≈5 min)

1. <https://vercel.com> → **Add New → Project** → import the
   `sandropelaez/berkut` repo.
2. Framework Preset: **Vite** (auto-detected).
3. **Environment Variables** — add all five from `.env.example`:

   | Name                          | Where to find                                    |
   |-------------------------------|--------------------------------------------------|
   | `VITE_SUPABASE_URL`           | Supabase → Settings → API → Project URL          |
   | `VITE_SUPABASE_ANON_KEY`      | Supabase → Settings → API → anon public          |
   | `SUPABASE_URL`                | (same as above)                                  |
   | `SUPABASE_ANON_KEY`           | (same as above)                                  |
   | `SUPABASE_SERVICE_ROLE_KEY`   | Supabase → Settings → API → service_role         |

   Set scope to **Production, Preview, Development** for all five.
4. **Deploy**. First build takes ~90s.
5. **Settings → Domains** → **Add** → `berkutai.com` and `www.berkutai.com`.
   Vercel will show two DNS records to add (one A or ALIAS for the apex,
   one CNAME for `www`).

### 4 · Cloudflare DNS (≈2 min)

1. Cloudflare dashboard → `berkutai.com` → **DNS → Records**.
2. **Apex (`@`)**: add an `A` record pointing to `76.76.21.21` (Vercel's
   anycast IP), Proxy status: **DNS only** (gray cloud — Vercel issues the
   TLS cert directly via its own edge).
3. **`www`**: add a `CNAME` record pointing to `cname.vercel-dns.com`,
   Proxy status: **DNS only**.
4. Wait 1–5 min for DNS to propagate. Vercel will auto-issue Let's Encrypt
   certs once it sees the records.

> **Why DNS-only and not Cloudflare-proxied?** Vercel's edge already runs
> a CDN and handles HTTPS termination on its own anycast network. Putting
> Cloudflare in front means double-proxying, which complicates SSL renewal
> and breaks Vercel's Edge Network optimizations. If you specifically want
> Cloudflare's WAF / page rules, switch the proxy on **after** Vercel's
> first successful cert issuance and use **Full (strict)** SSL mode.

### 5 · Verify

- `https://berkutai.com` → home screen renders.
- `https://berkutai.com/api/health` → `{ "status": "ok", ... }`
- `https://berkutai.com/api/leaderboard` → `[]` (empty until users sign up).
- `https://berkutai.com/auth/register` → register a real account → confirm
  the verification email arrives → land on the home screen.
- Click **Continue with Google** → should redirect through Google → back to
  the home screen with your Google avatar in the profile menu.

---

## Architecture notes (vs spec §8)

| Spec §8 | This implementation |
|---|---|
| Fastify monolith on Railway/Fly | **Vercel serverless functions** (`/api/*`). Same REST shape, JWT-verified, RLS-protected. Easier to operate at MVP scale. |
| Prisma ORM | **Direct `@supabase/supabase-js` calls** with RLS as the authorisation boundary. Reintroduce Prisma in Phase 2 when query complexity warrants it. |
| Modular monolith → service extraction | All API endpoints live under `/api`; refactor into per-service folders when one of them gets hot. |
| Object storage for audio | **Web Speech TTS** for MVP (free, instant). Swap to pre-recorded MP3s in Supabase Storage at `/audio/{unit}/{lesson}/{word_id}.mp3` when budget allows. |
| Redis cache (Phase 2) | Vercel Edge cache (`s-maxage`) on the leaderboard endpoint. Add Upstash Redis when traffic warrants. |
| Mobile (Expo) | Not built — frontend is web-only for v1.1. The `core/` package is dependency-free and ready to be extracted into `packages/core` for an Expo app later. |

## Going to v1.2 / Phase 2

Things to add when you cross 1k users:

- Upstash Redis for rate-limit counters, idempotency keys, leaderboard
  cache.
- Resend or Postmark for transactional email (currently Supabase's free SMTP).
- Sentry for browser + serverless error tracking.
- A weekly cron (Vercel Cron) to call `select reset_weekly_xp()` on
  Sundays at 00:00 UTC.
- Pre-recorded native-speaker audio for Unit 1–3 vocab.
- Speaking exercises with the Web Speech API.

## Useful commands

```bash
npm run dev         # local dev server, port 5173
npm run build       # type-check + production build (run before pushing)
npm run typecheck   # tsc --noEmit
npm run preview     # serve dist/ locally to spot-check the production bundle
```

## License

Source code MIT. Lesson content © Sandro Pelaez.
