-- Berkut v1.5 — B1.2 + B2 outlines (Units 31-40).
-- Idempotent. Inserts vocab + cultural notes; NO lessons or exercises.
-- These units stay status='draft' until a Kazakh translator (role='content_editor')
-- authors lessons via /admin/content and flips them to 'active'.

-- ─── Cultural notes for B1.2 + B2 units ─────────────────────────────────
update public.units set cultural_note =
  'Қазақ тіліндегі модальдықтар — субъектінің қалауын, мүмкіндігін, міндетін бейнелейді. «-уға тура келу» (must), «-уға болады» (may), «мүмкін» (maybe) — ең жиі қолданылатын модалдық тіркестер.'
where id='u31';

update public.units set cultural_note =
  'Қазақстанның бұқаралық ақпарат құралдары — Тенгриньюс, Хабар, Қазинформ — қазақ тілінде жаңалықтар таратады. Жаңалықтар тілі ресми реестрге жатады: пассив дауыс (-ыл/-іл), формальды лексика, абстрактты атау сөздер басым.'
where id='u32';

update public.units set cultural_note =
  'Технологиялық лексика қазақ тіліне көбіне орыс және ағылшын тілдерінен енген. Соңғы жылдары қазақ тілінде технологиялық терминдер жасау белсенді жүргізіліп жатыр: компьютер — есептегіш, интернет — ғаламтор, файл — деректеме (кейбір нұсқалар).'
where id='u33';

update public.units set cultural_note =
  '«Айтты деп» (he said that) — қазақ тіліндегі жанама сөйлеу формасы. Бұл тіркес тыңдау, дауыс және айтылым көздерін көрсету үшін қолданылады. Журналистер мен жазушылар үшін негізгі құрал.'
where id='u34';

update public.units set cultural_note =
  'Абай Құнанбайұлы (1845-1904) — қазақ халқының ұлы ақыны, философы, ағартушысы. «Қара сөздер» (Words of Edification) — оның 45 қарасөзден тұратын философиялық еңбегі. Абайдың аудармалары арқылы қазақ оқырманы Пушкин, Лермонтов, Гёте шығармаларымен танысты.'
where id='u35';

update public.units set cultural_note =
  '«-са еді» (if only …) — тілек, шартты сөйлемнің күшейтілген түрі. Мысалы: «уақытым болса еді» (if only I had time). B2 деңгейіндегі сөйлеуде жиі қолданылады.'
where id='u36';

update public.units set cultural_note =
  'Қазақстанның қоғамдық-саяси лексикасы соңғы 30 жыл бойы қалыптасты. «Демократия», «парламент», «партия» — кірме сөздер; «ел», «халық», «үкімет» — байырғы қазақ сөздері. Абстрактты атаулар жасау үшін «-лық/-лік» жұрнағы белсенді.'
where id='u37';

update public.units set cultural_note =
  'Талдау мен пікірталас — B2-C1 деңгейіндегі ең күрделі сөйлеу мақсаттары. Күрделі бағыныңқы сөйлемдер (қатынасты, шартты, мақсат), дәйектемелер, қарама-қарсылықты жалғаулықтар (бірақ, алайда, дегенмен) — қажетті құралдар.'
where id='u38';

update public.units set cultural_note =
  'Қазақ мақал-мәтелдері мен идиомалары — ұлттық даналық қазынасы. «Жеті атасын білмеген — жетесіз» (one who doesn''t know seven generations is a fool); «Бір қарын майды бір құмалақ шірітеді» (one droplet spoils the whole churn). Ауызекі сөйлесуде сирек, бірақ әдеби тілде орны зор.'
where id='u39';

update public.units set cultural_note =
  'Қазіргі Қазақстан — Орталық Азияның экономикалық көшбасшысы, көп ұлтты мемлекет, латиницаға көшу үрдісінде. 2050 стратегиясы, EXPO-2017, Астанадан Нұр-Сұлтанға, кейін қайта Астанаға атау өзгерту, кириллицадан латиницаға ауысу — соңғы 15 жылдың ірі тарихи оқиғалары.'
