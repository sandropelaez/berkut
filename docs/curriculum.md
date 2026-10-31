# Berkut Kazakh Course — Curriculum Design (v2)

A Duolingo-style progression from absolute beginner (A1.1) to upper-intermediate
(B2). 40 units organised into 7 sections that mirror CEFR sub-levels.

## Design principles

1. **Explain, then practise (A1.1).** Complete beginners get a short,
   ungraded **teach card** (`TEACH` exercise) before each new rule: the
   rule in one or two sentences, a table, and tappable examples. The
   graded exercises that follow drill exactly that rule. From A1.2 on,
   grammar is mostly introduced through 4–6 exercises showing the pattern
   in context before it's named.
2. **One new thing per lesson.** Each lesson introduces at most ~5 new vocab
   items OR one new grammar pattern — never both at once. The other 10
   exercises are spaced-review of earlier material.
3. **Spiral review.** Vocab from unit N reappears at decreasing density
   through units N+1…N+5. The SRS handles long-term review; the curriculum
   handles short-term reinforcement so new learners don't drown.
4. **Production early.** Every unit has at least 2 production (EN→KK)
   lessons. Receptive skills compound faster than productive, so we force
   learners to produce earlier than they feel ready. (Listening exercises
   were retired in v1.7: browser TTS reads Kazakh too poorly. They come back
   only with recorded audio.)
5. **Cultural anchoring.** Every unit ends with a Cultural Card that ties the
   theme to a real Kazakh tradition, place, or text. Not graded; ungated.
6. **Dual-script throughout.** Cyrillic is canonical; the Latin transliteration
   engine renders every Kazakh string in the learner's chosen script.

## Lesson types within a unit

| # | Type | Exercise mix | Purpose |
|---|---|---|---|
| 1 | **Intro** | 60% MultipleChoice + Listening | Recognition of new vocab |
| 2 | **Recognition** | 50% TranslateKK→EN + 30% FillBlank + 20% MatchPairs | Active recall |
| 3 | **Production** | 70% TranslateEN→KK + 30% FillBlank | Generation under cognitive load |
| 4 | **Listening focus** | 60% Listening + 40% MatchPairs | Audio comprehension |
| 5 | **Mastery** | balanced mix, longer sentences | Integration |
| C | **Cultural Card** (ungated) | reading + 2-3 vocab | Context, motivation |
| T | **Teach card** (`TEACH`, ungraded) | title, short explanation, table, tappable examples, tip | Introduce a rule before drilling it |

Formats added in v1.8, usable in any lesson type: **ChooseReply** (pick the
Kazakh reply to a line of dialogue), **SpotMistake** (right or wrong: does
this Kazakh mean that English?) and **TypeAnswer** (type a short Kazakh
answer, either script). Sessions also generate the last two from a lesson's
own questions for its repeats and review.

Every lesson is 10-15 exercises ≈ 3-5 minutes. Streaks unchanged.

## Course map (40 units)

### Section 1 — A1.1 Absolute Beginner (7 units, 36 lessons)

Rebuilt (v1.6) for complete beginners from the beginner tutoring notes
(alphabet handout, harmony rule, personal/possessive-ending algorithms,
plural rules, present tense, small-talk dialogues and homework). The unit
order follows the order those notes teach in: each unit builds only on the
rules before it.

The alphabet is not a step on the path. **Әліпби — The Alphabet** (`u0`,
`track = 'alphabet'`; Kazakh vowels Ә І Ө Ү Ұ, consonants Қ Ғ Ң Һ, and a
review) is its own section below the path on the home screen, under
"Қатар оқу": learners work through it alongside the units, and nothing on
the path is locked behind it.

| Unit | Theme | Vocab | Grammar focus |
|---|---|---|---|
| 1 | Сәлем! — Greetings & Small Talk | 27 | сіз vs сен, қайырлы таң/күн/кеш, introductions, қалайсыз?, goodbyes |
| 2 | Үндестік — The Harmony Rule | 9 | Soft vs strong vowels, consonant groups, final stress |
| 3 | Мен кіммін? — I am | 25 | Pronouns, -мын/-бын/-пын (all persons), negation with емес |
| 4 | Көпше түр — Plurals | 24 | -лар/-дар/-тар; no plural after numbers / көп; олар + plural |
| 5 | Менің отбасым — My Family | 25 | Possessives -м/-ым/-ім…, қ→ғ к→г п→б, бар / жоқ (to have), емес vs жоқ |
| 6 | Сандар, уақыт, орын — Numbers, Time & Place | 33 | 1–100, age (жаста), locative -да/-та, сағат …-да, weekdays |
| 7 | Не істейсің? — Everyday Verbs | 37 | Present/future -а/-е/-й + endings, SOV, negative -ма/-ба/-па, questions ма/ба, маған … ұнайды / керек (like, need), да/де "too" |

