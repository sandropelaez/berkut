# 🦅 Berkut — Learn Kazakh

A gamified language-learning app that teaches Kazakh to English speakers through bite-sized lessons, speech practice, and cultural immersion. Built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **Zustand**.

## Features

- **3 fully-seeded units** (12 lessons, 120+ exercises) covering Greetings, Family, and Food & Drink
- **5 exercise types**: Multiple Choice, Translate EN↔KK, Fill in the Blank, Match Pairs
- **Dual-script engine**: Real-time Cyrillic ↔ Latin transliteration using the official 2021 Kazakh alphabet
- **Gamification**: XP scoring, streak tracking, gems currency, leaderboards, 7 achievement badges
- **Spaced Repetition System (SRS)**: SM-2 algorithm for vocabulary review
- **Cultural immersion**: Cultural notes for each unit covering Kazakh traditions
- **Persistent state**: Progress saved to localStorage via Zustand
- **Mobile-first responsive design** with bottom tab navigation

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State | Zustand (with localStorage persistence) |
| Fonts | Noto Sans + Outfit (Google Fonts) |

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Install & Run

```bash
# Clone the repository
git clone <your-repo-url>
cd berkut-nextjs

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Deploy to Vercel

### Option 1: Git-based Deploy (Recommended)

1. Push this project to a GitHub / GitLab / Bitbucket repository
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Vercel auto-detects Next.js — no configuration needed
5. Click **Deploy**

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Environment Variables

No environment variables are required for the MVP. The app runs entirely client-side with localStorage persistence.

For future backend integration (auth, database), you would add:

```
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

## Project Structure

```
berkut-nextjs/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout (fonts, metadata)
│   │   ├── globals.css         # Tailwind + custom styles
│   │   ├── page.tsx            # Home / Skill Tree
│   │   ├── welcome/page.tsx    # Onboarding
│   │   ├── lesson/[id]/page.tsx # Lesson player (exercises)
│   │   ├── practice/page.tsx   # SRS review queue
│   │   ├── leaderboard/page.tsx
│   │   ├── profile/page.tsx    # Stats & badges
│   │   ├── settings/page.tsx   # Script toggle & account
│   │   ├── shop/page.tsx       # Gem store
│   │   └── cultural/[id]/page.tsx # Cultural notes
│   ├── components/             # Shared UI components
│   │   ├── BottomTabs.tsx
│   │   ├── Confetti.tsx
│   │   ├── Icons.tsx
│   │   └── MatchPairs.tsx
│   ├── lib/                    # Core business logic
│   │   ├── store.ts            # Zustand store (persisted)
│   │   ├── transliterate.ts    # Cyrillic ↔ Latin engine
│   │   ├── srs.ts              # SM-2 spaced repetition
│   │   ├── scoring.ts          # XP, badges, leagues
│   │   └── types.ts            # TypeScript interfaces
│   └── data/
│       └── units.ts            # Seed data (3 units, 120+ exercises)
├── public/                     # Static assets
├── tailwind.config.ts
├── next.config.js
├── tsconfig.json
└── package.json
```

## Roadmap

### Post-MVP (v1.1)
- [ ] Speaking / pronunciation exercises (Web Speech API)
- [ ] Backend API with PostgreSQL + Prisma
- [ ] User authentication (Supabase Auth)
- [ ] Push notifications
- [ ] Dark mode

### v2.0
- [ ] React Native mobile app via Expo
- [ ] Offline mode
- [ ] AI conversation practice
- [ ] Google Cloud TTS for audio
- [ ] Community content

## License

MIT
