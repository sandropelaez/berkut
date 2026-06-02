-- Berkut v1.5 — B1.1 seed (Units 25-30).
-- Idempotent. Scaffolds vocab + cultural notes + 2 sample lessons per unit.
-- Units remain status='draft' until a Kazakh translator (role='content_editor')
-- completes the remaining lessons via /admin/content and flips status to 'active'.

-- ─── Cultural notes for B1.1 units ──────────────────────────────────────
update public.units set cultural_note =
  'Қазақ тіліндегі сөйлесу — салт-дәстүрге толы өнер. Үлкен адамдарға «сіз» деп қаратып, әңгімені «Қалыңыз қалай?» деп бастайды. Сөзді бөлмеу әдеп; "Кешіріңіз, сөзіңізді бөлейін" — пайдалы кіріспе.'
where id='u25';

update public.units set cultural_note =
  'Қазақстанда жыл бойы көптеген мерекелер аталып өтіледі: Жаңа жыл (1 қаңтар), Наурыз (21-22 наурыз), Қазақстан халқы бірлігі күні (1 мамыр), Жеңіс күні (9 мамыр), Тәуелсіздік күні (16 желтоқсан). Мейрамдарда отбасы жиналып, дастархан жайып, бір-біріне сыйлықтар береді.'
where id='u27';

update public.units set cultural_note =
  'Қазақ халық ертегілері — даналыққа толы байлық. «Ер Төстік», «Алдар Көсе», «Қожанасыр» — ұрпақтан-ұрпаққа жететін кейіпкерлер. Ертегілерде көбіне үш сан кездеседі: үш күн, үш бауыр, үш сұрақ.'
where id='u28';

update public.units set cultural_note =
  'Қазақ музыкасы — ұлттық бірегейлігінің маңызды бөлігі. Домбыра — ең танымал қазақ музыкалық аспабы; екі ішекті, орындалуы оңай көрінсе де, шеберлігі жылдар бойы шыңдалады. Күй — аспаптық музыка жанры, көбіне домбыраға арналған. Құрманғазы Сағырбайұлы, Дина Нұрпейісова — қазақ күй өнерінің классиктері.'
where id='u29';

update public.units set cultural_note =
  'Қазақ халқы — Ұлы даланың көшпенді өркениетінің мұрагерлері. Қазақ хандығы 1465 жылы Керей мен Жәнібек ханның басшылығымен құрылды. Алаш орда қозғалысы (1917-1920) қазіргі қазақ ұлтшылдығының рухани бастауы болды. Атажұрт, Ұлы дала, Ел тарихы — мәдени бірегейліктің іргетасы.'
where id='u30';

-- ─── Unit 25 — Әңгімелесейік (Conversations) ────────────────────────────
insert into public.vocab (id, unit_id, native, english) values
  ('v-u25-soy', 'u25','сөйлесу','to converse'),
  ('v-u25-arn', 'u25','әрине','of course'),
  ('v-u25-ay',  'u25','айтыңызшы','please tell me'),
  ('v-u25-oym', 'u25','менің ойымша','in my opinion'),
  ('v-u25-kel', 'u25','келісемін','I agree'),
  ('v-u25-kel-jok','u25','келіспеймін','I disagree'),
  ('v-u25-bay', 'u25','байқадыңыз ба','have you noticed?'),
  ('v-u25-soz', 'u25','сөзіңізді бөлейін','let me interrupt')
on conflict (id) do update set
  unit_id=excluded.unit_id, native=excluded.native, english=excluded.english;

insert into public.lessons (id, unit_id, "order", title_native, title_en, status) values
  ('u25-co1','u25',1,'Әңгіме бастау','Starting a conversation','active'),
  ('u25-co2','u25',2,'Пікір білдіру','Expressing opinions','active')
