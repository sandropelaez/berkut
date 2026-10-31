# Weekly lesson sync from the tutoring folder

Every Wednesday morning (07:43 Singapore time) a scheduled Claude session
checks Zhazira's shared Google Drive folder **"Sandro"** for new or edited
lesson documents and updates the Berkut course to match. This file is that
session's runbook; `docs/lesson-sources.json` is its state.

- Folder: <https://drive.google.com/drive/folders/155stAXsj-LBu7cSnh0IJJerzC74R9_A4>
- State: `docs/lesson-sources.json` — `lastSyncedAt` plus the files seen last run.
- Snapshots: `docs/lesson-sources/<fileId>.md` — the text of each doc as of
  the last sync, so `git diff` shows exactly what the tutor changed.

## Steps for each run

1. **Find changes.** List the folder (Google Drive `search_files` with
   `parentId = '<folder id>'`, all pages). A file has changed if its
   `modifiedTime` is after `lastSyncedAt`, or it isn't in `files` yet. A file
   in `files` but no longer in the folder was removed: note it, but don't
   delete course content because of it.
2. **Nothing changed?** Stop. Don't open a PR. Post a one-line "no changes"
   summary.
3. **Read each changed file** with `read_file_content` (Docs and PDFs both
   work). Compare it with its snapshot in `docs/lesson-sources/` when one
   exists; otherwise compare it with what `src/content/beginner/` already
   teaches. Write the new text to the snapshot file.
4. **Decide what the change means for the course.** Typical cases:
   - Corrections to rules or examples already taught → fix those exercises,
     teach cards and, if a suffix rule changed, `src/core/harmony.ts` and its
     tests.
   - New vocabulary → add it to the unit whose topic it fits.
   - New grammar topic or homework set → extend the matching unit's lessons,
     or add lessons to the unit whose grammar focus it is (see
     `docs/curriculum.md`). Only build new units past unit 7 when the topic
     clearly belongs to A1.2+.
   - Practice sentences and corrected homework → use them as exercise
     sentences (the tutor's corrected version, never the uncorrected one).
   - Personal notes, scheduling, or anything not teaching Kazakh → ignore.
   Keep lesson and exercise ids stable for content that already exists, so
   learners' progress keeps pointing at the same rows.

   **A lesson asks at most 10 questions** (teach cards and Listening don't
   count; `validateUnits` fails CI past 10 and under 5). The app fills each
   session up to 10 with echoes of the lesson's own questions, so 5–8 authored
   questions is the sweet spot. When new material would push a lesson past
   10, don't trim the tutor's examples: continue it in a new part right after
   it, id `<lesson>-2` (then `-3`), titled "… · part 2" / "… · 2-бөлім", opening
   with the lesson's main teach card as a recap (see `u7-b6-2`, `u7-b6-3`).
   Never re-split a lesson whose ids already exist in prod; add a part instead.

   **Vary the formats.** A lesson that is all `fill()` or all `kk()` gets
   boring fast. Give each lesson at least three formats, and use the newer
   builders (`src/content/builders.ts`) wherever the material fits:
   - `reply(lineKk, lineEn, correct, wrong)` — *choose the reply*. Turn the
     tutor's dialogues into it: one speaker's line, the next line as the
     answer, and replies that don't fit as decoys. Best for greetings and
     small talk, questions with бар/жоқ, and any homework dialogue.
   - `spot(sentenceKk, meaningEn, correction?)` — *right or wrong?* With a
     `correction` it shows a sentence with one mistake: a wrong suffix
     (оқушыпын → оқушымын), a mixed-up word (ертең / ерте), or wrong word
     order. Use the tutor's own corrections of homework: the uncorrected
     sentence is the mistake, the corrected one the fix. Without
     `correction` it's a correct sentence to confirm. Mix both.
   - `typeIt(promptEn, answer, alsoAccepted?)` — *type the Kazakh*. Only for
     words and short phrases (4 words max, CI enforces it); list other right
     answers in `alsoAccepted` (ана / мама). Either script is accepted, and
     plain look-alike letters (салем for сәлем) count with a spelling note.
   Don't use `listen()`: Listening is retired until there is recorded audio.
   The app also turns every lesson's own questions into typed answers and
   right-or-wrong checks for its repeats and review, so authored questions
   don't need to cover every format.
5. **Build and check.** `npm run content:build`, then `npm run ci`
   (typecheck, tests, build). Fix until green.
6. **Ship.** Update `docs/lesson-sources.json` (`lastSyncedAt` = the time
   this run listed the folder, refresh `files`, write a one-line
   `lastSyncNote`). Commit to a branch `lesson-sync/<YYYY-MM-DD>`, open a PR
   to `main` that lists each changed doc and what it changed in the course,
   and wait for CI. When CI is green, merge it.
7. **Apply to production.** `013_beginner_revamp.sql` is idempotent and
   archives rather than deletes, so re-apply the regenerated file to the
   `berkut-prod` Supabase project with `apply_migration`, named
   `013_resync_<YYYYMMDD>`. Then verify with a read-only query that the
   lesson and exercise counts for units 0–7 match the source. If a change
   can't be expressed by re-running 013 (e.g. ids had to move), write a
   small delta migration instead and apply that.
8. **Report** in one short message: which docs changed, what was updated,
   the PR link, and that prod was migrated.

If Google Drive can't be reached, or a step fails, don't guess: report the
exact error and what's still pending, and leave `lastSyncedAt` unchanged so
the next run picks the changes up again.
