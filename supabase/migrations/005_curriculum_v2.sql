-- Berkut v1.4 — Kazakh curriculum v2 (40-unit Duolingo-style structure).
-- Idempotent. Re-runs upsert without duplication.
--
-- - Units 1-3 keep their existing IDs and lesson content; titles tightened.
-- - Units 4-10 from v1.3 are REPLACED with the new A1.2/A2.1 themes.
-- - Units 11-40 are inserted as draft (status='draft') so they don't yet
--   appear on the learner skill tree. Promote to status='active' as their
--   lessons + exercises are filled in.
--
-- Authoring methodology in docs/curriculum.md.

-- ─── A1.1 (units 1-6) ────────────────────────────────────────────────────
insert into public.units
  (id, language_code, "order", title_native, title_en, cefr_level, emoji, description, status)
values
  ('u1',  'kk',  1, 'Сәлем!',                'Greetings',                'A1', '👋', 'Hello, basic phrases, first words.', 'active'),
  ('u2',  'kk',  2, 'Әліпби',                'Alphabet & Phonetics',     'A1', '🔤', 'Cyrillic + Latin script, vowel harmony, first words.', 'active'),
  ('u3',  'kk',  3, 'Сандар, күндер, уақыт', 'Numbers & Time',           'A1', '🕐', 'Counting 1-100, days of the week, clock time.', 'active'),
  ('u4',  'kk',  4, 'Менің отбасым',         'My Family',                'A1', '👨‍👩‍👧', 'Family members, possessive suffixes.', 'active'),
  ('u5',  'kk',  5, 'Мен жақсымын',          'I am, you are',            'A1', '🪞', 'Copula -мын/-сың/-сыз, simple predicates.', 'active'),
  ('u6',  'kk',  6, 'Не? Қашан? Қайда?',     'Asking Questions',         'A1', '❓', 'Interrogatives, question particle ма/ме.', 'active')
on conflict (id) do update set
  language_code=excluded.language_code, "order"=excluded."order",
  title_native=excluded.title_native, title_en=excluded.title_en,
  cefr_level=excluded.cefr_level, emoji=excluded.emoji,
  description=excluded.description, status=excluded.status;

-- ─── A1.2 (units 7-12) ───────────────────────────────────────────────────
insert into public.units
  (id, language_code, "order", title_native, title_en, cefr_level, emoji, description, status)
values
  ('u7',  'kk',  7, 'Тағам мен сусын',  'Food & Drink',                'A1', '🍲', 'Common foods, ordering, accusative case.', 'draft'),
  ('u8',  'kk',  8, 'Беріңізші',        'Giving and asking',           'A1', '🙏', 'Dative case, imperatives, polite requests.', 'draft'),
  ('u9',  'kk',  9, 'Менің үйім',       'My Home',                     'A1', '🏠', 'Rooms, household items, locative case.', 'draft'),
  ('u10', 'kk', 10, 'Күнделікті өмір',  'Daily Routine',               'A1', '☀️', 'Present-tense actions, time of day.', 'draft'),
  ('u11', 'kk', 11, 'Жерден, қаладан',  'From, to, with',              'A1', '🚪', 'Ablative case, instrumental case.', 'draft'),
  ('u12', 'kk', 12, 'Дастархан',        'Hospitality',                 'A1', '🍞', 'Cultural: the Kazakh table, honorific сіз.', 'draft')
on conflict (id) do update set
  language_code=excluded.language_code, "order"=excluded."order",
  title_native=excluded.title_native, title_en=excluded.title_en,
  cefr_level=excluded.cefr_level, emoji=excluded.emoji,
  description=excluded.description, status=excluded.status;

-- ─── A2.1 (units 13-18) ──────────────────────────────────────────────────
insert into public.units
  (id, language_code, "order", title_native, title_en, cefr_level, emoji, description, status)
values
  ('u13', 'kk', 13, 'Көпшілік пен меншік',  'Plurals & Possession',     'A2', '🧮', 'Plurals, genitive case, possession chains.', 'draft'),
  ('u14', 'kk', 14, 'Қала мен көлік',       'City & Transport',         'A2', '🚌', 'Directions, transport, comparatives.', 'draft'),
  ('u15', 'kk', 15, 'Нарық',                 'Shopping & Money',         'A2', '🛒', 'Prices, currency, bargaining phrases.', 'draft'),
  ('u16', 'kk', 16, 'Кеше',                  'Past Tense',               'A2', '🕰️', 'Definite past -ды/-ді.', 'draft'),
  ('u17', 'kk', 17, 'Ауа райы',             'Weather & Seasons',        'A2', '⛅', 'Weather expressions, seasons, conditionals (intro).', 'draft'),
  ('u18', 'kk', 18, 'Денсаулық',            'Body & Health',            'A2', '🩺', 'Body parts, symptoms, doctor visits.', 'draft')
on conflict (id) do update set
  language_code=excluded.language_code, "order"=excluded."order",
  title_native=excluded.title_native, title_en=excluded.title_en,
  cefr_level=excluded.cefr_level, emoji=excluded.emoji,
  description=excluded.description, status=excluded.status;

-- ─── A2.2 (units 19-24) ──────────────────────────────────────────────────
insert into public.units
  (id, language_code, "order", title_native, title_en, cefr_level, emoji, description, status)