on conflict (id) do update set
  unit_id=excluded.unit_id, "order"=excluded."order",
  title_native=excluded.title_native, title_en=excluded.title_en, status=excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status, confidence) values
  ('u25-co1-e1','u25-co1',1,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"Қалыңыз қалай?","options":["How are you (formal)?","Where are you?","Who are you?","When are you?"],"correctAns":"How are you (formal)?"}'::jsonb,'active','high'),
  ('u25-co1-e2','u25-co1',2,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"Айтыңызшы…","options":["Please tell me…","I will tell…","Let me speak…","Listen to me."],"correctAns":"Please tell me…"}'::jsonb,'active','high'),
  ('u25-co1-e3','u25-co1',3,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"Менің сұрағым бар.","options":["I have a question.","I have an answer.","Where''s your question?","I''m asking."],"correctAns":"I have a question."}'::jsonb,'active','medium'),
  ('u25-co1-e4','u25-co1',4,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"Кешіріңіз, сөзіңізді бөлейін.","options":["Excuse me, let me interrupt.","Goodbye, see you.","Please continue.","Thank you for speaking."],"correctAns":"Excuse me, let me interrupt."}'::jsonb,'active','medium'),
  ('u25-co1-e5','u25-co1',5,'LISTENING',
   '{"type":"LISTENING","audioKk":"Сізбен сөйлескім келеді.","options":["Сізбен сөйлескім келеді.","Сізді көргім келеді.","Сізді тыңдағым келеді.","Сізге сұрағым бар."],"correctAns":"Сізбен сөйлескім келеді."}'::jsonb,'active','medium'),
  ('u25-co1-e6','u25-co1',6,'TRANSLATE_EN_KK',
   '{"type":"TRANSLATE_EN_KK","promptEn":"Please tell me, where are you from?","tiles":["Айтыңызшы","сіз","қайдан","келдіңіз"],"correctAns":["Айтыңызшы","сіз","қайдан","келдіңіз"]}'::jsonb,'active','medium'),
  ('u25-co1-e7','u25-co1',7,'MATCH_PAIRS',
   '{"type":"MATCH_PAIRS","pairs":[{"kazakh":"Қалыңыз қалай?","english":"How are you?"},{"kazakh":"Айтыңызшы","english":"Please tell me"},{"kazakh":"Кешіріңіз","english":"Excuse me"},{"kazakh":"Әрине","english":"Of course"},{"kazakh":"Менің ойымша","english":"In my opinion"}]}'::jsonb,'active','high'),
  ('u25-co1-e8','u25-co1',8,'FILL_BLANK',
   '{"type":"FILL_BLANK","sentenceKkParts":["","сұрағым бар."],"options":["Менің","Сенің","Оның"],"correctAns":"Менің","hintEn":"I have a question."}'::jsonb,'active','medium'),
  ('u25-co1-e9','u25-co1',9,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"Әрине, иә.","options":["Of course, yes.","No, never.","Maybe later.","Just a moment."],"correctAns":"Of course, yes."}'::jsonb,'active','high'),
  ('u25-co1-e10','u25-co1',10,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"Бір сұрақ қойсам бола ма?","options":["May I ask a question?","I have an answer.","Don''t ask.","Yes, ask anything."],"correctAns":"May I ask a question?"}'::jsonb,'active','medium'),

  ('u25-co2-e1','u25-co2',1,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"Менің ойымша…","options":["In my opinion…","In your opinion…","I''m thinking.","I forgot."],"correctAns":"In my opinion…"}'::jsonb,'active','high'),
  ('u25-co2-e2','u25-co2',2,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"Сізбен келісемін.","options":["I agree with you.","I disagree.","Tell me more.","Who are you?"],"correctAns":"I agree with you."}'::jsonb,'active','high'),
  ('u25-co2-e3','u25-co2',3,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"Кешіріңіз, келіспеймін.","options":["Sorry, I disagree.","Sorry, I agree.","Excuse me, what?","I''ll be right back."],"correctAns":"Sorry, I disagree."}'::jsonb,'active','high'),
  ('u25-co2-e4','u25-co2',4,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"Сіз қалай ойлайсыз?","options":["What do you think? (formal)","What do you do?","Where are you?","How do you feel?"],"correctAns":"What do you think? (formal)"}'::jsonb,'active','high'),
  ('u25-co2-e5','u25-co2',5,'LISTENING',
   '{"type":"LISTENING","audioKk":"Менің ойымша, бұл дұрыс.","options":["Менің ойымша, бұл дұрыс.","Менің ойымша, бұл қате.","Сіздіңше дұрыс.","Бұл дұрыс емес."],"correctAns":"Менің ойымша, бұл дұрыс."}'::jsonb,'active','medium'),
  ('u25-co2-e6','u25-co2',6,'TRANSLATE_EN_KK',
   '{"type":"TRANSLATE_EN_KK","promptEn":"I agree with you completely.","tiles":["Сізбен","толық","келісемін","келіспеймін"],"correctAns":["Сізбен","толық","келісемін"]}'::jsonb,'active','medium'),
  ('u25-co2-e7','u25-co2',7,'MATCH_PAIRS',
   '{"type":"MATCH_PAIRS","pairs":[{"kazakh":"менің ойымша","english":"in my opinion"},{"kazakh":"сізбен келісемін","english":"I agree"},{"kazakh":"келіспеймін","english":"I disagree"},{"kazakh":"сіз қалай ойлайсыз","english":"what do you think"},{"kazakh":"әрине","english":"of course"}]}'::jsonb,'active','high'),
  ('u25-co2-e8','u25-co2',8,'FILL_BLANK',
   '{"type":"FILL_BLANK","sentenceKkParts":["Менің ","..."],"options":["ойымша","үйім","досым"],"correctAns":"ойымша","hintEn":"In my opinion…"}'::jsonb,'active','medium'),
  ('u25-co2-e9','u25-co2',9,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"Бұл өте маңызды мәселе.","options":["This is a very important matter.","This is unimportant.","This is a question.","Where is the matter?"],"correctAns":"This is a very important matter."}'::jsonb,'active','medium'),
  ('u25-co2-e10','u25-co2',10,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"Сіздің пікіріңіз қандай?","options":["What is your opinion? (formal)","What is your name?","Where do you live?","When are you free?"],"correctAns":"What is your opinion? (formal)"}'::jsonb,'active','medium')
on conflict (id) do update set
  lesson_id=excluded.lesson_id, "order"=excluded."order",
  type=excluded.type, prompt=excluded.prompt, status=excluded.status, confidence=excluded.confidence;

-- ─── Unit 26 — Егер... (Conditionals) ──────────────────────────────────
insert into public.vocab (id, unit_id, native, english) values
  ('v-u26-eg',  'u26','егер','if'),
  ('v-u26-bol', 'u26','болса','if it is / were'),
  ('v-u26-kor', 'u26','көрсе','if (he/she) sees'),
  ('v-u26-onda','u26','онда','then'),
  ('v-u26-mum', 'u26','мүмкін','possible / maybe'),
  ('v-u26-mind','u26','міндетті түрде','certainly')
on conflict (id) do update set
  unit_id=excluded.unit_id, native=excluded.native, english=excluded.english;

insert into public.lessons (id, unit_id, "order", title_native, title_en, status) values
  ('u26-cd1','u26',1,'Шарт құрылымы','Conditional structure -са/-се','active'),
  ('u26-cd2','u26',2,'Күрделі шарт','Complex conditionals','active')
