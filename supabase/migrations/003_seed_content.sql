-- Berkut v1.3 — Seed content for Kazakh (Units 1-3).
-- Idempotent: re-running just upserts; doesn't duplicate.

insert into public.languages (code, name_en, name_native, flag_emoji, status, sort_order)
values ('kk', 'Kazakh', 'Қазақша', '🇰🇿', 'active', 1)
on conflict (code) do update set
  name_en = excluded.name_en,
  name_native = excluded.name_native,
  flag_emoji = excluded.flag_emoji,
  status = excluded.status,
  sort_order = excluded.sort_order;

-- Unit 1 — Hello!
insert into public.units (id, language_code, "order", title_native, title_en, cefr_level, emoji, description, cultural_note, status) values (
  'u1', 'kk', 1, 'Сәлем!', 'Hello!', 'A1', '👋', 'Greetings, the Kazakh alphabet, and numbers 1–10.', 'Kazakhs greet warmly, often with both hands or a hand over the heart. ''Сәлеметсіз бе'' is the formal version of ''Сәлем'' — used with elders and strangers.', 'active'
) on conflict (id) do update set
  language_code = excluded.language_code, "order" = excluded."order",
  title_native = excluded.title_native, title_en = excluded.title_en,
  cefr_level = excluded.cefr_level, emoji = excluded.emoji,
  description = excluded.description, cultural_note = excluded.cultural_note,
  status = excluded.status;

