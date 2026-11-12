# Berkut

Kazakh language learning app — bite-sized lessons, dual-script (Cyrillic ↔ Latin), gamified.

Implementation of the Berkut v1.1 spec: React + Vite + TypeScript, Tailwind, Zustand,
Supabase (Auth + Postgres + Storage), Cloudflare Workers (frontend + API, DNS, CDN).

---

## Design system

The UI follows the **Berkut** design system in Claude Design, **Turquoise Sky**:
https://claude.ai/artifact/2rsJnXzwS24mLoTrJBddQc (brand book, tokens, components, logos, icons).

- **Turquoise is action.** Flag turquoise (`berkut-turquoise`, #00aec7) fills the ONE primary
  button per screen and every progress bar, always with `on-turquoise` text (never white).
  Turquoise as text or a ring is `turquoise-ink`; its tint is `turquoise-soft`.
- **Sun gold is for rewards only:** streaks, reward buttons and the logo's sun (`berkut-sun`).
  Never for navigation.
- `success` / `danger` mean correct / wrong; a choice tile's state is never colour alone
  (correct carries a check, wrong a cross).
- **Type:** one family, Commissioner (400–700), with the system's type styles as Tailwind
  sizes: `text-display-xl`, `text-display-word`, `text-display-sentence`, `text-title-lg/md/sm`,
  `text-lede`, `text-body`, `text-label`, `text-option`, `text-prompt`, `text-translit`,
  `text-small`, `text-caption`. The Kazakh word is always the loudest thing on screen and
  follows the learner's script choice.
- **Themes:** Day (light) and Night (dark). Tokens are RGB-channel CSS variables in
  `src/index.css` (Day on `:root`, Night on `.dark`, toggled in Settings), exposed to Tailwind
  as `berkut-*` in `tailwind.config.js`. Use tokens, never hex.
- **Shape:** buttons, chips and tags are pills; tiles and fields `rounded-tile` (20px); cards and
  sheets `rounded-sheet` (28px) with `shadow-card` / `shadow-sheet`. Buttons are 52px (56px for
  the lesson's bottom button), tiles 60px, icon buttons 44px, content at most 560px, 4px spacing.
- **Logo:** the soaring golden eagle (`Logo`, theme-aware; `size` is its height, never under 24px).
  The favicon is the system's app icon: the eagle on an `ink` rounded square.
- **Components** (`src/components/ui.tsx`, mirroring the system's `index.d.ts`): `Button`,
  `IconButton`, `ChoiceTile` + `optionState`, `SpokenPrompt`, `LessonHeader`, `ProgressBar`,
  `StatChip`, `Tag`, `Field`, `Card`, `Logo`, `Icon` (2px-stroke set), plus a `Loader`. The
  classes they render (`btn-*`, `tile-*`, `card`, `chip`, `tag`, `field`, `iconbtn`) are in
  `src/index.css`.
- **Admin** follows the system's Admin section: `NavItem` sidebar (chart, users, key, book, flag,
  list and trend icons), `StatTile` metrics, `DataTable` lists and `StatusBadge` states
  (`neutral` settled, `info` notable, `success` done, `warning` needs attention, `danger`
  failed). `warning` (orange) is for admin states such as open reports; gold stays for rewards.
- Phone first: design at 375px, one column, primary action at the bottom. Sentence case, no
  emoji in the UI.

## Admin section

Visit `/admin` after signing in with `sandro.a.pelaez@gmail.com` (or any
user you've promoted). The link also appears in the sidebar.

- `/admin` — overview KPIs (DAU/WAU/MAU, signups, completed lessons)
- `/admin/users` — search/list/edit users; hard-delete (cascades)
- `/admin/admins` — grant/revoke roles (super-admin only)
- `/admin/content` — manage languages → units → lessons → exercises
- `/admin/audit` — append-only log of every admin write
- `/admin/analytics` — derived stats

**Granting admin to a new user:**
1. The user must have already registered (signed up + verified).
2. Sign in as `sandro.a.pelaez@gmail.com` → `/admin/admins` → enter their email → pick role.

**Promoting yourself if your email differs:** edit
`supabase/migrations/002_admin_and_content.sql`, change the email in the
bootstrap `UPDATE`, re-run the migration.

## What's included

- **Skill tree** with a 7-unit A1.1 course for complete beginners
  (greetings → harmony → "I am" → plurals → possessives →
  numbers/time/place → present tense), with the alphabet as a separate
  section below the path, learnt alongside it, then A1.2–A2.2 content. See
  [`docs/curriculum.md`](docs/curriculum.md).
- **Lesson player** with all 6 exercise types from §4: Multiple Choice,
  Translate EN→KK, Translate KK→EN, Listening (Web Speech TTS), Match Pairs,
  Fill-in-the-Blank — plus ungraded **teach cards** that explain a rule
  before it's practised.
- **In-lesson repetition** (`src/core/session.ts`), Duolingo-style: every
  exercise comes back a few exercises later in another format (KK→EN as
  EN→KK tiles, fill-in-the-blank as the whole sentence…), lessons close with
  a mixed review, and missed exercises are re-asked later in the lesson.
  Built from each lesson's own content — no extra authoring.
- **Streaks**, **badges**, **dual-script toggle**, **dark mode**. (Hearts, XP,
  gems and the league were removed for now; the `user_profiles` columns remain.)
- **SRS** with the SM-2 algorithm (§7).
- **Auth** via Supabase: email + password, Google SSO, verify-email,
  forgot/reset password, account deletion. Falls back to localStorage-only
  when Supabase env vars aren't set.
- **Cross-device sync** via Supabase RLS-protected tables.

## Project layout

```
berkut/
├── api/                      # API handlers (REST endpoints), run by the Worker
│   ├── _lib/supabase.ts      # admin + user-scoped Supabase clients
│   ├── health.ts             # GET /api/health
│   ├── progress.ts           # GET/POST /api/progress
│   └── users/me.ts           # DELETE /api/users/me   (GDPR)
├── public/                   # static assets served as-is
├── src/
│   ├── core/                 # transliterate, srs, scoring, tts, types, supabase client
│   ├── components/           # Layout, GoogleButton, ScriptText, ProgressBar
│   ├── data/                 # unit1.ts / unit2.ts / unit3.ts seed content
│   ├── exercises/            # the 6 exercise components
│   ├── pages/                # Home, LessonPlayer, Practice, Profile, Settings, auth/*
│   ├── store/useStore.ts     # Zustand + persist (offline-first progress)
│   ├── App.tsx               # router
│   ├── main.tsx              # entry
│   └── index.css             # tailwind + design tokens
├── supabase/
│   └── schema.sql            # tables, RLS policies, handle_new_user trigger
├── .env.example
├── tailwind.config.js
├── vite.config.ts
├── wrangler.jsonc            # Cloudflare Worker: static assets + /api
├── worker/index.ts           # routes /api/* to the handlers in api/
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

You need two accounts: **Supabase** (DB + Auth + OAuth broker) and **Cloudflare**
(frontend + API on Workers, plus DNS). Both free tier.

### 1 · Supabase project (≈5 min)

1. Sign up at <https://supabase.com> → **New project** → name it `berkut-prod`.
   Choose a region near your users (Singapore, Frankfurt, US-East).
2. Wait ~2 min for provisioning.
3. **SQL Editor** → run the migrations in order. Each file is idempotent —
   safe to re-apply when you pull new migrations later:
   - [`supabase/schema.sql`](supabase/schema.sql) — base user/profile tables,
     RLS, `handle_new_user` trigger.
   - [`supabase/migrations/002_admin_and_content.sql`](supabase/migrations/002_admin_and_content.sql) —
     role enum, content tables (`languages`, `units`, `lessons`, `exercises`,
     `vocab`), audit log, lesson revisions, RLS for everything new. **Bootstraps
     `sandro.a.pelaez@gmail.com` as `super_admin` on every run.**
   - [`supabase/migrations/003_seed_content.sql`](supabase/migrations/003_seed_content.sql) —
     upserts the Kazakh language + Units 1–3 content + Units 4–10 stubs.
   - `004` … `012` — reports, curriculum v2 and A1.2–B2 content.
   - [`supabase/migrations/013_beginner_revamp.sql`](supabase/migrations/013_beginner_revamp.sql) —
     the rebuilt beginner course (Units 1–7) and the `TEACH` exercise type.
     Generated by `npm run content:build`; apply it **after** 003–012, since
     it archives the older lessons those migrations put in Units 1–7.
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

### 3 · Cloudflare Worker (≈5 min)

The site and API run as one Cloudflare Worker (`wrangler.jsonc`): the Vite build is
served as static assets with SPA fallback, and `/api/*` runs the handlers in `api/`
through `worker/index.ts`. Smart Placement runs the API near Supabase (Singapore).

1. Cloudflare dashboard → **Workers & Pages → Create → Import a repository** →
   `sandropelaez/berkut`. Build command `npm run build`, deploy command
   `npx wrangler deploy` (Workers Builds reads `wrangler.jsonc`). Every push to `main`
   deploys; other branches get preview URLs.
2. Worker → **Settings → Variables and Secrets** → add the secret
   `SUPABASE_SERVICE_ROLE_KEY` (Supabase → Settings → API → service_role).
   `SUPABASE_URL` / `SUPABASE_ANON_KEY` live in `wrangler.jsonc`, and the browser's
   `VITE_*` values in `.env.production` (both public by design).
3. Worker → **Settings → Domains & Routes** → add custom domains `berkutai.com` and
   `www.berkutai.com`. Delete any old `A` / `CNAME` records for them first.

From a laptop instead: `npx wrangler login`, `npx wrangler secret put
SUPABASE_SERVICE_ROLE_KEY`, `npm run deploy`. To run the Worker locally, put the three
`SUPABASE_*` values in `.dev.vars` and run `npm run dev:worker`.

### 4 · DNS

`berkutai.com` is a Cloudflare zone, so the custom domains in step 3 create the DNS
records and TLS certificates themselves.

### 5 · Verify

- `https://berkutai.com` → home screen renders.
- `https://berkutai.com/api/health` → `{ "status": "ok", ... }`
- `https://berkutai.com/auth/register` → register a real account → confirm
  the verification email arrives → land on the home screen.
- Click **Continue with Google** → should redirect through Google → back to
  the home screen with your Google avatar in the profile menu.

---

## Dependency updates

Cloudflare patches the Workers runtime and Supabase patches Postgres/Auth; the npm
packages are ours to keep current. That runs on its own:

- **Dependabot** ([`.github/dependabot.yml`](.github/dependabot.yml)) opens one
  grouped PR of patch and minor bumps every Monday, and a PR as soon as a
  security advisory lands.
- **Auto-merge** (the `dependabot-auto-merge` job in
  [`ci.yml`](.github/workflows/ci.yml)) squash-merges those patch and minor PRs
  once typecheck, tests and build pass. Cloudflare deploys, and the scheduled
  smoke test checks the live site every 6 hours.
- **Major versions** are left out of Dependabot's weekly run (they usually need
  code changes). A weekly Claude session runs `npm audit`, does the upgrade,
  fixes what breaks and opens a PR for review.

One-time GitHub settings this needs (**Settings** on the repo):

1. **Code security → Dependabot alerts** and **Dependabot security updates**: on.
2. **Branches → Add rule for `main` → Require status checks to pass** →
   select `build-and-test`. Recommended, so nothing (Dependabot or a person)
   merges on red.

---

## Architecture notes (vs spec §8)

| Spec §8 | This implementation |
|---|---|
| Fastify monolith on Railway/Fly | **Cloudflare Worker** (`/api/*`). Same REST shape, JWT-verified, RLS-protected. Easier to operate at MVP scale. |
| Prisma ORM | **Direct `@supabase/supabase-js` calls** with RLS as the authorisation boundary. Reintroduce Prisma in Phase 2 when query complexity warrants it. |
| Modular monolith → service extraction | All API endpoints live under `/api`; refactor into per-service folders when one of them gets hot. |
| Object storage for audio | **Web Speech TTS** for MVP (free, instant). Swap to pre-recorded MP3s in Supabase Storage at `/audio/{unit}/{lesson}/{word_id}.mp3` when budget allows. |
| Redis cache (Phase 2) | Cloudflare edge cache (`s-maxage`, via the Worker's Cache API) on the leaderboard endpoint. Add Upstash Redis when traffic warrants. |
| Mobile (Expo) | Not built — frontend is web-only for v1.1. The `core/` package is dependency-free and ready to be extracted into `packages/core` for an Expo app later. |

## Going to v1.2 / Phase 2

Things to add when you cross 1k users:

- Upstash Redis for rate-limit counters, idempotency keys, leaderboard
  cache.
- Resend or Postmark for transactional email (currently Supabase's free SMTP).
- Sentry for browser + serverless error tracking.
- A weekly cron (Worker Cron Trigger) to call `select reset_weekly_xp()` on
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