on conflict (id) do update set
  unit_id=excluded.unit_id, "order"=excluded."order",
  title_native=excluded.title_native, title_en=excluded.title_en, status=excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status, confidence) values
  ('u26-cd1-e1','u26-cd1',1,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"Егер ауа райы жақсы болса, қыдыруға барамыз.","options":["If the weather is good, we will go for a walk.","The weather is good.","We are going for a walk.","Where is the weather?"],"correctAns":"If the weather is good, we will go for a walk."}'::jsonb,'active','medium'),
  ('u26-cd1-e2','u26-cd1',2,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"Егер сен келсең, мен қуанамын.","options":["If you come, I will be happy.","I am happy.","You are coming.","Come and be happy."],"correctAns":"If you come, I will be happy."}'::jsonb,'active','medium'),
  ('u26-cd1-e3','u26-cd1',3,'MULTIPLE_CHOICE',
   '{"type":"MULTIPLE_CHOICE","promptKk":"-са / -се","questionEn":"This suffix marks…","options":["conditional (if)","past tense","future","plural"],"correctAns":"conditional (if)"}'::jsonb,'active','high'),
  ('u26-cd1-e4','u26-cd1',4,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"Егер аштымын болсаң, нан же.","options":["If you are hungry, eat bread.","I am hungry.","Eat bread now.","Where is the bread?"],"correctAns":"If you are hungry, eat bread."}'::jsonb,'active','medium'),
  ('u26-cd1-e5','u26-cd1',5,'TRANSLATE_EN_KK',
   '{"type":"TRANSLATE_EN_KK","promptEn":"If it rains, I will stay home.","tiles":["Егер","жаңбыр","жауса","үйде","боламын"],"correctAns":["Егер","жаңбыр","жауса","үйде","боламын"]}'::jsonb,'active','medium'),
  ('u26-cd1-e6','u26-cd1',6,'LISTENING',
   '{"type":"LISTENING","audioKk":"Егер уақытым болса, келемін.","options":["Егер уақытым болса, келемін.","Уақытым жоқ.","Мен қазір келемін.","Уақытым бар."],"correctAns":"Егер уақытым болса, келемін."}'::jsonb,'active','medium'),
  ('u26-cd1-e7','u26-cd1',7,'MATCH_PAIRS',
   '{"type":"MATCH_PAIRS","pairs":[{"kazakh":"егер … болса","english":"if … is"},{"kazakh":"егер … келсе","english":"if … comes"},{"kazakh":"егер … барса","english":"if … goes"},{"kazakh":"онда","english":"then"},{"kazakh":"мүмкін","english":"maybe"}]}'::jsonb,'active','high'),
  ('u26-cd1-e8','u26-cd1',8,'FILL_BLANK',
   '{"type":"FILL_BLANK","sentenceKkParts":["Егер сен үйде ","мен келемін."],"options":["болсаң","барсаң","келсең"],"correctAns":"болсаң","hintEn":"If you are at home, I will come."}'::jsonb,'active','medium'),
  ('u26-cd1-e9','u26-cd1',9,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"Егер уақытыңыз болса, кешке кездесейік.","options":["If you have time, let''s meet in the evening.","I have no time.","Where shall we meet?","Meet in the morning."],"correctAns":"If you have time, let''s meet in the evening."}'::jsonb,'active','medium'),
  ('u26-cd1-e10','u26-cd1',10,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"Егер шаршадың болсаң, демал.","options":["If you''re tired, rest.","Be tired.","Don''t rest.","I am tired."],"correctAns":"If you''re tired, rest."}'::jsonb,'active','medium'),

  ('u26-cd2-e1','u26-cd2',1,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"Егер мен сен болсам, барар едім.","options":["If I were you, I would go.","I am you.","You went.","I would not go."],"correctAns":"If I were you, I would go."}'::jsonb,'active','low'),
  ('u26-cd2-e2','u26-cd2',2,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"Егер ертерек тұрсам, сабаққа кешікпеймін.","options":["If I get up earlier, I won''t be late for class.","I will be late.","I am late.","Class starts late."],"correctAns":"If I get up earlier, I won''t be late for class."}'::jsonb,'active','medium'),
  ('u26-cd2-e3','u26-cd2',3,'TRANSLATE_EN_KK',
   '{"type":"TRANSLATE_EN_KK","promptEn":"If you study, you will succeed.","tiles":["Егер","оқысаң","табысты","боласың"],"correctAns":["Егер","оқысаң","табысты","боласың"]}'::jsonb,'active','medium'),
  ('u26-cd2-e4','u26-cd2',4,'LISTENING',
   '{"type":"LISTENING","audioKk":"Егер сабақты түсінсем, емтиханды жақсы тапсырамын.","options":["Егер сабақты түсінсем, емтиханды жақсы тапсырамын.","Сабақты түсінбеймін.","Емтиханға дайынмын.","Емтихан қашан?"],"correctAns":"Егер сабақты түсінсем, емтиханды жақсы тапсырамын."}'::jsonb,'active','low'),
  ('u26-cd2-e5','u26-cd2',5,'MATCH_PAIRS',
   '{"type":"MATCH_PAIRS","pairs":[{"kazakh":"егер … болса","english":"if … is"},{"kazakh":"…-сам / …-сем","english":"if I …"},{"kazakh":"…-саң / …-сең","english":"if you …"},{"kazakh":"…-са / …-се","english":"if (he) …"},{"kazakh":"…-сақ / …-сек","english":"if we …"}]}'::jsonb,'active','high'),
  ('u26-cd2-e6','u26-cd2',6,'FILL_BLANK',
   '{"type":"FILL_BLANK","sentenceKkParts":["Егер сен ","..., қоңырау шал."],"options":["шаршасаң","шаршадым","шаршаған"],"correctAns":"шаршасаң","hintEn":"If you get tired, call."}'::jsonb,'active','medium'),
  ('u26-cd2-e7','u26-cd2',7,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"Егер сұрағыңыз болса, маған жазыңыз.","options":["If you have a question, write to me.","I have a question.","Where is the question?","Don''t ask."],"correctAns":"If you have a question, write to me."}'::jsonb,'active','medium'),
  ('u26-cd2-e8','u26-cd2',8,'TRANSLATE_EN_KK',
   '{"type":"TRANSLATE_EN_KK","promptEn":"If it''s cold, wear a coat.","tiles":["Егер","суық","болса","киіміңді","киіп ал"],"correctAns":["Егер","суық","болса","киіміңді","киіп ал"]}'::jsonb,'active','low'),
  ('u26-cd2-e9','u26-cd2',9,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"Сен болмасаң, мен де бармаймын.","options":["If you''re not there, I won''t go either.","I will go alone.","You are coming.","Don''t go."],"correctAns":"If you''re not there, I won''t go either."}'::jsonb,'active','medium'),
  ('u26-cd2-e10','u26-cd2',10,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"Менің орнымда болсаң, не істер едің?","options":["What would you do in my place?","What is your place?","Where do you live?","Why are you here?"],"correctAns":"What would you do in my place?"}'::jsonb,'active','low')