The previous A1.1 lessons in units 1–7 (including the old Food & Drink
lessons in unit 7) are archived by `013_beginner_revamp.sql`.

### Section 2 — A1.2 Beginner (5 units, ~25 lessons)

| Unit | Theme | Vocab budget | Grammar focus |
|---|---|---|---|
| 8 | Маған кітап беріңіз — Giving / asking for things | 30 | Dative case -ға/-ге, imperatives |
| 9 | Менің үйім — My Home | 35 | Locative -да/-де, "there is" бар/жоқ |
| 10 | Күнделікті өмір — Daily Routine | 40 | Present tense -ады/-еді, action verbs |
| 11 | Жерден, қаладан — From, to, with | 30 | Ablative -дан/-ден, instrumental -мен |
| 12 | Дастархан — Hospitality (cultural) | 25 | Honorific 2nd person сіз; review cases |

### Section 3 — A2.1 Elementary (6 units, ~30 lessons)

| Unit | Theme | Vocab budget | Grammar focus |
|---|---|---|---|
| 13 | Көпшілік пен меншік — Plurals & Possession | 35 | Plural -лар/-лер/-тар/-тер, genitive |
| 14 | Қала мен көлік — City & Transport | 45 | Plural locatives, comparative -рақ/-рек |
| 15 | Нарық — Shopping & Money | 45 | Cardinal numbers >100, prices, бағасы |
| 16 | Кеше — Past Tense | 40 | Definite past -ды/-ді/-ты/-ті |
| 17 | Ауа райы — Weather & Seasons | 35 | Impersonal sentences, conditionals (intro) |
| 18 | Денсаулық — Body & Health | 45 | Body parts + possessives, "to have" pain |

### Section 4 — A2.2 Pre-Intermediate (6 units, ~30 lessons)

| Unit | Theme | Vocab budget | Grammar focus |
|---|---|---|---|
| 19 | Ертеңге дейін — Future tense | 40 | Future -атын/-етін, -мақ/-мек |
| 20 | Менің доғам — Friends & Relationships | 40 | Pronouns (reflexive өз-), reciprocal |
| 21 | Жұмыс пен оқу — Work & Study | 45 | Modal "want" (-ғы/-гі келеді), "must" керек |
| 22 | Көмекші етістіктер — Aspectual auxiliaries | 40 | otyr / tūr / jür / jat |
| 23 | Қазақстан бойынша саяхат — Travel | 45 | Geography, directions, postpositions |
| 24 | Наурыз — Spring & national holidays (cultural) | 30 | Festive language register |

### Section 5 — B1.1 Intermediate (6 units, ~30 lessons)

| Unit | Theme | Vocab budget | Grammar focus |
|---|---|---|---|
| 25 | Әңгімелесейік — Conversations | 50 | Continuous tenses, fillers |
| 26 | Егер … — Conditionals | 40 | Conditional -са/-се + main clause |
| 27 | Мерекелер — Holidays & Traditions | 50 | Honorific register, set phrases |
| 28 | Ертегі — Stories & Fairy tales | 60 | Narrative past, reported speech (intro) |
| 29 | Музыка мен өнер — Music & Arts | 50 | Domain vocab, adjective intensification |
| 30 | Дала тарихы — Steppe history (cultural) | 40 | Historical / formal register |

### Section 6 — B1.2 Mid-Intermediate (5 units, ~25 lessons)

| Unit | Theme | Vocab budget | Grammar focus |
|---|---|---|---|
| 31 | Қалап отырмын — Modals | 45 | -уға тура келу, -уға болады, мүмкін |
| 32 | Жаңалықтар — News & Current events | 60 | Passive voice -ыл/-іл, news register |
| 33 | Технология — Technology | 55 | Loanword morphology, neologisms |
| 34 | Айтты деп — Reported speech | 50 | Indirect speech -ған/-ген + деді |
| 35 | Абай — Kazakh literature (cultural) | 50 | Literary register; Abai's қара сөздер |