insert into public.lessons (id, unit_id, "order", title_native, title_en, status) values (
  'u1-l1', 'u1', 1, 'Сәлемдесу', 'Greetings & Introductions', 'active'
) on conflict (id) do update set
  unit_id = excluded.unit_id, "order" = excluded."order",
  title_native = excluded.title_native, title_en = excluded.title_en,
  status = excluded.status;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-salem', 'u1', 'сәлем', 'hi (informal)', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-salemetsiz', 'u1', 'сәлеметсіз бе', 'hello (formal)', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-rakhmet', 'u1', 'рақмет', 'thank you', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-iya', 'u1', 'иә', 'yes', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-zhok', 'u1', 'жоқ', 'no', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-kosh', 'u1', 'қош', 'bye', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u1-l1-e1', 'u1-l1', 1, 'MULTIPLE_CHOICE', '{"type":"MULTIPLE_CHOICE","promptKk":"сәлем","questionEn":"What does this mean?","options":["Hello","Thank you","Goodbye","Yes"],"correctAns":"Hello"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u1-l1-e2', 'u1-l1', 2, 'MULTIPLE_CHOICE', '{"type":"MULTIPLE_CHOICE","promptKk":"рақмет","questionEn":"What does this mean?","options":["Please","Sorry","Thank you","Welcome"],"correctAns":"Thank you"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u1-l1-e3', 'u1-l1', 3, 'LISTENING', '{"type":"LISTENING","audioKk":"сәлеметсіз бе","options":["сәлеметсіз бе","сәлем","рақмет","қош"],"correctAns":"сәлеметсіз бе"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u1-l1-e4', 'u1-l1', 4, 'TRANSLATE_KK_EN', '{"type":"TRANSLATE_KK_EN","promptKk":"иә","options":["yes","no","maybe","thanks"],"correctAns":"yes"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u1-l1-e5', 'u1-l1', 5, 'TRANSLATE_KK_EN', '{"type":"TRANSLATE_KK_EN","promptKk":"жоқ","options":["yes","no","now","good"],"correctAns":"no"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u1-l1-e6', 'u1-l1', 6, 'MATCH_PAIRS', '{"type":"MATCH_PAIRS","pairs":[{"kazakh":"сәлем","english":"hi"},{"kazakh":"рақмет","english":"thank you"},{"kazakh":"иә","english":"yes"},{"kazakh":"жоқ","english":"no"},{"kazakh":"қош","english":"bye"}]}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u1-l1-e7', 'u1-l1', 7, 'TRANSLATE_EN_KK', '{"type":"TRANSLATE_EN_KK","promptEn":"Hello (informal)","tiles":["сәлем","рақмет","қош","иә"],"correctAns":["сәлем"]}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u1-l1-e8', 'u1-l1', 8, 'TRANSLATE_EN_KK', '{"type":"TRANSLATE_EN_KK","promptEn":"Thank you","tiles":["қош","сәлем","рақмет","жоқ"],"correctAns":["рақмет"]}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u1-l1-e9', 'u1-l1', 9, 'FILL_BLANK', '{"type":"FILL_BLANK","sentenceKkParts":["",", қалайсыз?"],"options":["сәлем","жоқ","иә"],"correctAns":"сәлем","hintEn":"Hi, how are you?"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u1-l1-e10', 'u1-l1', 10, 'MULTIPLE_CHOICE', '{"type":"MULTIPLE_CHOICE","promptKk":"қош","questionEn":"What does this mean?","options":["Bye","Now","Why","Hi"],"correctAns":"Bye"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u1-l1-e11', 'u1-l1', 11, 'LISTENING', '{"type":"LISTENING","audioKk":"рақмет","options":["сәлем","рақмет","иә","жоқ"],"correctAns":"рақмет"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u1-l1-e12', 'u1-l1', 12, 'TRANSLATE_EN_KK', '{"type":"TRANSLATE_EN_KK","promptEn":"Goodbye","tiles":["қош","сәлем","рақмет","иә"],"correctAns":["қош"]}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.lessons (id, unit_id, "order", title_native, title_en, status) values (
  'u1-l2', 'u1', 2, 'Әліпби', 'The Alphabet', 'active'
) on conflict (id) do update set
  unit_id = excluded.unit_id, "order" = excluded."order",
  title_native = excluded.title_native, title_en = excluded.title_en,
  status = excluded.status;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-alpha-a', 'u1', 'ана', 'mother', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-alpha-bala', 'u1', 'бала', 'child', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-alpha-kitap', 'u1', 'кітап', 'book', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-alpha-koz', 'u1', 'көз', 'eye', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-alpha-uy', 'u1', 'үй', 'house', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u1-l2-e1', 'u1-l2', 1, 'MULTIPLE_CHOICE', '{"type":"MULTIPLE_CHOICE","promptKk":"ана","questionEn":"What does this mean?","options":["mother","father","child","house"],"correctAns":"mother"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u1-l2-e2', 'u1-l2', 2, 'MULTIPLE_CHOICE', '{"type":"MULTIPLE_CHOICE","promptKk":"бала","questionEn":"What does this mean?","options":["dog","child","ball","book"],"correctAns":"child"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u1-l2-e3', 'u1-l2', 3, 'LISTENING', '{"type":"LISTENING","audioKk":"кітап","options":["кітап","көз","үй","ана"],"correctAns":"кітап"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u1-l2-e4', 'u1-l2', 4, 'TRANSLATE_KK_EN', '{"type":"TRANSLATE_KK_EN","promptKk":"көз","options":["eye","ear","hand","leg"],"correctAns":"eye"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u1-l2-e5', 'u1-l2', 5, 'TRANSLATE_KK_EN', '{"type":"TRANSLATE_KK_EN","promptKk":"үй","options":["house","tree","city","road"],"correctAns":"house"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u1-l2-e6', 'u1-l2', 6, 'MATCH_PAIRS', '{"type":"MATCH_PAIRS","pairs":[{"kazakh":"ана","english":"mother"},{"kazakh":"бала","english":"child"},{"kazakh":"кітап","english":"book"},{"kazakh":"көз","english":"eye"},{"kazakh":"үй","english":"house"}]}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u1-l2-e7', 'u1-l2', 7, 'TRANSLATE_EN_KK', '{"type":"TRANSLATE_EN_KK","promptEn":"book","tiles":["кітап","ана","бала","үй"],"correctAns":["кітап"]}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u1-l2-e8', 'u1-l2', 8, 'FILL_BLANK', '{"type":"FILL_BLANK","sentenceKkParts":["Менің ","м үлкен."],"options":["үй","ана","көз"],"correctAns":"үй","hintEn":"My house is big."}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u1-l2-e9', 'u1-l2', 9, 'LISTENING', '{"type":"LISTENING","audioKk":"ана","options":["ана","бала","үй","көз"],"correctAns":"ана"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u1-l2-e10', 'u1-l2', 10, 'TRANSLATE_EN_KK', '{"type":"TRANSLATE_EN_KK","promptEn":"child","tiles":["бала","ана","көз","кітап"],"correctAns":["бала"]}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.lessons (id, unit_id, "order", title_native, title_en, status) values (
  'u1-l3', 'u1', 3, 'Сандар 1–10', 'Numbers 1–10', 'active'
) on conflict (id) do update set
  unit_id = excluded.unit_id, "order" = excluded."order",
  title_native = excluded.title_native, title_en = excluded.title_en,
  status = excluded.status;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-num-1', 'u1', 'бір', 'one', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-num-2', 'u1', 'екі', 'two', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-num-3', 'u1', 'үш', 'three', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-num-4', 'u1', 'төрт', 'four', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-num-5', 'u1', 'бес', 'five', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-num-6', 'u1', 'алты', 'six', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-num-7', 'u1', 'жеті', 'seven', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-num-8', 'u1', 'сегіз', 'eight', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-num-9', 'u1', 'тоғыз', 'nine', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-num-10', 'u1', 'он', 'ten', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u1-l3-e1', 'u1-l3', 1, 'MULTIPLE_CHOICE', '{"type":"MULTIPLE_CHOICE","promptKk":"бір","questionEn":"Which number?","options":["1","2","3","4"],"correctAns":"1"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u1-l3-e2', 'u1-l3', 2, 'MULTIPLE_CHOICE', '{"type":"MULTIPLE_CHOICE","promptKk":"бес","questionEn":"Which number?","options":["3","4","5","6"],"correctAns":"5"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u1-l3-e3', 'u1-l3', 3, 'LISTENING', '{"type":"LISTENING","audioKk":"үш","options":["екі","үш","төрт","бес"],"correctAns":"үш"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u1-l3-e4', 'u1-l3', 4, 'MATCH_PAIRS', '{"type":"MATCH_PAIRS","pairs":[{"kazakh":"бір","english":"1"},{"kazakh":"екі","english":"2"},{"kazakh":"үш","english":"3"},{"kazakh":"бес","english":"5"},{"kazakh":"он","english":"10"}]}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u1-l3-e5', 'u1-l3', 5, 'TRANSLATE_KK_EN', '{"type":"TRANSLATE_KK_EN","promptKk":"тоғыз","options":["seven","eight","nine","ten"],"correctAns":"nine"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u1-l3-e6', 'u1-l3', 6, 'TRANSLATE_EN_KK', '{"type":"TRANSLATE_EN_KK","promptEn":"ten","tiles":["он","бір","екі","үш"],"correctAns":["он"]}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u1-l3-e7', 'u1-l3', 7, 'MULTIPLE_CHOICE', '{"type":"MULTIPLE_CHOICE","promptKk":"сегіз","questionEn":"Which number?","options":["6","7","8","9"],"correctAns":"8"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u1-l3-e8', 'u1-l3', 8, 'FILL_BLANK', '{"type":"FILL_BLANK","sentenceKkParts":[""," + бір = екі"],"options":["бір","екі","үш"],"correctAns":"бір","hintEn":"1 + 1 = 2"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u1-l3-e9', 'u1-l3', 9, 'LISTENING', '{"type":"LISTENING","audioKk":"жеті","options":["жеті","алты","сегіз","тоғыз"],"correctAns":"жеті"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u1-l3-e10', 'u1-l3', 10, 'TRANSLATE_EN_KK', '{"type":"TRANSLATE_EN_KK","promptEn":"four","tiles":["төрт","бес","алты","үш"],"correctAns":["төрт"]}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.lessons (id, unit_id, "order", title_native, title_en, status) values (
  'u1-l4', 'u1', 4, 'Қалайсыз?', 'How are you?', 'active'
) on conflict (id) do update set
  unit_id = excluded.unit_id, "order" = excluded."order",
  title_native = excluded.title_native, title_en = excluded.title_en,
  status = excluded.status;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-qalay', 'u1', 'қалайсыз', 'how are you (formal)', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-jaksy', 'u1', 'жақсы', 'good', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-zhaman', 'u1', 'жаман', 'bad', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-keshirin', 'u1', 'кешіріңіз', 'excuse me / sorry', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-otinish', 'u1', 'өтініш', 'please', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u1-l4-e1', 'u1-l4', 1, 'MULTIPLE_CHOICE', '{"type":"MULTIPLE_CHOICE","promptKk":"жақсы","questionEn":"What does this mean?","options":["bad","good","okay","sad"],"correctAns":"good"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u1-l4-e2', 'u1-l4', 2, 'TRANSLATE_KK_EN', '{"type":"TRANSLATE_KK_EN","promptKk":"өтініш","options":["please","thanks","sorry","yes"],"correctAns":"please"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u1-l4-e3', 'u1-l4', 3, 'LISTENING', '{"type":"LISTENING","audioKk":"қалайсыз","options":["қалайсыз","жақсы","жаман","өтініш"],"correctAns":"қалайсыз"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u1-l4-e4', 'u1-l4', 4, 'FILL_BLANK', '{"type":"FILL_BLANK","sentenceKkParts":["Сәлем, ","?"],"options":["қалайсыз","өтініш","жаман"],"correctAns":"қалайсыз","hintEn":"Hi, how are you?"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u1-l4-e5', 'u1-l4', 5, 'MATCH_PAIRS', '{"type":"MATCH_PAIRS","pairs":[{"kazakh":"жақсы","english":"good"},{"kazakh":"жаман","english":"bad"},{"kazakh":"өтініш","english":"please"},{"kazakh":"кешіріңіз","english":"excuse me"},{"kazakh":"қалайсыз","english":"how are you"}]}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u1-l4-e6', 'u1-l4', 6, 'TRANSLATE_EN_KK', '{"type":"TRANSLATE_EN_KK","promptEn":"please","tiles":["өтініш","рақмет","иә","жоқ"],"correctAns":["өтініш"]}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u1-l4-e7', 'u1-l4', 7, 'MULTIPLE_CHOICE', '{"type":"MULTIPLE_CHOICE","promptKk":"кешіріңіз","questionEn":"What does this mean?","options":["please","excuse me","thank you","goodbye"],"correctAns":"excuse me"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u1-l4-e8', 'u1-l4', 8, 'TRANSLATE_EN_KK', '{"type":"TRANSLATE_EN_KK","promptEn":"good","tiles":["жақсы","жаман","иә","жоқ"],"correctAns":["жақсы"]}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u1-l4-e9', 'u1-l4', 9, 'LISTENING', '{"type":"LISTENING","audioKk":"жаман","options":["жаман","жақсы","өтініш","сәлем"],"correctAns":"жаман"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u1-l4-e10', 'u1-l4', 10, 'TRANSLATE_KK_EN', '{"type":"TRANSLATE_KK_EN","promptKk":"жаман","options":["bad","good","great","ok"],"correctAns":"bad"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

-- Unit 2 — My Family
insert into public.units (id, language_code, "order", title_native, title_en, cefr_level, emoji, description, cultural_note, status) values (
  'u2', 'kk', 2, 'Менің отбасым', 'My Family', 'A1', '👨‍👩‍👧', 'Family members, possessives, simple sentences.', 'Family (''отбасы'') is central in Kazakh life. Multi-generational households are common, and respect for elders is shown by using ''сіз'' (formal you) and standing up when an elder enters the room.', 'active'
) on conflict (id) do update set
  language_code = excluded.language_code, "order" = excluded."order",
  title_native = excluded.title_native, title_en = excluded.title_en,
  cefr_level = excluded.cefr_level, emoji = excluded.emoji,
  description = excluded.description, cultural_note = excluded.cultural_note,
  status = excluded.status;

insert into public.lessons (id, unit_id, "order", title_native, title_en, status) values (
  'u2-l1', 'u2', 1, 'Отбасы мүшелері', 'Family Members', 'active'
) on conflict (id) do update set
  unit_id = excluded.unit_id, "order" = excluded."order",
  title_native = excluded.title_native, title_en = excluded.title_en,
  status = excluded.status;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-ata', 'u2', 'ата', 'grandfather', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-aje', 'u2', 'әже', 'grandmother', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-ake', 'u2', 'әке', 'father', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-ana2', 'u2', 'ана', 'mother', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-bauyr', 'u2', 'бауыр', 'brother', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-apke', 'u2', 'әпке', 'older sister', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-bala2', 'u2', 'бала', 'child', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u2-l1-e1', 'u2-l1', 1, 'MULTIPLE_CHOICE', '{"type":"MULTIPLE_CHOICE","promptKk":"әке","questionEn":"What does this mean?","options":["mother","father","brother","uncle"],"correctAns":"father"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u2-l1-e2', 'u2-l1', 2, 'MULTIPLE_CHOICE', '{"type":"MULTIPLE_CHOICE","promptKk":"ата","questionEn":"What does this mean?","options":["grandfather","grandmother","uncle","father"],"correctAns":"grandfather"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u2-l1-e3', 'u2-l1', 3, 'LISTENING', '{"type":"LISTENING","audioKk":"әже","options":["ата","әже","әке","ана"],"correctAns":"әже"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u2-l1-e4', 'u2-l1', 4, 'MATCH_PAIRS', '{"type":"MATCH_PAIRS","pairs":[{"kazakh":"ата","english":"grandfather"},{"kazakh":"әже","english":"grandmother"},{"kazakh":"әке","english":"father"},{"kazakh":"ана","english":"mother"},{"kazakh":"бауыр","english":"brother"}]}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u2-l1-e5', 'u2-l1', 5, 'TRANSLATE_KK_EN', '{"type":"TRANSLATE_KK_EN","promptKk":"әпке","options":["older sister","younger sister","aunt","cousin"],"correctAns":"older sister"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u2-l1-e6', 'u2-l1', 6, 'TRANSLATE_EN_KK', '{"type":"TRANSLATE_EN_KK","promptEn":"brother","tiles":["бауыр","әпке","ана","ата"],"correctAns":["бауыр"]}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u2-l1-e7', 'u2-l1', 7, 'FILL_BLANK', '{"type":"FILL_BLANK","sentenceKkParts":["Менің ","м үлкен."],"options":["әке","әпке","бала"],"correctAns":"әпке","hintEn":"My older sister is older."}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u2-l1-e8', 'u2-l1', 8, 'TRANSLATE_EN_KK', '{"type":"TRANSLATE_EN_KK","promptEn":"mother","tiles":["ана","әже","әке","ата"],"correctAns":["ана"]}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u2-l1-e9', 'u2-l1', 9, 'LISTENING', '{"type":"LISTENING","audioKk":"бауыр","options":["бауыр","бала","ата","әпке"],"correctAns":"бауыр"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u2-l1-e10', 'u2-l1', 10, 'MULTIPLE_CHOICE', '{"type":"MULTIPLE_CHOICE","promptKk":"бала","questionEn":"What does this mean?","options":["child","boy","girl","baby"],"correctAns":"child"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.lessons (id, unit_id, "order", title_native, title_en, status) values (
  'u2-l2', 'u2', 2, 'Менің / Сенің', 'My / Your', 'active'
) on conflict (id) do update set
  unit_id = excluded.unit_id, "order" = excluded."order",
  title_native = excluded.title_native, title_en = excluded.title_en,
  status = excluded.status;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-menin', 'u2', 'менің', 'my', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-senin', 'u2', 'сенің', 'your (informal)', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-onyn', 'u2', 'оның', 'his / her', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-bizdin', 'u2', 'біздің', 'our', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-sizdin', 'u2', 'сіздің', 'your (formal)', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u2-l2-e1', 'u2-l2', 1, 'MULTIPLE_CHOICE', '{"type":"MULTIPLE_CHOICE","promptKk":"менің","questionEn":"What does this mean?","options":["my","your","his","our"],"correctAns":"my"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u2-l2-e2', 'u2-l2', 2, 'TRANSLATE_KK_EN', '{"type":"TRANSLATE_KK_EN","promptKk":"оның","options":["my","their","his/her","our"],"correctAns":"his/her"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u2-l2-e3', 'u2-l2', 3, 'FILL_BLANK', '{"type":"FILL_BLANK","sentenceKkParts":[""," анам үйде."],"options":["менің","сенің","оның"],"correctAns":"менің","hintEn":"My mother is at home."}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u2-l2-e4', 'u2-l2', 4, 'MATCH_PAIRS', '{"type":"MATCH_PAIRS","pairs":[{"kazakh":"менің","english":"my"},{"kazakh":"сенің","english":"your"},{"kazakh":"оның","english":"his/her"},{"kazakh":"біздің","english":"our"},{"kazakh":"сіздің","english":"your (formal)"}]}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u2-l2-e5', 'u2-l2', 5, 'LISTENING', '{"type":"LISTENING","audioKk":"біздің","options":["менің","сенің","біздің","оның"],"correctAns":"біздің"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u2-l2-e6', 'u2-l2', 6, 'TRANSLATE_EN_KK', '{"type":"TRANSLATE_EN_KK","promptEn":"our","tiles":["біздің","менің","сенің","оның"],"correctAns":["біздің"]}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u2-l2-e7', 'u2-l2', 7, 'FILL_BLANK', '{"type":"FILL_BLANK","sentenceKkParts":[""," үйіміз үлкен."],"options":["біздің","менің","сенің"],"correctAns":"біздің","hintEn":"Our house is big."}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u2-l2-e8', 'u2-l2', 8, 'TRANSLATE_EN_KK', '{"type":"TRANSLATE_EN_KK","promptEn":"your (formal)","tiles":["сіздің","сенің","менің","біздің"],"correctAns":["сіздің"]}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u2-l2-e9', 'u2-l2', 9, 'MULTIPLE_CHOICE', '{"type":"MULTIPLE_CHOICE","promptKk":"сенің","questionEn":"What does this mean?","options":["my","your (informal)","your (formal)","our"],"correctAns":"your (informal)"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u2-l2-e10', 'u2-l2', 10, 'LISTENING', '{"type":"LISTENING","audioKk":"оның","options":["оның","менің","сенің","сіздің"],"correctAns":"оның"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.lessons (id, unit_id, "order", title_native, title_en, status) values (
  'u2-l3', 'u2', 3, 'Жасы', 'Ages', 'active'
) on conflict (id) do update set
  unit_id = excluded.unit_id, "order" = excluded."order",
  title_native = excluded.title_native, title_en = excluded.title_en,
  status = excluded.status;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-jas', 'u2', 'жас', 'age / young', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-ulken', 'u2', 'үлкен', 'big / older', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-kishi', 'u2', 'кіші', 'small / younger', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-zhyl', 'u2', 'жыл', 'year', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u2-l3-e1', 'u2-l3', 1, 'MULTIPLE_CHOICE', '{"type":"MULTIPLE_CHOICE","promptKk":"үлкен","questionEn":"What does this mean?","options":["big","small","good","fast"],"correctAns":"big"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u2-l3-e2', 'u2-l3', 2, 'TRANSLATE_KK_EN', '{"type":"TRANSLATE_KK_EN","promptKk":"кіші","options":["younger","older","good","tall"],"correctAns":"younger"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u2-l3-e3', 'u2-l3', 3, 'LISTENING', '{"type":"LISTENING","audioKk":"жыл","options":["жыл","жас","жоқ","жақсы"],"correctAns":"жыл"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u2-l3-e4', 'u2-l3', 4, 'FILL_BLANK', '{"type":"FILL_BLANK","sentenceKkParts":["Мен жиырма ","пын."],"options":["жас","жыл","кіші"],"correctAns":"жас","hintEn":"I am twenty years old."}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u2-l3-e5', 'u2-l3', 5, 'TRANSLATE_EN_KK', '{"type":"TRANSLATE_EN_KK","promptEn":"year","tiles":["жыл","жас","кіші","үлкен"],"correctAns":["жыл"]}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u2-l3-e6', 'u2-l3', 6, 'MATCH_PAIRS', '{"type":"MATCH_PAIRS","pairs":[{"kazakh":"жас","english":"young"},{"kazakh":"үлкен","english":"big"},{"kazakh":"кіші","english":"small"},{"kazakh":"жыл","english":"year"},{"kazakh":"ана","english":"mother"}]}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u2-l3-e7', 'u2-l3', 7, 'MULTIPLE_CHOICE', '{"type":"MULTIPLE_CHOICE","promptKk":"жас","questionEn":"What does this mean?","options":["age / young","big","old","tall"],"correctAns":"age / young"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u2-l3-e8', 'u2-l3', 8, 'TRANSLATE_EN_KK', '{"type":"TRANSLATE_EN_KK","promptEn":"younger","tiles":["кіші","үлкен","жас","жыл"],"correctAns":["кіші"]}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u2-l3-e9', 'u2-l3', 9, 'LISTENING', '{"type":"LISTENING","audioKk":"үлкен","options":["үлкен","кіші","жас","жыл"],"correctAns":"үлкен"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u2-l3-e10', 'u2-l3', 10, 'TRANSLATE_KK_EN', '{"type":"TRANSLATE_KK_EN","promptKk":"үлкен","options":["big","small","good","fast"],"correctAns":"big"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.lessons (id, unit_id, "order", title_native, title_en, status) values (
  'u2-l4', 'u2', 4, 'Менің отбасым', 'My Family Sentences', 'active'
) on conflict (id) do update set
  unit_id = excluded.unit_id, "order" = excluded."order",
  title_native = excluded.title_native, title_en = excluded.title_en,
  status = excluded.status;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-meni-otbasy', 'u2', 'отбасы', 'family', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-bar', 'u2', 'бар', 'there is / have', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-jokk', 'u2', 'жоқ', 'there isn''t / not have', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u2-l4-e1', 'u2-l4', 1, 'FILL_BLANK', '{"type":"FILL_BLANK","sentenceKkParts":["Менің ","м бар."],"options":["отбасы","ата","ана"],"correctAns":"отбасы","hintEn":"I have a family."}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u2-l4-e2', 'u2-l4', 2, 'MULTIPLE_CHOICE', '{"type":"MULTIPLE_CHOICE","promptKk":"бар","questionEn":"What does this mean?","options":["have / there is","no","now","good"],"correctAns":"have / there is"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u2-l4-e3', 'u2-l4', 3, 'TRANSLATE_KK_EN', '{"type":"TRANSLATE_KK_EN","promptKk":"отбасы","options":["family","house","child","year"],"correctAns":"family"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u2-l4-e4', 'u2-l4', 4, 'LISTENING', '{"type":"LISTENING","audioKk":"отбасы","options":["отбасы","ана","әке","бала"],"correctAns":"отбасы"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u2-l4-e5', 'u2-l4', 5, 'TRANSLATE_EN_KK', '{"type":"TRANSLATE_EN_KK","promptEn":"I have a family.","tiles":["менің","отбасым","бар","жоқ"],"correctAns":["менің","отбасым","бар"]}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u2-l4-e6', 'u2-l4', 6, 'TRANSLATE_EN_KK', '{"type":"TRANSLATE_EN_KK","promptEn":"My mother is good.","tiles":["менің","анам","жақсы","жаман"],"correctAns":["менің","анам","жақсы"]}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u2-l4-e7', 'u2-l4', 7, 'MATCH_PAIRS', '{"type":"MATCH_PAIRS","pairs":[{"kazakh":"отбасы","english":"family"},{"kazakh":"бар","english":"have"},{"kazakh":"жоқ","english":"don''t have"},{"kazakh":"үлкен","english":"big"},{"kazakh":"кіші","english":"small"}]}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u2-l4-e8', 'u2-l4', 8, 'FILL_BLANK', '{"type":"FILL_BLANK","sentenceKkParts":["Менің балам ","."],"options":["жоқ","үлкен","ана"],"correctAns":"жоқ","hintEn":"I don''t have a child."}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u2-l4-e9', 'u2-l4', 9, 'TRANSLATE_KK_EN', '{"type":"TRANSLATE_KK_EN","promptKk":"Менің отбасым үлкен.","options":["My family is big.","My family is small.","I have a family.","I don''t have a family."],"correctAns":"My family is big."}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u2-l4-e10', 'u2-l4', 10, 'LISTENING', '{"type":"LISTENING","audioKk":"Менің отбасым жақсы.","options":["Менің отбасым жақсы.","Сенің отбасың үлкен.","Біздің отбасымыз кіші.","Оның отбасы жоқ."],"correctAns":"Менің отбасым жақсы."}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

-- Unit 3 — Food & Drink
insert into public.units (id, language_code, "order", title_native, title_en, cefr_level, emoji, description, cultural_note, status) values (
  'u3', 'kk', 3, 'Тағам', 'Food & Drink', 'A1', '🍲', 'Common foods, ordering, traditional dishes.', 'The ''дастархан'' is the laden tablecloth at the heart of Kazakh hospitality. Beshbarmak (''бесбармақ'' — ''five fingers'') is the national dish, eaten by hand from a shared platter. Tea (''шай'') is offered to every guest.', 'active'
) on conflict (id) do update set
  language_code = excluded.language_code, "order" = excluded."order",
  title_native = excluded.title_native, title_en = excluded.title_en,
  cefr_level = excluded.cefr_level, emoji = excluded.emoji,
  description = excluded.description, cultural_note = excluded.cultural_note,
  status = excluded.status;

insert into public.lessons (id, unit_id, "order", title_native, title_en, status) values (
  'u3-l1', 'u3', 1, 'Тағам сөздері', 'Food Words', 'active'
) on conflict (id) do update set
  unit_id = excluded.unit_id, "order" = excluded."order",
  title_native = excluded.title_native, title_en = excluded.title_en,
  status = excluded.status;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-non', 'u3', 'нан', 'bread', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-su', 'u3', 'су', 'water', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-shay', 'u3', 'шай', 'tea', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-et', 'u3', 'ет', 'meat', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-suit', 'u3', 'сүт', 'milk', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-alma', 'u3', 'алма', 'apple', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-jemis', 'u3', 'жеміс', 'fruit', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u3-l1-e1', 'u3-l1', 1, 'MULTIPLE_CHOICE', '{"type":"MULTIPLE_CHOICE","promptKk":"нан","questionEn":"What does this mean?","options":["bread","water","milk","tea"],"correctAns":"bread"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u3-l1-e2', 'u3-l1', 2, 'TRANSLATE_KK_EN', '{"type":"TRANSLATE_KK_EN","promptKk":"су","options":["water","milk","soup","tea"],"correctAns":"water"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u3-l1-e3', 'u3-l1', 3, 'LISTENING', '{"type":"LISTENING","audioKk":"шай","options":["шай","су","сүт","нан"],"correctAns":"шай"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u3-l1-e4', 'u3-l1', 4, 'MATCH_PAIRS', '{"type":"MATCH_PAIRS","pairs":[{"kazakh":"нан","english":"bread"},{"kazakh":"су","english":"water"},{"kazakh":"шай","english":"tea"},{"kazakh":"ет","english":"meat"},{"kazakh":"сүт","english":"milk"}]}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u3-l1-e5', 'u3-l1', 5, 'TRANSLATE_EN_KK', '{"type":"TRANSLATE_EN_KK","promptEn":"apple","tiles":["алма","жеміс","ет","сүт"],"correctAns":["алма"]}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u3-l1-e6', 'u3-l1', 6, 'FILL_BLANK', '{"type":"FILL_BLANK","sentenceKkParts":["Мен "," ішемін."],"options":["шай","ет","нан"],"correctAns":"шай","hintEn":"I drink tea."}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u3-l1-e7', 'u3-l1', 7, 'MULTIPLE_CHOICE', '{"type":"MULTIPLE_CHOICE","promptKk":"сүт","questionEn":"What does this mean?","options":["water","milk","soup","salt"],"correctAns":"milk"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u3-l1-e8', 'u3-l1', 8, 'TRANSLATE_EN_KK', '{"type":"TRANSLATE_EN_KK","promptEn":"fruit","tiles":["жеміс","алма","ет","нан"],"correctAns":["жеміс"]}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u3-l1-e9', 'u3-l1', 9, 'LISTENING', '{"type":"LISTENING","audioKk":"ет","options":["ет","су","нан","шай"],"correctAns":"ет"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u3-l1-e10', 'u3-l1', 10, 'TRANSLATE_KK_EN', '{"type":"TRANSLATE_KK_EN","promptKk":"жеміс","options":["fruit","vegetable","meat","bread"],"correctAns":"fruit"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.lessons (id, unit_id, "order", title_native, title_en, status) values (
  'u3-l2', 'u3', 2, 'Дастархан', 'The Dastarkhan', 'active'
) on conflict (id) do update set
  unit_id = excluded.unit_id, "order" = excluded."order",
  title_native = excluded.title_native, title_en = excluded.title_en,
  status = excluded.status;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-dastarkhan', 'u3', 'дастархан', 'the laid table', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-konak', 'u3', 'қонақ', 'guest', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-tabaq', 'u3', 'табақ', 'platter', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-tagam', 'u3', 'тағам', 'food', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-iz', 'u3', 'із', 'trace / spoon (small)', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u3-l2-e1', 'u3-l2', 1, 'MULTIPLE_CHOICE', '{"type":"MULTIPLE_CHOICE","promptKk":"қонақ","questionEn":"What does this mean?","options":["guest","host","child","friend"],"correctAns":"guest"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u3-l2-e2', 'u3-l2', 2, 'TRANSLATE_KK_EN', '{"type":"TRANSLATE_KK_EN","promptKk":"тағам","options":["food","drink","table","kitchen"],"correctAns":"food"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u3-l2-e3', 'u3-l2', 3, 'LISTENING', '{"type":"LISTENING","audioKk":"дастархан","options":["дастархан","табақ","тағам","қонақ"],"correctAns":"дастархан"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u3-l2-e4', 'u3-l2', 4, 'MATCH_PAIRS', '{"type":"MATCH_PAIRS","pairs":[{"kazakh":"дастархан","english":"the laid table"},{"kazakh":"қонақ","english":"guest"},{"kazakh":"табақ","english":"platter"},{"kazakh":"тағам","english":"food"},{"kazakh":"шай","english":"tea"}]}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u3-l2-e5', 'u3-l2', 5, 'TRANSLATE_EN_KK', '{"type":"TRANSLATE_EN_KK","promptEn":"guest","tiles":["қонақ","тағам","табақ","дастархан"],"correctAns":["қонақ"]}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u3-l2-e6', 'u3-l2', 6, 'FILL_BLANK', '{"type":"FILL_BLANK","sentenceKkParts":[""," дайын."],"options":["дастархан","қонақ","ет"],"correctAns":"дастархан","hintEn":"The dastarkhan is ready."}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u3-l2-e7', 'u3-l2', 7, 'MULTIPLE_CHOICE', '{"type":"MULTIPLE_CHOICE","promptKk":"табақ","questionEn":"What does this mean?","options":["plate","platter","spoon","cup"],"correctAns":"platter"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u3-l2-e8', 'u3-l2', 8, 'TRANSLATE_EN_KK', '{"type":"TRANSLATE_EN_KK","promptEn":"food","tiles":["тағам","су","шай","ет"],"correctAns":["тағам"]}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u3-l2-e9', 'u3-l2', 9, 'LISTENING', '{"type":"LISTENING","audioKk":"қонақ","options":["қонақ","тағам","табақ","дастархан"],"correctAns":"қонақ"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u3-l2-e10', 'u3-l2', 10, 'TRANSLATE_KK_EN', '{"type":"TRANSLATE_KK_EN","promptKk":"табақ","options":["platter","plate","spoon","cup"],"correctAns":"platter"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.lessons (id, unit_id, "order", title_native, title_en, status) values (
  'u3-l3', 'u3', 3, 'Тапсырыс', 'Ordering', 'active'
) on conflict (id) do update set
  unit_id = excluded.unit_id, "order" = excluded."order",
  title_native = excluded.title_native, title_en = excluded.title_en,
  status = excluded.status;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-beriniz', 'u3', 'беріңіз', 'give me (formal)', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-kerek', 'u3', 'керек', 'need', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-magan', 'u3', 'маған', 'to me', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-bir2', 'u3', 'бір', 'one / a', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u3-l3-e1', 'u3-l3', 1, 'MULTIPLE_CHOICE', '{"type":"MULTIPLE_CHOICE","promptKk":"беріңіз","questionEn":"What does this mean?","options":["give me","thanks","please","yes"],"correctAns":"give me"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u3-l3-e2', 'u3-l3', 2, 'FILL_BLANK', '{"type":"FILL_BLANK","sentenceKkParts":["Маған бір шай ","."],"options":["беріңіз","керек","иә"],"correctAns":"беріңіз","hintEn":"Give me one tea."}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u3-l3-e3', 'u3-l3', 3, 'TRANSLATE_KK_EN', '{"type":"TRANSLATE_KK_EN","promptKk":"керек","options":["need","want","have","give"],"correctAns":"need"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u3-l3-e4', 'u3-l3', 4, 'LISTENING', '{"type":"LISTENING","audioKk":"маған","options":["маған","саған","оған","бізге"],"correctAns":"маған"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u3-l3-e5', 'u3-l3', 5, 'TRANSLATE_EN_KK', '{"type":"TRANSLATE_EN_KK","promptEn":"I need water.","tiles":["маған","су","керек","шай"],"correctAns":["маған","су","керек"]}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u3-l3-e6', 'u3-l3', 6, 'MATCH_PAIRS', '{"type":"MATCH_PAIRS","pairs":[{"kazakh":"беріңіз","english":"give me"},{"kazakh":"керек","english":"need"},{"kazakh":"маған","english":"to me"},{"kazakh":"бір","english":"one"},{"kazakh":"шай","english":"tea"}]}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u3-l3-e7', 'u3-l3', 7, 'FILL_BLANK', '{"type":"FILL_BLANK","sentenceKkParts":[""," нан керек."],"options":["маған","сізге","оған"],"correctAns":"маған","hintEn":"I need bread."}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u3-l3-e8', 'u3-l3', 8, 'TRANSLATE_KK_EN', '{"type":"TRANSLATE_KK_EN","promptKk":"Маған шай беріңіз.","options":["Give me tea, please.","I have tea.","Tea is good.","I need water."],"correctAns":"Give me tea, please."}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u3-l3-e9', 'u3-l3', 9, 'LISTENING', '{"type":"LISTENING","audioKk":"Маған бір нан керек.","options":["Маған бір нан керек.","Маған бір шай керек.","Маған бір су керек.","Маған бір ет керек."],"correctAns":"Маған бір нан керек."}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u3-l3-e10', 'u3-l3', 10, 'MULTIPLE_CHOICE', '{"type":"MULTIPLE_CHOICE","promptKk":"бір","questionEn":"What does this mean?","options":["one / a","two","the","some"],"correctAns":"one / a"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.lessons (id, unit_id, "order", title_native, title_en, status) values (
  'u3-l4', 'u3', 4, 'Бесбармақ', 'Beshbarmak & tea culture', 'active'
) on conflict (id) do update set
  unit_id = excluded.unit_id, "order" = excluded."order",
  title_native = excluded.title_native, title_en = excluded.title_en,
  status = excluded.status;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-besbarmaq', 'u3', 'бесбармақ', 'beshbarmak', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-baursaq', 'u3', 'бауырсақ', 'fried dough', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-qymyz', 'u3', 'қымыз', 'fermented mare''s milk', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-shubat', 'u3', 'шұбат', 'fermented camel''s milk', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.vocab (id, unit_id, native, english, audio_url, morphemes) values (
  'v-dam', 'u3', 'дәмді', 'delicious', null, null
) on conflict (id) do update set
  unit_id = excluded.unit_id, native = excluded.native, english = excluded.english,
  audio_url = excluded.audio_url, morphemes = excluded.morphemes;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u3-l4-e1', 'u3-l4', 1, 'MULTIPLE_CHOICE', '{"type":"MULTIPLE_CHOICE","promptKk":"бесбармақ","questionEn":"What is this?","options":["a national meat & noodle dish","fermented milk","fried dough","tea"],"correctAns":"a national meat & noodle dish"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u3-l4-e2', 'u3-l4', 2, 'TRANSLATE_KK_EN', '{"type":"TRANSLATE_KK_EN","promptKk":"дәмді","options":["delicious","salty","spicy","cold"],"correctAns":"delicious"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u3-l4-e3', 'u3-l4', 3, 'LISTENING', '{"type":"LISTENING","audioKk":"қымыз","options":["қымыз","шұбат","шай","сүт"],"correctAns":"қымыз"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u3-l4-e4', 'u3-l4', 4, 'MATCH_PAIRS', '{"type":"MATCH_PAIRS","pairs":[{"kazakh":"бесбармақ","english":"beshbarmak"},{"kazakh":"бауырсақ","english":"fried dough"},{"kazakh":"қымыз","english":"mare''s milk"},{"kazakh":"шұбат","english":"camel''s milk"},{"kazakh":"дәмді","english":"delicious"}]}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u3-l4-e5', 'u3-l4', 5, 'TRANSLATE_EN_KK', '{"type":"TRANSLATE_EN_KK","promptEn":"delicious","tiles":["дәмді","жақсы","үлкен","кіші"],"correctAns":["дәмді"]}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u3-l4-e6', 'u3-l4', 6, 'FILL_BLANK', '{"type":"FILL_BLANK","sentenceKkParts":["Бесбармақ ","."],"options":["дәмді","кіші","жоқ"],"correctAns":"дәмді","hintEn":"Beshbarmak is delicious."}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u3-l4-e7', 'u3-l4', 7, 'TRANSLATE_KK_EN', '{"type":"TRANSLATE_KK_EN","promptKk":"бауырсақ","options":["fried dough","rice","porridge","cake"],"correctAns":"fried dough"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u3-l4-e8', 'u3-l4', 8, 'MULTIPLE_CHOICE', '{"type":"MULTIPLE_CHOICE","promptKk":"шұбат","questionEn":"What is this?","options":["camel''s milk","mare''s milk","cow''s milk","goat''s milk"],"correctAns":"camel''s milk"}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u3-l4-e9', 'u3-l4', 9, 'TRANSLATE_EN_KK', '{"type":"TRANSLATE_EN_KK","promptEn":"The tea is delicious.","tiles":["шай","дәмді","жоқ","су"],"correctAns":["шай","дәмді"]}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status) values (
  'u3-l4-e10', 'u3-l4', 10, 'LISTENING', '{"type":"LISTENING","audioKk":"Бесбармақ дәмді.","options":["Бесбармақ дәмді.","Шай дәмді.","Сүт жақсы.","Нан керек."],"correctAns":"Бесбармақ дәмді."}'::jsonb, 'active'
) on conflict (id) do update set
  lesson_id = excluded.lesson_id, "order" = excluded."order",
  type = excluded.type, prompt = excluded.prompt, status = excluded.status;



-- Placeholder units (4-10) — stubs with no lessons yet, so the skill tree
-- shows the full A1→B1 arc. Replace with real content as it's authored.
insert into public.units (id, language_code, "order", title_native, title_en, cefr_level, emoji, description, status) values
  ('u4',  'kk', 4,  'Күнделікті өмір',         'Daily Life',                '🌞', 'A2', 'Coming soon', 'active'),
  ('u5',  'kk', 5,  'Қала мен көлік',          'City & Transport',          '🚌', 'A2', 'Coming soon', 'active'),
  ('u6',  'kk', 6,  'Нарық пен дүкен',         'Shopping & Market',         '🛒', 'A2', 'Coming soon', 'active'),
  ('u7',  'kk', 7,  'Денсаулық',                'Health',                    '🏥', 'B1', 'Coming soon', 'active'),
  ('u8',  'kk', 8,  'Саяхат',                   'Travel across Kazakhstan',  '🏔️', 'B1', 'Coming soon', 'active'),
  ('u9',  'kk', 9,  'Жұмыс пен оқу',           'Work & Study',              '💼', 'B1', 'Coming soon', 'active'),
  ('u10', 'kk', 10, 'Мерекелер мен дәстүрлер', 'Holidays & Traditions',     '🎉', 'B1', 'Coming soon', 'active')
on conflict (id) do update set
  language_code = excluded.language_code, "order" = excluded."order",
  title_native = excluded.title_native, title_en = excluded.title_en,
  cefr_level = excluded.cefr_level, emoji = excluded.emoji,
  description = excluded.description, status = excluded.status;