on conflict (id) do update set
  lesson_id=excluded.lesson_id, "order"=excluded."order",
  type=excluded.type, prompt=excluded.prompt, status=excluded.status, confidence=excluded.confidence;

-- ─── Unit 27 — Мерекелер (Holidays) ─────────────────────────────────────
insert into public.vocab (id, unit_id, native, english) values
  ('v-u27-mer', 'u27','мерекелер','holidays'),
  ('v-u27-jan', 'u27','Жаңа жыл','New Year'),
  ('v-u27-tau', 'u27','Тәуелсіздік күні','Independence Day'),
  ('v-u27-jen', 'u27','Жеңіс күні','Victory Day'),
  ('v-u27-ora', 'u27','Ораза айт','Ramadan holiday'),
  ('v-u27-kur', 'u27','Құрбан айт','Eid al-Adha'),
  ('v-u27-kut', 'u27','құтты болсын','congratulations'),
  ('v-u27-tile','u27','тілеймін','I wish')
on conflict (id) do update set
  unit_id=excluded.unit_id, native=excluded.native, english=excluded.english;

insert into public.lessons (id, unit_id, "order", title_native, title_en, status) values
  ('u27-h1','u27',1,'Мерекелік сөздер','Holiday vocabulary','active'),
  ('u27-h2','u27',2,'Құттықтаулар','Holiday greetings','active')
on conflict (id) do update set
  unit_id=excluded.unit_id, "order"=excluded."order",
  title_native=excluded.title_native, title_en=excluded.title_en, status=excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status, confidence) values
  ('u27-h1-e1','u27-h1',1,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"Жаңа жыл","options":["New Year","Birthday","Wedding","Anniversary"],"correctAns":"New Year"}'::jsonb,'active','high'),
  ('u27-h1-e2','u27-h1',2,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"Тәуелсіздік күні","options":["Independence Day","Victory Day","Spring Day","Labour Day"],"correctAns":"Independence Day"}'::jsonb,'active','high'),
  ('u27-h1-e3','u27-h1',3,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"Жеңіс күні","options":["Victory Day","Independence Day","New Year","Labour Day"],"correctAns":"Victory Day"}'::jsonb,'active','high'),
  ('u27-h1-e4','u27-h1',4,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"Ораза айт","options":["Ramadan holiday","Eid al-Adha","New Year","Christmas"],"correctAns":"Ramadan holiday"}'::jsonb,'active','high'),
  ('u27-h1-e5','u27-h1',5,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"Құрбан айт","options":["Eid al-Adha","Ramadan","Nauryz","New Year"],"correctAns":"Eid al-Adha"}'::jsonb,'active','high'),
  ('u27-h1-e6','u27-h1',6,'LISTENING',
   '{"type":"LISTENING","audioKk":"Тәуелсіздік күні","options":["Тәуелсіздік күні","Жеңіс күні","Жаңа жыл","Қазақстан күні"],"correctAns":"Тәуелсіздік күні"}'::jsonb,'active','high'),
  ('u27-h1-e7','u27-h1',7,'MATCH_PAIRS',
   '{"type":"MATCH_PAIRS","pairs":[{"kazakh":"Жаңа жыл","english":"New Year"},{"kazakh":"Тәуелсіздік күні","english":"Independence Day"},{"kazakh":"Жеңіс күні","english":"Victory Day"},{"kazakh":"Ораза айт","english":"Ramadan"},{"kazakh":"Құрбан айт","english":"Eid al-Adha"}]}'::jsonb,'active','high'),
  ('u27-h1-e8','u27-h1',8,'TRANSLATE_EN_KK',
   '{"type":"TRANSLATE_EN_KK","promptEn":"Independence Day","tiles":["Тәуелсіздік","күні","Жаңа","жыл"],"correctAns":["Тәуелсіздік","күні"]}'::jsonb,'active','high'),
  ('u27-h1-e9','u27-h1',9,'FILL_BLANK',
   '{"type":"FILL_BLANK","sentenceKkParts":["16 желтоқсан — ",""],"options":["Тәуелсіздік күні","Жаңа жыл","Наурыз"],"correctAns":"Тәуелсіздік күні","hintEn":"16 December is Independence Day"}'::jsonb,'active','medium'),
  ('u27-h1-e10','u27-h1',10,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"9 мамыр — Жеңіс күні.","options":["May 9 is Victory Day.","May 9 is Independence Day.","May 1 is Victory Day.","9 May is a workday."],"correctAns":"May 9 is Victory Day."}'::jsonb,'active','medium'),

  ('u27-h2-e1','u27-h2',1,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"Жаңа жылыңызбен!","options":["Happy New Year! (formal)","Goodbye!","Welcome!","Thank you!"],"correctAns":"Happy New Year! (formal)"}'::jsonb,'active','high'),
  ('u27-h2-e2','u27-h2',2,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"Туған күніңмен!","options":["Happy birthday! (informal)","Happy New Year!","Goodbye!","Sorry!"],"correctAns":"Happy birthday! (informal)"}'::jsonb,'active','high'),
  ('u27-h2-e3','u27-h2',3,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"Мейрам құтты болсын!","options":["Happy holidays!","Welcome!","Goodbye!","Thank you!"],"correctAns":"Happy holidays!"}'::jsonb,'active','high'),
  ('u27-h2-e4','u27-h2',4,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"Сізге бақыт тілеймін.","options":["I wish you happiness.","I am happy.","Where is happiness?","Be happy."],"correctAns":"I wish you happiness."}'::jsonb,'active','medium'),
  ('u27-h2-e5','u27-h2',5,'LISTENING',
   '{"type":"LISTENING","audioKk":"Туған күніңіз құтты болсын!","options":["Туған күніңіз құтты болсын!","Жаңа жылыңызбен!","Сау болыңыз!","Қош келдіңіз!"],"correctAns":"Туған күніңіз құтты болсын!"}'::jsonb,'active','high'),
  ('u27-h2-e6','u27-h2',6,'TRANSLATE_EN_KK',
   '{"type":"TRANSLATE_EN_KK","promptEn":"Happy birthday, dear friend!","tiles":["Туған күніңмен","қымбатты","досым","рақмет"],"correctAns":["Туған күніңмен","қымбатты","досым"]}'::jsonb,'active','medium'),
  ('u27-h2-e7','u27-h2',7,'MATCH_PAIRS',
   '{"type":"MATCH_PAIRS","pairs":[{"kazakh":"Жаңа жылыңызбен!","english":"Happy New Year!"},{"kazakh":"Туған күніңмен!","english":"Happy birthday!"},{"kazakh":"Құтты болсын!","english":"Congratulations!"},{"kazakh":"Сау болыңыз","english":"Goodbye"},{"kazakh":"Қош келдіңіз","english":"Welcome"}]}'::jsonb,'active','high'),
  ('u27-h2-e8','u27-h2',8,'FILL_BLANK',
   '{"type":"FILL_BLANK","sentenceKkParts":["Мерекеңізбен ","!"],"options":["құтты болсын","сау болыңыз","рақмет"],"correctAns":"құтты болсын","hintEn":"Happy holiday!"}'::jsonb,'active','medium'),
  ('u27-h2-e9','u27-h2',9,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"Сізге денсаулық, бақыт тілеймін!","options":["I wish you health and happiness!","I am healthy and happy.","Where is happiness?","Goodbye and good luck."],"correctAns":"I wish you health and happiness!"}'::jsonb,'active','medium'),
  ('u27-h2-e10','u27-h2',10,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"Көп-көп рақмет, мерекеңізбен!","options":["Many thanks, happy holiday!","Thank you, goodbye!","Welcome!","Sorry, no.","Thanks."],"correctAns":"Many thanks, happy holiday!"}'::jsonb,'active','medium')