values
  ('u19', 'kk', 19, 'Ертеңге дейін',          'Future Tense',                'A2', '🔮', 'Future -атын/-етін, -мақ/-мек, plans.', 'draft'),
  ('u20', 'kk', 20, 'Менің достарым',        'Friends & Relationships',     'A2', '🤝', 'Reflexive өз-, reciprocal, social roles.', 'draft'),
  ('u21', 'kk', 21, 'Жұмыс пен оқу',         'Work & Study',                'A2', '💼', 'Workplace vocab, modals "want/need".', 'draft'),
  ('u22', 'kk', 22, 'Көмекші етістіктер',   'Aspectual auxiliaries',       'A2', '🧱', 'otyr/tūr/jür/jat, progressive aspect.', 'draft'),
  ('u23', 'kk', 23, 'Қазақстан бойынша',     'Travel across Kazakhstan',    'A2', '🏔️', 'Geography, regions, directions.', 'draft'),
  ('u24', 'kk', 24, 'Наурыз',                 'Spring & National Holidays', 'A2', '🌷', 'Cultural: Nauryz, holiday phrases.', 'draft')
on conflict (id) do update set
  language_code=excluded.language_code, "order"=excluded."order",
  title_native=excluded.title_native, title_en=excluded.title_en,
  cefr_level=excluded.cefr_level, emoji=excluded.emoji,
  description=excluded.description, status=excluded.status;

-- ─── B1.1 (units 25-30) ──────────────────────────────────────────────────
insert into public.units
  (id, language_code, "order", title_native, title_en, cefr_level, emoji, description, status)
values
  ('u25', 'kk', 25, 'Әңгімелесейік',     'Conversations',           'B1', '💬', 'Continuous tenses, conversational fillers.', 'draft'),
  ('u26', 'kk', 26, 'Егер...',           'Conditionals',            'B1', '🌿', 'Conditional -са/-се + main clause.', 'draft'),
  ('u27', 'kk', 27, 'Мерекелер',         'Holidays & Traditions',   'B1', '🎉', 'Honorific register, set phrases.', 'draft'),
  ('u28', 'kk', 28, 'Ертегі',             'Stories & Fairy tales',   'B1', '📖', 'Narrative past, reported speech (intro).', 'draft'),
  ('u29', 'kk', 29, 'Музыка мен өнер',  'Music & Arts',            'B1', '🎵', 'Domain vocab, adjective intensification.', 'draft'),
  ('u30', 'kk', 30, 'Дала тарихы',       'Steppe History',          'B1', '🐎', 'Cultural: nomadic history, formal register.', 'draft')
on conflict (id) do update set
  language_code=excluded.language_code, "order"=excluded."order",
  title_native=excluded.title_native, title_en=excluded.title_en,
  cefr_level=excluded.cefr_level, emoji=excluded.emoji,
  description=excluded.description, status=excluded.status;

-- ─── B1.2 (units 31-35) ──────────────────────────────────────────────────
insert into public.units
  (id, language_code, "order", title_native, title_en, cefr_level, emoji, description, status)
values
  ('u31', 'kk', 31, 'Қалап отырмын',  'Modals',                'B1', '🎯', 'Modals: -уға тура келу, -уға болады, мүмкін.', 'draft'),
  ('u32', 'kk', 32, 'Жаңалықтар',     'News & Current Events', 'B1', '📰', 'Passive voice, news register.', 'draft'),
  ('u33', 'kk', 33, 'Технология',     'Technology',            'B1', '💻', 'Loanword morphology, neologisms.', 'draft'),
  ('u34', 'kk', 34, 'Айтты деп',      'Reported Speech',       'B1', '🗣️', 'Indirect speech -ған/-ген + деді.', 'draft'),
  ('u35', 'kk', 35, 'Абай',            'Kazakh Literature',     'B1', '📜', 'Cultural: Abai, qara sözder.', 'draft')
on conflict (id) do update set
  language_code=excluded.language_code, "order"=excluded."order",
  title_native=excluded.title_native, title_en=excluded.title_en,
  cefr_level=excluded.cefr_level, emoji=excluded.emoji,
  description=excluded.description, status=excluded.status;

-- ─── B2 (units 36-40) ────────────────────────────────────────────────────
insert into public.units
  (id, language_code, "order", title_native, title_en, cefr_level, emoji, description, status)
values
  ('u36', 'kk', 36, 'Армандар',           'Wishes & Subjunctive',     'B2', '✨', 'Wish constructions, hypothetical clauses.', 'draft'),
  ('u37', 'kk', 37, 'Қоғам мен саясат',  'Society & Politics',       'B2', '🏛️', 'Abstract nouns, debate register.', 'draft'),
  ('u38', 'kk', 38, 'Талдау',              'Analysis & Debate',        'B2', '⚖️', 'Connectives, complex subordination.', 'draft'),
  ('u39', 'kk', 39, 'Сөз тіркестері',    'Idioms & Colloquialisms',  'B2', '🪶', 'Set phrases, proverbs.', 'draft'),
  ('u40', 'kk', 40, 'Қазіргі Қазақстан', 'Modern Kazakhstan',        'B2', '🌐', 'Cultural: contemporary register.', 'draft')
on conflict (id) do update set
  language_code=excluded.language_code, "order"=excluded."order",
  title_native=excluded.title_native, title_en=excluded.title_en,
  cefr_level=excluded.cefr_level, emoji=excluded.emoji,
  description=excluded.description, status=excluded.status;