### Section 7 — B2 Upper-Intermediate (5 units, ~25 lessons)

| Unit | Theme | Vocab budget | Grammar focus |
|---|---|---|---|
| 36 | Армандар — Wishes & subjunctive | 50 | -са еді, -ғым/-гім келеді variants |
| 37 | Қоғам мен саясат — Society & politics | 70 | Abstract nouns, debate register |
| 38 | Талдау — Analysis & debate | 60 | Connectives, complex subordination |
| 39 | Сөз тіркестері — Idioms & Colloquialisms | 50 | Set phrases, proverbs |
| 40 | Қазіргі Қазақстан — Modern Kazakhstan (cultural) | 50 | Contemporary register |

Total vocab budget: ~1750 words. Total exercises (estimated): ~3000.

## Methodology — how exercises are authored

Anchored to the Tatoeba Kazakh corpus + the top-2000 frequency list. Three
sources of sentences, in priority order (A1.1 is the exception: it is built
almost entirely from native-teacher material — the beginner tutoring notes —
and the sentences in its exercises come from those notes' examples,
dialogues and corrected homework):

1. **Tatoeba native-vetted sentences** (~4500 available, CC-BY). Adapted for
   exercise format; minimal editing. Highest confidence.
2. **Frequency-list-driven compositions.** When Tatoeba doesn't cover a
   grammar pattern, I write a short sentence using only top-1500 vocab and a
   single new grammar element. Cross-checked against the Wikipedia grammar
   reference.
3. **Cultural / fixed expressions** taken from documented sources (Wikipedia,
   official government Kazakh-language materials).

Every exercise generated by Berkut staff (= me) gets a `confidence` flag in
the DB:

- **`high`** — sentence is verbatim or near-verbatim from Tatoeba, or fits
  patterns explicitly documented in the grammar reference. Default.
- **`medium`** — sentence is composed but uses only high-frequency vocab and
  documented patterns. Surface for spot-check.
- **`low`** — sentence requires native-speaker judgment on register, idiom,
  or word choice. Auto-flagged `needs_review=true`.

A `confidence='low'` exercise is held in `status='draft'` until reviewed.
The "Report a mistake" button compounds quality over time: any exercise
that accumulates ≥2 user reports is auto-flagged `needs_review`.

## Phased delivery

The course ships incrementally. Each section is its own deliverable.

| Section | Status | Deliverable |
|---|---|---|
| A1.1 (units 1-7) | ✅ Revamped (v1.6) | 36 lessons with teach cards; source in `src/content/beginner/` |
| A1.2 (units 7-12) | ⏳ Planned | Full lessons + exercises |
| A2.1 (units 13-18) | ⏳ Planned | Full lessons + exercises |
| A2.2 (units 19-24) | ⏳ Planned | Full lessons + exercises |
| B1.1 (units 25-30) | ⏳ Planned | Lesson outlines + sample lessons; full content with translator |
| B1.2 (units 31-35) | ⏳ Planned | Outlines + sample lessons |
| B2 (units 36-40) | ⏳ Planned | Theme + vocab + cultural notes; full content with native review |

## Authoring the A1.1 course

The beginner course is TypeScript, not hand-written SQL:

- `src/content/beginner/units*.ts` — units, vocab, lessons and exercises,
  written with the helpers in `src/content/builders.ts` (`teach`, `kk`, `en`,
  `fill`, `match`, …).
- Ending drills (`amDrill`, `pluralDrill`, `possDrill`, `locDrill`,
  `verbDrill`, `negDrill`, `qDrill`) compute the right answer — and
  plausible wrong ones — from `src/core/harmony.ts`, which encodes the
  harmony rules taught in the course and is tested against the tutor's
  worked examples (`harmony.test.ts`).
- `npm run content:build` regenerates
  `supabase/migrations/013_beginner_revamp.sql`. `npm test` validates every
  exercise (answer in options, tiles complete, no options that collide in
  Latin script, balanced `**bold**`) and fails if the migration is stale.