on conflict (id) do update set
  lesson_id=excluded.lesson_id, "order"=excluded."order",
  type=excluded.type, prompt=excluded.prompt, status=excluded.status, confidence=excluded.confidence;

-- ─── Unit 28 — Ертегі (Stories & Fairy tales) ──────────────────────────
insert into public.vocab (id, unit_id, native, english) values
  ('v-u28-ert', 'u28','ертегі','fairy tale'),
  ('v-u28-erте','u28','ертеде','long ago'),
  ('v-u28-bir-k','u28','бір күні','one day'),
  ('v-u28-kei', 'u28','кейіпкер','character'),
  ('v-u28-bas', 'u28','басы','beginning'),
  ('v-u28-soni','u28','соңы','ending'),
  ('v-u28-batyr','u28','батыр','hero / warrior'),
  ('v-u28-aldar','u28','Алдар Көсе','Aldar Köse (folk trickster)')
on conflict (id) do update set
  unit_id=excluded.unit_id, native=excluded.native, english=excluded.english;

insert into public.lessons (id, unit_id, "order", title_native, title_en, status) values
  ('u28-st1','u28',1,'Ертегі сөздері','Story vocabulary','active'),
  ('u28-st2','u28',2,'Әңгімелеу','Narrating a story','active')
on conflict (id) do update set
  unit_id=excluded.unit_id, "order"=excluded."order",
  title_native=excluded.title_native, title_en=excluded.title_en, status=excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status, confidence) values
  ('u28-st1-e1','u28-st1',1,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"ертегі","options":["fairy tale","novel","poem","news"],"correctAns":"fairy tale"}'::jsonb,'active','high'),
  ('u28-st1-e2','u28-st1',2,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"Ертеде бір батыр болыпты.","options":["Long ago there was a hero.","There is no hero.","One day a hero came.","The hero is brave."],"correctAns":"Long ago there was a hero."}'::jsonb,'active','medium'),
  ('u28-st1-e3','u28-st1',3,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"Бір күні жолға шықты.","options":["One day he set out on the road.","Every day he goes.","The road is long.","Where is the road?"],"correctAns":"One day he set out on the road."}'::jsonb,'active','medium'),
  ('u28-st1-e4','u28-st1',4,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"кейіпкер","options":["character","actor","singer","writer"],"correctAns":"character"}'::jsonb,'active','high'),
  ('u28-st1-e5','u28-st1',5,'LISTENING',
   '{"type":"LISTENING","audioKk":"Ертеде үш бауыр өмір сүріпті.","options":["Ертеде үш бауыр өмір сүріпті.","Бір күні үш бауыр келді.","Үш бауыр бар.","Үш бауыр кетті."],"correctAns":"Ертеде үш бауыр өмір сүріпті."}'::jsonb,'active','low'),
  ('u28-st1-e6','u28-st1',6,'MATCH_PAIRS',
   '{"type":"MATCH_PAIRS","pairs":[{"kazakh":"ертегі","english":"fairy tale"},{"kazakh":"ертеде","english":"long ago"},{"kazakh":"бір күні","english":"one day"},{"kazakh":"батыр","english":"hero"},{"kazakh":"кейіпкер","english":"character"}]}'::jsonb,'active','high'),
  ('u28-st1-e7','u28-st1',7,'TRANSLATE_EN_KK',
   '{"type":"TRANSLATE_EN_KK","promptEn":"Long ago there was a king.","tiles":["Ертеде","бір","хан","болыпты"],"correctAns":["Ертеде","бір","хан","болыпты"]}'::jsonb,'active','medium'),
  ('u28-st1-e8','u28-st1',8,'FILL_BLANK',
   '{"type":"FILL_BLANK","sentenceKkParts":["","үш бауыр өмір сүріпті."],"options":["Ертеде","Кеше","Ертең"],"correctAns":"Ертеде","hintEn":"Long ago three brothers lived."}'::jsonb,'active','medium'),
  ('u28-st1-e9','u28-st1',9,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"Ертегінің соңы жақсы.","options":["The ending of the story is good.","The story is sad.","I love stories.","The story is over."],"correctAns":"The ending of the story is good."}'::jsonb,'active','medium'),
  ('u28-st1-e10','u28-st1',10,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"Алдар Көсе — қазақ ертегісінің кейіпкері.","options":["Aldar Köse is a character of Kazakh fairy tales.","Aldar Köse is a real person.","Where is Aldar Köse?","He told a story."],"correctAns":"Aldar Köse is a character of Kazakh fairy tales."}'::jsonb,'active','medium'),

  ('u28-st2-e1','u28-st2',1,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"Сізге бір ертегі айтайын.","options":["Let me tell you a story.","I have a story.","Tell me a story.","I told a story."],"correctAns":"Let me tell you a story."}'::jsonb,'active','medium'),
  ('u28-st2-e2','u28-st2',2,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"Содан кейін батыр айдаһарды жеңді.","options":["Then the hero defeated the dragon.","The hero is a dragon.","Where is the hero?","The dragon won."],"correctAns":"Then the hero defeated the dragon."}'::jsonb,'active','medium'),
  ('u28-st2-e3','u28-st2',3,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"Олар бақытты өмір сүрді.","options":["They lived happily.","They were sad.","They are coming.","Where are they?"],"correctAns":"They lived happily."}'::jsonb,'active','medium'),
  ('u28-st2-e4','u28-st2',4,'LISTENING',
   '{"type":"LISTENING","audioKk":"Бір күні даладан бір қарт келді.","options":["Бір күні даладан бір қарт келді.","Қарт даладан кетті.","Дала үлкен.","Бір қарт бар."],"correctAns":"Бір күні даладан бір қарт келді."}'::jsonb,'active','low'),
  ('u28-st2-e5','u28-st2',5,'TRANSLATE_EN_KK',
   '{"type":"TRANSLATE_EN_KK","promptEn":"One day the hero set out on a journey.","tiles":["Бір","күні","батыр","сапарға","шықты"],"correctAns":["Бір","күні","батыр","сапарға","шықты"]}'::jsonb,'active','medium'),
  ('u28-st2-e6','u28-st2',6,'MATCH_PAIRS',
   '{"type":"MATCH_PAIRS","pairs":[{"kazakh":"болыпты","english":"there was (narrative past)"},{"kazakh":"айтыпты","english":"he said (reported)"},{"kazakh":"келді","english":"he came"},{"kazakh":"кетті","english":"he left"},{"kazakh":"соңында","english":"in the end"}]}'::jsonb,'active','medium'),
  ('u28-st2-e7','u28-st2',7,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"Содан кейін ел тыныш болды.","options":["After that the country became peaceful.","The country is at war.","Where is the country?","Peace is good."],"correctAns":"After that the country became peaceful."}'::jsonb,'active','low'),
  ('u28-st2-e8','u28-st2',8,'FILL_BLANK',
   '{"type":"FILL_BLANK","sentenceKkParts":["Олар үш күн жол ",""],"options":["жүрді","кетті","барды"],"correctAns":"жүрді","hintEn":"They traveled for three days."}'::jsonb,'active','medium'),
  ('u28-st2-e9','u28-st2',9,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"Ертегінің мағынасы — еңбек арқылы бақыт.","options":["The meaning of the story — happiness through work.","The story is short.","Work is hard.","Happiness is gone."],"correctAns":"The meaning of the story — happiness through work."}'::jsonb,'active','low'),
  ('u28-st2-e10','u28-st2',10,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"Сонымен, ертегіміз аяқталды.","options":["And so, our story has ended.","The story begins.","The story is long.","I love stories."],"correctAns":"And so, our story has ended."}'::jsonb,'active','medium')