where id='u40';

-- ─── Vocab outlines for the translator queue ────────────────────────────
-- ~10 high-frequency vocab per unit; translator adds more during lesson authoring.

-- Unit 31 — Модальдықтар
insert into public.vocab (id, unit_id, native, english) values
  ('v-u31-bol','u31','болады','it''s possible / one may'),
  ('v-u31-tu', 'u31','тура келеді','must / has to'),
  ('v-u31-mu', 'u31','мүмкін','maybe / possible'),
  ('v-u31-jok','u31','болмайды','it''s not allowed'),
  ('v-u31-ker','u31','керек','need'),
  ('v-u31-mu-em','u31','мүмкін емес','impossible'),
  ('v-u31-tile','u31','тілейтін','desired'),
  ('v-u31-tab', 'u31','табысты','successful')
on conflict (id) do update set unit_id=excluded.unit_id, native=excluded.native, english=excluded.english;

-- Unit 32 — Жаңалықтар
insert into public.vocab (id, unit_id, native, english) values
  ('v-u32-jan','u32','жаңалық','news'),
  ('v-u32-bas','u32','басылым','publication'),
  ('v-u32-jur','u32','журналист','journalist'),
  ('v-u32-mak','u32','мақала','article'),
  ('v-u32-okiy','u32','оқиға','event'),
  ('v-u32-tabu','u32','табу','to find / report'),
  ('v-u32-jar', 'u32','жарияланды','was published'),
  ('v-u32-mes', 'u32','мәлімдеді','announced')
on conflict (id) do update set unit_id=excluded.unit_id, native=excluded.native, english=excluded.english;

-- Unit 33 — Технология
insert into public.vocab (id, unit_id, native, english) values
  ('v-u33-tech','u33','технология','technology'),
  ('v-u33-comp','u33','компьютер','computer'),
  ('v-u33-int', 'u33','интернет','internet'),
  ('v-u33-tel', 'u33','телефон','phone'),
  ('v-u33-prog','u33','бағдарлама','program / app'),
  ('v-u33-sait','u33','сайт','website'),
  ('v-u33-elek','u33','электрондық пошта','email'),
  ('v-u33-zara','u33','зарядтау','to charge')
on conflict (id) do update set unit_id=excluded.unit_id, native=excluded.native, english=excluded.english;

-- Unit 34 — Айтты деп
insert into public.vocab (id, unit_id, native, english) values
  ('v-u34-aitt','u34','айтты','he/she said'),
  ('v-u34-dep', 'u34','деп','saying that'),
  ('v-u34-est', 'u34','естідім','I heard'),
  ('v-u34-aitk','u34','айтқан','what was said'),
  ('v-u34-tus', 'u34','түсіндім','I understood'),
  ('v-u34-jet', 'u34','жеткізді','conveyed / passed on'),
  ('v-u34-souz','u34','сұрады','asked')
on conflict (id) do update set unit_id=excluded.unit_id, native=excluded.native, english=excluded.english;

-- Unit 35 — Абай
insert into public.vocab (id, unit_id, native, english) values
  ('v-u35-aba', 'u35','Абай','Abai'),
  ('v-u35-aki', 'u35','ақын','poet'),
  ('v-u35-soz', 'u35','қара сөз','prose meditation (Abai)'),
  ('v-u35-onege','u35','өнеге','example / moral'),
  ('v-u35-til', 'u35','тіл','tongue / language'),
  ('v-u35-em',  'u35','еміренген','feeling deeply'),
  ('v-u35-eng', 'u35','еңбек','work / labour'),
  ('v-u35-akıl','u35','ақыл','wisdom / intellect')
on conflict (id) do update set unit_id=excluded.unit_id, native=excluded.native, english=excluded.english;

