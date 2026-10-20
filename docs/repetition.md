# Repeat: practise the exercises you got wrong

## Problem

When a learner gets an exercise wrong, the lesson moves on and the mistake is
forgotten. The existing **Practice** tab only reviews vocabulary on an SRS
schedule; it never brings back the sentence, the suffix, or the word order the
learner actually got wrong.

## Goal

Every graded exercise a learner gets wrong goes onto a personal list. A new
**Repeat** menu serves random exercises from that list. An exercise leaves the
list once the learner gets it right 3 times in a row.

## Non-goals

- No change to the vocabulary SRS or the Practice tab.
- No scheduling (spacing) of repeats. Any listed exercise can come up at any time.
- No admin view of a learner's mistake list (it is visible in the raw
  `user_progress` row on the admin user page, like SRS).

## Behaviour

### What gets listed

| Event | Effect on the list |
|---|---|
| First attempt at a graded exercise is wrong, anywhere (lesson or Repeat) | Exercise is added. If already listed, its correct streak resets to 0. If it was cleared earlier, it is listed again. |
| First attempt is right and the exercise is listed | Correct streak +1. At 3 the exercise is cleared from the list. |
| First attempt is right and the exercise is not listed | Nothing. |
| "Try again" attempt (second attempt after a miss) | Ignored. The miss already counted; a correct retry is not a correct answer. |
| Teach cards | Ungraded, never listed. |

"3 times" means 3 correct first attempts in a row with no miss in between. A
miss sends the count back to 0, so a lucky guess between misses doesn't clear
an exercise. Correct answers in a normal lesson count too: redoing a lesson is
as good a repetition as the Repeat menu.

### The Repeat menu

- New tab **Repeat** in the bottom bar (phone) and sidebar (desktop), between
  Practice and Profile, at `/repeat`.
- Opening it starts a session straight away: up to **10** exercises picked at
  random (uniform shuffle) from the listed ones. The list is frozen for the
  session; answers update the list as they happen.
- The session plays exactly like a lesson: same exercise components, same
  check/feedback footer, one "Try again" after a miss, quit button top left.
- Each exercise in the session shows a small "Correct 1 of 3" counter so the
  learner knows how close it is to leaving the list.
- End screen: how many were right, how many were cleared, how many remain.
  Buttons: **Repeat more** (only if the list isn't empty) and **Back home**.
  Finishing a session counts as activity for the streak, like Practice.
- Empty list: an empty state ("Nothing to repeat. Exercises you get wrong in
  lessons will show up here.") with a button back to lessons.
- Exercises that no longer exist or were archived in the content admin are
  dropped from the list when a session finds them missing.

## Data model

Mistakes live in the persisted Zustand store next to `progress` and `srs`,
keyed by exercise id:

```ts
interface MistakeItem {
  exerciseId: string;
  lessonId: string;     // for context; content is loaded by exercise id
  correctStreak: number; // correct first attempts since the last miss (0–3)
  wrongCount: number;    // lifetime misses, for future "hardest exercises" views
  updatedAt: number;     // ms epoch of the last change; drives sync merges
  clearedAt?: number;    // set when correctStreak reaches 3
}
```

A cleared exercise is kept with `clearedAt` set instead of being deleted. That
tombstone is what stops a second device, or the server's older copy, from
putting it back on the list during a sync merge. A new miss clears
`clearedAt`. The map is bounded by the number of exercises in the course.

The pure logic (record an attempt, list active items, pick a random session)
lives in `src/core/mistakes.ts` with unit tests.

## Sync

Mistakes are part of the progress snapshot, so they survive logout and follow
the learner across devices like lessons and SRS do.

- `ProgressSnapshot` gains `mistakes: Record<string, MistakeItem>`.
- `sanitizeSnapshot` validates entries (ids are strings, counts are
  non-negative integers, `updatedAt` is finite) and drops malformed ones.
- `mergeSnapshots` keeps, per exercise, the entry with the later `updatedAt`
  (ties go to the incoming side, as for SRS). Tombstones merge the same way.
- Storage: new column `user_progress.mistakes jsonb not null default '{}'`,
  migration `016_mistakes.sql`. Additive; run it before deploying the code.
- The client sync uploads on mistake changes like it does for other progress.

## API

`GET /api/content?action=exercises&ids=a,b,c` returns
`{ exercises: [{ id, lesson_id, type, prompt }] }` for the active, non-Listening
exercises among the ids (max 50). One request per session instead of one per
lesson. Same caching headers as `action=lesson`.

## Code changes

| Area | Change |
|---|---|
| `src/core/mistakes.ts` (+test) | `recordAttempt`, `activeMistakes`, `pickSession`, `CLEAR_AFTER = 3` |
| `api/_lib/progressMerge.ts` (+test) | `mistakes` in snapshot, sanitize, merge |
| `api/progress.ts` (+test) | read/write `user_progress.mistakes` |
| `supabase/migrations/016_mistakes.sql` | add the column |
| `src/store/useStore.ts` | `mistakes` state, `recordExerciseResult`, `dropMistakes`, reset |
| `src/core/progressSync.ts` (+test) | include mistakes in snapshot, change detection and apply |
| `api/content.ts`, `src/store/useContentStore.ts` | `action=exercises` + `loadExercises(ids)` |
| `src/components/ExerciseSession.tsx` | exercise player extracted from `LessonPlayer` so lessons and Repeat share it |
| `src/pages/LessonPlayer.tsx` | uses `ExerciseSession`, records results |
| `src/pages/Repeat.tsx` | the Repeat menu: session, end screen, empty state |
| `src/components/Layout.tsx`, `src/App.tsx` | the tab and route |

## Rollout

1. Run `supabase/migrations/016_mistakes.sql`.
2. Deploy. Existing learners start with an empty list; it fills as they make
   mistakes from then on (past mistakes were never recorded).

## Acceptance criteria

1. Getting a lesson exercise wrong on the first attempt adds it to Repeat.
2. Opening Repeat with listed exercises shows up to 10 of them in random order.
3. Getting a listed exercise right 3 times in a row removes it; a miss in
   between resets the count.
4. A correct "Try again" attempt does not count toward the 3.
5. The list survives logout/login and appears on a second device.
6. Clearing an exercise on one device doesn't bring it back after syncing
   with another device that still had it listed.
7. Empty list shows the empty state.