on conflict (id) do update set
  lesson_id=excluded.lesson_id, "order"=excluded."order",
  type=excluded.type, prompt=excluded.prompt, status=excluded.status, confidence=excluded.confidence;

-- ─── Unit 29 — Музыка мен өнер (Music & Arts) ──────────────────────────
insert into public.vocab (id, unit_id, native, english) values
  ('v-u29-mus', 'u29','музыка','music'),
  ('v-u29-an',  'u29','ән','song'),
  ('v-u29-anshi','u29','әнші','singer'),
  ('v-u29-dom', 'u29','домбыра','dombra (Kazakh lute)'),
  ('v-u29-kui', 'u29','күй','instrumental piece'),
  ('v-u29-oner','u29','өнер','art'),
  ('v-u29-sur', 'u29','сурет','painting / picture'),
  ('v-u29-akin','u29','ақын','poet')
on conflict (id) do update set
  unit_id=excluded.unit_id, native=excluded.native, english=excluded.english;

insert into public.lessons (id, unit_id, "order", title_native, title_en, status) values
  ('u29-mu1','u29',1,'Музыкалық сөздер','Music vocabulary','active'),
  ('u29-mu2','u29',2,'Өнер туралы','About art','active')
on conflict (id) do update set
  unit_id=excluded.unit_id, "order"=excluded."order",
  title_native=excluded.title_native, title_en=excluded.title_en, status=excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status, confidence) values
  ('u29-mu1-e1','u29-mu1',1,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"музыка","options":["music","song","dance","art"],"correctAns":"music"}'::jsonb,'active','high'),
  ('u29-mu1-e2','u29-mu1',2,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"әнші","options":["singer","writer","poet","actor"],"correctAns":"singer"}'::jsonb,'active','high'),
  ('u29-mu1-e3','u29-mu1',3,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"домбыра","options":["dombra (Kazakh lute)","drum","piano","flute"],"correctAns":"dombra (Kazakh lute)"}'::jsonb,'active','high'),
  ('u29-mu1-e4','u29-mu1',4,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"күй","options":["instrumental piece","song","dance","melody"],"correctAns":"instrumental piece"}'::jsonb,'active','high'),
  ('u29-mu1-e5','u29-mu1',5,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"Мен қазақ музыкасын тыңдаймын.","options":["I listen to Kazakh music.","I sing Kazakh music.","Kazakh music is good.","I love music."],"correctAns":"I listen to Kazakh music."}'::jsonb,'active','medium'),
  ('u29-mu1-e6','u29-mu1',6,'LISTENING',
   '{"type":"LISTENING","audioKk":"Бұл ән маған өте ұнайды.","options":["Бұл ән маған өте ұнайды.","Бұл ән ұзақ.","Әншінің даусы жақсы.","Ән жаңа."],"correctAns":"Бұл ән маған өте ұнайды."}'::jsonb,'active','medium'),
  ('u29-mu1-e7','u29-mu1',7,'MATCH_PAIRS',
   '{"type":"MATCH_PAIRS","pairs":[{"kazakh":"музыка","english":"music"},{"kazakh":"ән","english":"song"},{"kazakh":"әнші","english":"singer"},{"kazakh":"домбыра","english":"dombra"},{"kazakh":"күй","english":"instrumental piece"}]}'::jsonb,'active','high'),
  ('u29-mu1-e8','u29-mu1',8,'TRANSLATE_EN_KK',
   '{"type":"TRANSLATE_EN_KK","promptEn":"This song is very beautiful.","tiles":["Бұл","ән","өте","әсем"],"correctAns":["Бұл","ән","өте","әсем"]}'::jsonb,'active','medium'),
  ('u29-mu1-e9','u29-mu1',9,'FILL_BLANK',
   '{"type":"FILL_BLANK","sentenceKkParts":["Маған қазақ ","ұнайды."],"options":["әні","ат","үй"],"correctAns":"әні","hintEn":"I like Kazakh songs."}'::jsonb,'active','medium'),
  ('u29-mu1-e10','u29-mu1',10,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"Құрманғазы — атақты күйші.","options":["Kurmangazy is a famous composer.","Kurmangazy is a singer.","Kurmangazy is a poet.","Kurmangazy is unknown."],"correctAns":"Kurmangazy is a famous composer."}'::jsonb,'active','medium'),

  ('u29-mu2-e1','u29-mu2',1,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"өнер","options":["art","music","song","dance"],"correctAns":"art"}'::jsonb,'active','high'),
  ('u29-mu2-e2','u29-mu2',2,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"сурет","options":["painting / picture","statue","photo","drawing"],"correctAns":"painting / picture"}'::jsonb,'active','high'),
  ('u29-mu2-e3','u29-mu2',3,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"ақын","options":["poet","writer","singer","artist"],"correctAns":"poet"}'::jsonb,'active','high'),
  ('u29-mu2-e4','u29-mu2',4,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"Абай — ұлы ақын.","options":["Abai is a great poet.","Abai is a singer.","Abai is unknown.","Abai is here."],"correctAns":"Abai is a great poet."}'::jsonb,'active','high'),
  ('u29-mu2-e5','u29-mu2',5,'LISTENING',
   '{"type":"LISTENING","audioKk":"Өнер — өмірдің сұлулығы.","options":["Өнер — өмірдің сұлулығы.","Өнер қиын.","Өнерсіз өмір.","Өнер бар."],"correctAns":"Өнер — өмірдің сұлулығы."}'::jsonb,'active','low'),
  ('u29-mu2-e6','u29-mu2',6,'TRANSLATE_EN_KK',
   '{"type":"TRANSLATE_EN_KK","promptEn":"I love painting.","tiles":["Мен","сурет","салғанды","жақсы","көрем"],"correctAns":["Мен","сурет","салғанды","жақсы","көрем"]}'::jsonb,'active','medium'),
  ('u29-mu2-e7','u29-mu2',7,'MATCH_PAIRS',
   '{"type":"MATCH_PAIRS","pairs":[{"kazakh":"өнер","english":"art"},{"kazakh":"сурет","english":"painting"},{"kazakh":"ақын","english":"poet"},{"kazakh":"жазушы","english":"writer"},{"kazakh":"театр","english":"theatre"}]}'::jsonb,'active','high'),
  ('u29-mu2-e8','u29-mu2',8,'FILL_BLANK',
   '{"type":"FILL_BLANK","sentenceKkParts":["Абай — қазақтың ұлы ",""],"options":["ақыны","әншісі","биші"],"correctAns":"ақыны","hintEn":"Abai is the great Kazakh poet."}'::jsonb,'active','medium'),
  ('u29-mu2-e9','u29-mu2',9,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"Музыка мен өнер — мәдениеттің бөлігі.","options":["Music and art are parts of culture.","Music is good.","Art is beautiful.","Culture is here."],"correctAns":"Music and art are parts of culture."}'::jsonb,'active','medium'),
  ('u29-mu2-e10','u29-mu2',10,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"Мен театрға баруды ұнатамын.","options":["I like going to the theatre.","I am at the theatre.","I went to the theatre.","I love theatres."],"correctAns":"I like going to the theatre."}'::jsonb,'active','medium')