-- Unit 36 — Армандар (Subjunctive)
insert into public.vocab (id, unit_id, native, english) values
  ('v-u36-arm', 'u36','арман','dream / wish'),
  ('v-u36-tile','u36','тілейтінмін','I would wish'),
  ('v-u36-bols-e','u36','болса еді','if only it were'),
  ('v-u36-ka', 'u36','қап','alas (regret particle)'),
  ('v-u36-bar', 'u36','бар болса','if there were'),
  ('v-u36-bar-jok','u36','болмаса','if not'),
  ('v-u36-isi', 'u36','істесем','if I did')
on conflict (id) do update set unit_id=excluded.unit_id, native=excluded.native, english=excluded.english;

-- Unit 37 — Қоғам мен саясат
insert into public.vocab (id, unit_id, native, english) values
  ('v-u37-koh', 'u37','қоғам','society'),
  ('v-u37-say', 'u37','саясат','politics'),
  ('v-u37-uki', 'u37','үкімет','government'),
  ('v-u37-par', 'u37','парламент','parliament'),
  ('v-u37-pre', 'u37','президент','president'),
  ('v-u37-dem', 'u37','демократия','democracy'),
  ('v-u37-haly','u37','халық','people'),
  ('v-u37-el',  'u37','ел','country / people'),
  ('v-u37-zang','u37','заң','law'),
  ('v-u37-saily','u37','сайлау','election')
on conflict (id) do update set unit_id=excluded.unit_id, native=excluded.native, english=excluded.english;

-- Unit 38 — Талдау
insert into public.vocab (id, unit_id, native, english) values
  ('v-u38-tal', 'u38','талдау','analysis'),
  ('v-u38-pikir','u38','пікірталас','debate'),
  ('v-u38-bir', 'u38','бірақ','but'),
  ('v-u38-al',  'u38','алайда','however'),
  ('v-u38-dege','u38','дегенмен','nevertheless'),
  ('v-u38-soni','u38','сонымен','thus'),
  ('v-u38-os',  'u38','осыдан','from this'),
  ('v-u38-jary','u38','жарықтасу','to illuminate / clarify'),
  ('v-u38-jaks','u38','жақтаймын','I support / defend'),
  ('v-u38-qars','u38','қарсы','against')
on conflict (id) do update set unit_id=excluded.unit_id, native=excluded.native, english=excluded.english;

-- Unit 39 — Идиомалар
insert into public.vocab (id, unit_id, native, english) values
  ('v-u39-mak', 'u39','мақал','proverb'),
  ('v-u39-soz-tirк','u39','сөз тіркесі','set phrase'),
  ('v-u39-ide', 'u39','идиома','idiom'),
  ('v-u39-jeti-ata','u39','жеті ата','seven generations'),
  ('v-u39-bata','u39','бата','blessing'),
  ('v-u39-makal-1','u39','«Бір қарын майды бір құмалақ шірітеді»','one droplet spoils the churn'),
  ('v-u39-makal-2','u39','«Жеті атасын білмеген — жетесіз»','one who doesn''t know seven generations is foolish'),
  ('v-u39-makal-3','u39','«Дос басқа, дұшпан аяққа қарайды»','a friend looks at the head; an enemy at the foot')
on conflict (id) do update set unit_id=excluded.unit_id, native=excluded.native, english=excluded.english;

-- Unit 40 — Қазіргі Қазақстан
insert into public.vocab (id, unit_id, native, english) values
  ('v-u40-kaz', 'u40','Қазақстан','Kazakhstan'),
  ('v-u40-tau', 'u40','Тәуелсіздік','Independence'),
  ('v-u40-lat', 'u40','латиница','Latin script'),
  ('v-u40-kir', 'u40','кириллица','Cyrillic script'),
  ('v-u40-eko', 'u40','экономика','economy'),
  ('v-u40-stra','u40','стратегия','strategy'),
  ('v-u40-ulttyk','u40','ұлттық','national'),
  ('v-u40-zaman','u40','заманауи','modern'),
  ('v-u40-ast', 'u40','Астана','Astana'),
  ('v-u40-alm', 'u40','Алматы','Almaty')
on conflict (id) do update set unit_id=excluded.unit_id, native=excluded.native, english=excluded.english;

-- Units stay status='draft' until translator completes lessons. No update to status.