on conflict (id) do update set
  lesson_id=excluded.lesson_id, "order"=excluded."order",
  type=excluded.type, prompt=excluded.prompt, status=excluded.status, confidence=excluded.confidence;

-- ─── Unit 30 — Дала тарихы (Steppe history, cultural) ──────────────────
insert into public.vocab (id, unit_id, native, english) values
  ('v-u30-dala','u30','дала','steppe'),
  ('v-u30-kos', 'u30','көшпенді','nomad'),
  ('v-u30-ult', 'u30','ұлт','nation'),
  ('v-u30-tar', 'u30','тарих','history'),
  ('v-u30-bir', 'u30','бірлік','unity'),
  ('v-u30-han', 'u30','хан','khan'),
  ('v-u30-ata-jurt','u30','атажұрт','homeland'),
  ('v-u30-dast','u30','дәстүр','tradition')
on conflict (id) do update set
  unit_id=excluded.unit_id, native=excluded.native, english=excluded.english;

insert into public.lessons (id, unit_id, "order", title_native, title_en, status) values
  ('u30-h1','u30',1,'Тарихи сөздер','Historical vocabulary','active'),
  ('u30-h2','u30',2,'Қазақ хандығы','The Kazakh Khanate','active')
on conflict (id) do update set
  unit_id=excluded.unit_id, "order"=excluded."order",
  title_native=excluded.title_native, title_en=excluded.title_en, status=excluded.status;

insert into public.exercises (id, lesson_id, "order", type, prompt, status, confidence) values
  ('u30-h1-e1','u30-h1',1,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"дала","options":["steppe","forest","mountain","river"],"correctAns":"steppe"}'::jsonb,'active','high'),
  ('u30-h1-e2','u30-h1',2,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"көшпенді","options":["nomad","farmer","city dweller","traveler"],"correctAns":"nomad"}'::jsonb,'active','high'),
  ('u30-h1-e3','u30-h1',3,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"тарих","options":["history","story","culture","time"],"correctAns":"history"}'::jsonb,'active','high'),
  ('u30-h1-e4','u30-h1',4,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"бірлік","options":["unity","disagreement","friendship","family"],"correctAns":"unity"}'::jsonb,'active','high'),
  ('u30-h1-e5','u30-h1',5,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"дәстүр","options":["tradition","modern life","custom","habit"],"correctAns":"tradition"}'::jsonb,'active','high'),
  ('u30-h1-e6','u30-h1',6,'LISTENING',
   '{"type":"LISTENING","audioKk":"Қазақ халқы — көшпенділер.","options":["Қазақ халқы — көшпенділер.","Қазақ халқы — қалалықтар.","Көшпенді жоқ.","Көшпенді тарихы."],"correctAns":"Қазақ халқы — көшпенділер."}'::jsonb,'active','medium'),
  ('u30-h1-e7','u30-h1',7,'MATCH_PAIRS',
   '{"type":"MATCH_PAIRS","pairs":[{"kazakh":"дала","english":"steppe"},{"kazakh":"көшпенді","english":"nomad"},{"kazakh":"тарих","english":"history"},{"kazakh":"бірлік","english":"unity"},{"kazakh":"дәстүр","english":"tradition"}]}'::jsonb,'active','high'),
  ('u30-h1-e8','u30-h1',8,'TRANSLATE_EN_KK',
   '{"type":"TRANSLATE_EN_KK","promptEn":"The Kazakh steppe is huge.","tiles":["Қазақ","даласы","үлкен","кіші"],"correctAns":["Қазақ","даласы","үлкен"]}'::jsonb,'active','medium'),
  ('u30-h1-e9','u30-h1',9,'FILL_BLANK',
   '{"type":"FILL_BLANK","sentenceKkParts":["Қазақтар — Ұлы ","халқы."],"options":["даланың","қаланың","жердің"],"correctAns":"даланың","hintEn":"Kazakhs are the people of the Great Steppe."}'::jsonb,'active','medium'),
  ('u30-h1-e10','u30-h1',10,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"Тарихымызды құрметтейміз.","options":["We respect our history.","We forgot history.","History is past.","Where is history?"],"correctAns":"We respect our history."}'::jsonb,'active','medium'),

  ('u30-h2-e1','u30-h2',1,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"Қазақ хандығы 1465 жылы құрылды.","options":["The Kazakh Khanate was founded in 1465.","Kazakhstan is old.","Khanate is gone.","Independence in 1991."],"correctAns":"The Kazakh Khanate was founded in 1465."}'::jsonb,'active','medium'),
  ('u30-h2-e2','u30-h2',2,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"Керей мен Жәнібек хандар хандықтың негізін салды.","options":["Kerei and Janibek khans founded the Khanate.","Kerei is a city.","Khans are heroes.","Janibek is a poet."],"correctAns":"Kerei and Janibek khans founded the Khanate."}'::jsonb,'active','low'),
  ('u30-h2-e3','u30-h2',3,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"Атажұртымызды құрметтейміз.","options":["We honour our homeland.","Our homeland is gone.","Where is our homeland?","We forgot homeland."],"correctAns":"We honour our homeland."}'::jsonb,'active','medium'),
  ('u30-h2-e4','u30-h2',4,'LISTENING',
   '{"type":"LISTENING","audioKk":"Бірлік — қазақ халқының күші.","options":["Бірлік — қазақ халқының күші.","Бірлік жоқ.","Бірлік керек.","Күш бар."],"correctAns":"Бірлік — қазақ халқының күші."}'::jsonb,'active','low'),
  ('u30-h2-e5','u30-h2',5,'TRANSLATE_EN_KK',
   '{"type":"TRANSLATE_EN_KK","promptEn":"We honour our ancestors and traditions.","tiles":["Біз","ата-бабаларымыз","бен","дәстүрімізді","құрметтейміз"],"correctAns":["Біз","ата-бабаларымыз","бен","дәстүрімізді","құрметтейміз"]}'::jsonb,'active','low'),
  ('u30-h2-e6','u30-h2',6,'MATCH_PAIRS',
   '{"type":"MATCH_PAIRS","pairs":[{"kazakh":"хан","english":"khan"},{"kazakh":"хандық","english":"khanate"},{"kazakh":"тәуелсіздік","english":"independence"},{"kazakh":"атажұрт","english":"homeland"},{"kazakh":"бірлік","english":"unity"}]}'::jsonb,'active','high'),
  ('u30-h2-e7','u30-h2',7,'FILL_BLANK',
   '{"type":"FILL_BLANK","sentenceKkParts":["Біздің "," — Қазақстан."],"options":["атажұртымыз","қаламыз","үйіміз"],"correctAns":"атажұртымыз","hintEn":"Our homeland is Kazakhstan."}'::jsonb,'active','medium'),
  ('u30-h2-e8','u30-h2',8,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"Тарих — болашақтың айнасы.","options":["History is the mirror of the future.","History is over.","Future is unknown.","Mirror is old."],"correctAns":"History is the mirror of the future."}'::jsonb,'active','low'),
  ('u30-h2-e9','u30-h2',9,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"Қазақстан 1991 жылы тәуелсіздік алды.","options":["Kazakhstan gained independence in 1991.","Kazakhstan is old.","Kazakhstan is here.","Independence is freedom."],"correctAns":"Kazakhstan gained independence in 1991."}'::jsonb,'active','medium'),
  ('u30-h2-e10','u30-h2',10,'TRANSLATE_KK_EN',
   '{"type":"TRANSLATE_KK_EN","promptKk":"Менің Отаным — Қазақстан.","options":["My homeland is Kazakhstan.","I am from Kazakhstan.","Where is my homeland?","Kazakhstan is big."],"correctAns":"My homeland is Kazakhstan."}'::jsonb,'active','high')
on conflict (id) do update set
  lesson_id=excluded.lesson_id, "order"=excluded."order",
  type=excluded.type, prompt=excluded.prompt, status=excluded.status, confidence=excluded.confidence;

-- ─── Activate Units 25-30 (each has 2 sample lessons, more for translator) ───
update public.units set status='active' where id in ('u25','u26','u27','u28','u29','u30');
