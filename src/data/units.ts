import type { Unit } from "@/lib/types";

export const UNITS: Unit[] = [
  {
    id: 1, order: 1, titleKk: "Сәлем!", titleEn: "Hello!", cefrLevel: "A1",
    culturalNote: "Kazakh culture places great importance on greetings. When meeting someone, especially elders, it is customary to greet them warmly. The phrase \"Ассалаумағалейкум\" is a formal greeting showing deep respect. Younger people always initiate greetings with elders as a sign of courtesy.",
    lessons: [
      {
        id: 101, order: 1, titleKk: "Сәлемдесу", titleEn: "Greetings",
        vocab: [
          { id: "v101", kazakh: "сәлем", english: "hello (informal)", example: "Сәлем, қалың қалай?" },
          { id: "v102", kazakh: "сәлеметсіз бе", english: "hello (formal)", example: "Сәлеметсіз бе, ұстаз!" },
          { id: "v103", kazakh: "қайырлы таң", english: "good morning", example: "Қайырлы таң, ана!" },
          { id: "v104", kazakh: "қайырлы кеш", english: "good evening", example: "Қайырлы кеш, достар!" },
          { id: "v105", kazakh: "сау бол", english: "goodbye (informal)", example: "Сау бол, кейін кездесеміз!" },
          { id: "v106", kazakh: "қош бол", english: "farewell", example: "Қош бол, досым!" },
        ],
        exercises: [
          { id: "e101", type: "MULTIPLE_CHOICE", prompt: { text: 'What does "сәлем" mean?' }, options: ["Hello", "Goodbye", "Thank you", "Please"], correctAns: "Hello" },
          { id: "e102", type: "TRANSLATE_EN_KK", prompt: { text: "Hello (informal)" }, correctAns: "сәлем", tiles: ["сәлем", "сау", "бол", "қайырлы"] },
          { id: "e103", type: "MULTIPLE_CHOICE", prompt: { text: "Which greeting is formal?" }, options: ["сәлем", "сәлеметсіз бе", "сау бол", "қайырлы таң"], correctAns: "сәлеметсіз бе" },
          { id: "e104", type: "TRANSLATE_KK_EN", prompt: { text: "қайырлы таң" }, options: ["Good evening", "Good morning", "Good night", "Hello"], correctAns: "Good morning" },
          { id: "e105", type: "FILL_BLANK", prompt: { text: "Қайырлы ___, ана!", hint: "morning" }, options: ["таң", "кеш", "түн", "күн"], correctAns: "таң" },
          { id: "e106", type: "MATCH_PAIRS", prompt: { pairs: [["сәлем", "hello"], ["сау бол", "goodbye"], ["қайырлы таң", "good morning"], ["қош бол", "farewell"]] }, correctAns: null },
          { id: "e107", type: "MULTIPLE_CHOICE", prompt: { text: 'What does "сау бол" mean?' }, options: ["Good morning", "How are you?", "Goodbye", "Thank you"], correctAns: "Goodbye" },
          { id: "e108", type: "TRANSLATE_EN_KK", prompt: { text: "Good evening" }, correctAns: "қайырлы кеш", tiles: ["қайырлы", "кеш", "таң", "сәлем"] },
          { id: "e109", type: "FILL_BLANK", prompt: { text: "___ бол, досым!", hint: "farewell" }, options: ["Қош", "Сау", "Сәлем", "Қайырлы"], correctAns: "Қош" },
          { id: "e110", type: "MULTIPLE_CHOICE", prompt: { text: '"Қайырлы кеш" is said when?' }, options: ["Morning", "Afternoon", "Evening", "Night"], correctAns: "Evening" },
          { id: "e111", type: "TRANSLATE_KK_EN", prompt: { text: "сәлеметсіз бе" }, options: ["Hello (formal)", "Goodbye", "Good morning", "Thank you"], correctAns: "Hello (formal)" },
          { id: "e112", type: "TRANSLATE_EN_KK", prompt: { text: "Goodbye (informal)" }, correctAns: "сау бол", tiles: ["сау", "бол", "қош", "сәлем"] },
        ],
      },
      {
        id: 102, order: 2, titleKk: "Өзіңді таныстыр", titleEn: "Introduce Yourself",
        vocab: [
          { id: "v111", kazakh: "менің атым", english: "my name is", example: "Менің атым Айгүл." },
          { id: "v112", kazakh: "мен", english: "I / me", example: "Мен студентпін." },
          { id: "v113", kazakh: "сен", english: "you (informal)", example: "Сен кімсің?" },
          { id: "v114", kazakh: "сіз", english: "you (formal)", example: "Сіз кімсіз?" },
          { id: "v115", kazakh: "иә", english: "yes", example: "Иә, мен студентпін." },
          { id: "v116", kazakh: "жоқ", english: "no", example: "Жоқ, мен мұғалім емеспін." },
        ],
        exercises: [
          { id: "e201", type: "MULTIPLE_CHOICE", prompt: { text: 'How do you say "My name is" in Kazakh?' }, options: ["менің атым", "сенің атың", "оның аты", "біздің атымыз"], correctAns: "менің атым" },
          { id: "e202", type: "TRANSLATE_EN_KK", prompt: { text: "I am a student" }, correctAns: "мен студентпін", tiles: ["мен", "студентпін", "сен", "мұғалім"] },
          { id: "e203", type: "MULTIPLE_CHOICE", prompt: { text: '"Сіз" is the ___ form of "you"' }, options: ["informal", "formal", "plural", "negative"], correctAns: "formal" },
          { id: "e204", type: "FILL_BLANK", prompt: { text: "___ атым Болат.", hint: "My" }, options: ["Менің", "Сенің", "Оның", "Біздің"], correctAns: "Менің" },
          { id: "e205", type: "TRANSLATE_KK_EN", prompt: { text: "иә" }, options: ["Yes", "No", "Maybe", "Hello"], correctAns: "Yes" },
          { id: "e206", type: "MATCH_PAIRS", prompt: { pairs: [["мен", "I"], ["сен", "you (informal)"], ["сіз", "you (formal)"], ["иә", "yes"]] }, correctAns: null },
          { id: "e207", type: "MULTIPLE_CHOICE", prompt: { text: 'What does "жоқ" mean?' }, options: ["Yes", "No", "Maybe", "Please"], correctAns: "No" },
          { id: "e208", type: "TRANSLATE_EN_KK", prompt: { text: "You (formal)" }, correctAns: "сіз", tiles: ["сіз", "сен", "мен", "ол"] },
          { id: "e209", type: "FILL_BLANK", prompt: { text: "___, мен студентпін.", hint: "Yes" }, options: ["Иә", "Жоқ", "Сәлем", "Сау"], correctAns: "Иә" },
          { id: "e210", type: "TRANSLATE_KK_EN", prompt: { text: "Менің атым Болат" }, options: ["My name is Bolat", "Your name is Bolat", "His name is Bolat", "I am Bolat"], correctAns: "My name is Bolat" },
          { id: "e211", type: "MULTIPLE_CHOICE", prompt: { text: 'Which means "you" informally?' }, options: ["мен", "сіз", "сен", "ол"], correctAns: "сен" },
          { id: "e212", type: "TRANSLATE_EN_KK", prompt: { text: "No" }, correctAns: "жоқ", tiles: ["жоқ", "иә", "бол", "сен"] },
        ],
      },
      {
        id: 103, order: 3, titleKk: "Сандар", titleEn: "Numbers 1-10",
        vocab: [
          { id: "v121", kazakh: "бір", english: "one", example: "Бір алма бер." },
          { id: "v122", kazakh: "екі", english: "two", example: "Екі кітап." },
          { id: "v123", kazakh: "үш", english: "three", example: "Үш бала." },
          { id: "v124", kazakh: "төрт", english: "four", example: "Төрт мысық." },
          { id: "v125", kazakh: "бес", english: "five", example: "Бес саусақ." },
          { id: "v126", kazakh: "алты", english: "six" },
          { id: "v127", kazakh: "жеті", english: "seven" },
          { id: "v128", kazakh: "сегіз", english: "eight" },
          { id: "v129", kazakh: "тоғыз", english: "nine" },
          { id: "v130", kazakh: "он", english: "ten" },
        ],
        exercises: [
          { id: "e301", type: "MULTIPLE_CHOICE", prompt: { text: 'What is "бір" in English?' }, options: ["One", "Two", "Three", "Four"], correctAns: "One" },
          { id: "e302", type: "TRANSLATE_EN_KK", prompt: { text: "Five" }, correctAns: "бес", tiles: ["бес", "бір", "екі", "үш"] },
          { id: "e303", type: "MATCH_PAIRS", prompt: { pairs: [["бір", "one"], ["екі", "two"], ["үш", "three"], ["төрт", "four"], ["бес", "five"]] }, correctAns: null },
          { id: "e304", type: "MULTIPLE_CHOICE", prompt: { text: 'What number is "жеті"?' }, options: ["5", "6", "7", "8"], correctAns: "7" },
          { id: "e305", type: "TRANSLATE_KK_EN", prompt: { text: "он" }, options: ["Eight", "Nine", "Ten", "Seven"], correctAns: "Ten" },
          { id: "e306", type: "FILL_BLANK", prompt: { text: "бір, екі, ___, төрт", hint: "three" }, options: ["үш", "бес", "алты", "жеті"], correctAns: "үш" },
          { id: "e307", type: "MULTIPLE_CHOICE", prompt: { text: 'Which is "eight"?' }, options: ["алты", "жеті", "сегіз", "тоғыз"], correctAns: "сегіз" },
          { id: "e308", type: "TRANSLATE_EN_KK", prompt: { text: "Nine" }, correctAns: "тоғыз", tiles: ["тоғыз", "сегіз", "жеті", "он"] },
          { id: "e309", type: "MULTIPLE_CHOICE", prompt: { text: '"Алты" means...' }, options: ["Four", "Five", "Six", "Seven"], correctAns: "Six" },
          { id: "e310", type: "TRANSLATE_KK_EN", prompt: { text: "екі" }, options: ["One", "Two", "Three", "Ten"], correctAns: "Two" },
          { id: "e311", type: "FILL_BLANK", prompt: { text: "алты, жеті, сегіз, ___", hint: "nine" }, options: ["тоғыз", "он", "бес", "бір"], correctAns: "тоғыз" },
          { id: "e312", type: "TRANSLATE_EN_KK", prompt: { text: "Four" }, correctAns: "төрт", tiles: ["төрт", "бір", "он", "алты"] },
        ],
      },
      {
        id: 104, order: 4, titleKk: "Алғашқы сөздер", titleEn: "First Words",
        vocab: [
          { id: "v131", kazakh: "рақмет", english: "thank you" },
          { id: "v132", kazakh: "кешіріңіз", english: "excuse me / sorry" },
          { id: "v133", kazakh: "өтінемін", english: "please" },
          { id: "v134", kazakh: "жақсы", english: "good / well" },
          { id: "v135", kazakh: "жаман", english: "bad" },
          { id: "v136", kazakh: "үлкен", english: "big" },
        ],
        exercises: [
          { id: "e401", type: "MULTIPLE_CHOICE", prompt: { text: '"Рақмет" means...' }, options: ["Thank you", "Please", "Sorry", "Hello"], correctAns: "Thank you" },
          { id: "e402", type: "TRANSLATE_EN_KK", prompt: { text: "Please" }, correctAns: "өтінемін", tiles: ["өтінемін", "рақмет", "кешіріңіз", "жақсы"] },
          { id: "e403", type: "MATCH_PAIRS", prompt: { pairs: [["рақмет", "thank you"], ["кешіріңіз", "sorry"], ["жақсы", "good"], ["жаман", "bad"]] }, correctAns: null },
          { id: "e404", type: "FILL_BLANK", prompt: { text: "___, мен кеш қалдым.", hint: "Sorry" }, options: ["Кешіріңіз", "Рақмет", "Сәлем", "Жақсы"], correctAns: "Кешіріңіз" },
          { id: "e405", type: "TRANSLATE_KK_EN", prompt: { text: "жақсы" }, options: ["Bad", "Good", "Big", "Small"], correctAns: "Good" },
          { id: "e406", type: "MULTIPLE_CHOICE", prompt: { text: 'The opposite of "жақсы" is...' }, options: ["жаман", "үлкен", "кіші", "жаңа"], correctAns: "жаман" },
          { id: "e407", type: "TRANSLATE_EN_KK", prompt: { text: "Big" }, correctAns: "үлкен", tiles: ["үлкен", "кіші", "жақсы", "жаман"] },
          { id: "e408", type: "MULTIPLE_CHOICE", prompt: { text: '"Кешіріңіз" is used to...' }, options: ["say hello", "apologize", "say goodbye", "give thanks"], correctAns: "apologize" },
          { id: "e409", type: "TRANSLATE_KK_EN", prompt: { text: "рақмет" }, options: ["Please", "Thank you", "Yes", "Sorry"], correctAns: "Thank you" },
          { id: "e410", type: "FILL_BLANK", prompt: { text: "___, бір шай беріңізші.", hint: "Please" }, options: ["Өтінемін", "Рақмет", "Сәлем", "Иә"], correctAns: "Өтінемін" },
          { id: "e411", type: "TRANSLATE_EN_KK", prompt: { text: "Thank you" }, correctAns: "рақмет", tiles: ["рақмет", "өтінемін", "жақсы", "сәлем"] },
          { id: "e412", type: "MULTIPLE_CHOICE", prompt: { text: '"Үлкен" means...' }, options: ["Small", "Good", "Big", "Bad"], correctAns: "Big" },
        ],
      },
    ],
  },
  {
    id: 2, order: 2, titleKk: "Менің отбасым", titleEn: "My Family", cefrLevel: "A1",
    culturalNote: "Family (отбасы) is at the heart of Kazakh culture. Respect for elders is deeply ingrained — younger people always greet elders first and use the formal \"Сіз\". Extended families often live together or nearby, and family gatherings are central to social life.",
    lessons: [
      {
        id: 201, order: 1, titleKk: "Отбасы мүшелері", titleEn: "Family Members",
        vocab: [
          { id: "v201", kazakh: "ана", english: "mother" },
          { id: "v202", kazakh: "әке", english: "father" },
          { id: "v203", kazakh: "аға", english: "older brother" },
          { id: "v204", kazakh: "апа", english: "older sister / grandmother" },
          { id: "v205", kazakh: "іні", english: "younger brother (of a male)" },
          { id: "v206", kazakh: "сіңлі", english: "younger sister (of a female)" },
        ],
        exercises: [
          { id: "e501", type: "MULTIPLE_CHOICE", prompt: { text: '"Ана" means...' }, options: ["Father", "Mother", "Brother", "Sister"], correctAns: "Mother" },
          { id: "e502", type: "TRANSLATE_EN_KK", prompt: { text: "Father" }, correctAns: "әке", tiles: ["әке", "ана", "аға", "апа"] },
          { id: "e503", type: "MATCH_PAIRS", prompt: { pairs: [["ана", "mother"], ["әке", "father"], ["аға", "older brother"], ["апа", "older sister"]] }, correctAns: null },
          { id: "e504", type: "FILL_BLANK", prompt: { text: "Менің ___ — Айгүл.", hint: "mother" }, options: ["анам", "әкем", "ағам", "інім"], correctAns: "анам" },
          { id: "e505", type: "TRANSLATE_KK_EN", prompt: { text: "аға" }, options: ["Father", "Older brother", "Younger brother", "Uncle"], correctAns: "Older brother" },
          { id: "e506", type: "MULTIPLE_CHOICE", prompt: { text: '"Іні" refers to a...' }, options: ["Younger brother (of a male)", "Older brother", "Father", "Uncle"], correctAns: "Younger brother (of a male)" },
          { id: "e507", type: "TRANSLATE_EN_KK", prompt: { text: "Mother" }, correctAns: "ана", tiles: ["ана", "әке", "сіңлі", "іні"] },
          { id: "e508", type: "MULTIPLE_CHOICE", prompt: { text: '"Апа" can mean...' }, options: ["Older sister or grandmother", "Mother", "Younger sister", "Aunt"], correctAns: "Older sister or grandmother" },
          { id: "e509", type: "TRANSLATE_KK_EN", prompt: { text: "сіңлі" }, options: ["Older sister", "Mother", "Younger sister (of a female)", "Grandmother"], correctAns: "Younger sister (of a female)" },
          { id: "e510", type: "FILL_BLANK", prompt: { text: "Менің ___ — Болат.", hint: "father" }, options: ["әкем", "анам", "ағам", "інім"], correctAns: "әкем" },
          { id: "e511", type: "TRANSLATE_EN_KK", prompt: { text: "Older brother" }, correctAns: "аға", tiles: ["аға", "іні", "әке", "ана"] },
          { id: "e512", type: "MULTIPLE_CHOICE", prompt: { text: 'How do you say "younger brother (of a male)"?' }, options: ["аға", "іні", "әке", "бала"], correctAns: "іні" },
        ],
      },
      {
        id: 202, order: 2, titleKk: "Тәуелдік", titleEn: "Possessives",
        vocab: [
          { id: "v211", kazakh: "менің", english: "my" },
          { id: "v212", kazakh: "сенің", english: "your (informal)" },
          { id: "v213", kazakh: "оның", english: "his/her" },
          { id: "v214", kazakh: "біздің", english: "our" },
        ],
        exercises: [
          { id: "e601", type: "MULTIPLE_CHOICE", prompt: { text: '"Менің" means...' }, options: ["My", "Your", "His", "Our"], correctAns: "My" },
          { id: "e602", type: "TRANSLATE_EN_KK", prompt: { text: "Our" }, correctAns: "біздің", tiles: ["біздің", "менің", "сенің", "оның"] },
          { id: "e603", type: "MATCH_PAIRS", prompt: { pairs: [["менің", "my"], ["сенің", "your"], ["оның", "his/her"], ["біздің", "our"]] }, correctAns: null },
          { id: "e604", type: "FILL_BLANK", prompt: { text: "___ отбасым үлкен.", hint: "My" }, options: ["Менің", "Сенің", "Оның", "Біздің"], correctAns: "Менің" },
          { id: "e605", type: "TRANSLATE_KK_EN", prompt: { text: "оның" }, options: ["My", "Your", "His/Her", "Our"], correctAns: "His/Her" },
          { id: "e606", type: "MULTIPLE_CHOICE", prompt: { text: 'How do you say "your" informally?' }, options: ["менің", "сенің", "оның", "біздің"], correctAns: "сенің" },
          { id: "e607", type: "TRANSLATE_EN_KK", prompt: { text: "His/Her" }, correctAns: "оның", tiles: ["оның", "менің", "сенің", "біздің"] },
          { id: "e608", type: "FILL_BLANK", prompt: { text: "___ анасы мұғалім.", hint: "His/Her" }, options: ["Оның", "Менің", "Сенің", "Біздің"], correctAns: "Оның" },
          { id: "e609", type: "TRANSLATE_KK_EN", prompt: { text: "сенің" }, options: ["My", "Your (informal)", "His", "Our"], correctAns: "Your (informal)" },
          { id: "e610", type: "TRANSLATE_EN_KK", prompt: { text: "My" }, correctAns: "менің", tiles: ["менің", "сенің", "оның", "біздің"] },
          { id: "e611", type: "MULTIPLE_CHOICE", prompt: { text: '"Біздің" means...' }, options: ["My", "Your", "Their", "Our"], correctAns: "Our" },
          { id: "e612", type: "FILL_BLANK", prompt: { text: "___ үйіміз үлкен.", hint: "Our" }, options: ["Біздің", "Менің", "Сенің", "Оның"], correctAns: "Біздің" },
        ],
      },
      {
        id: 203, order: 3, titleKk: "Жас және туған күн", titleEn: "Ages & Birthdays",
        vocab: [
          { id: "v221", kazakh: "жас", english: "age / young" },
          { id: "v222", kazakh: "туған күн", english: "birthday" },
          { id: "v223", kazakh: "жыл", english: "year" },
          { id: "v224", kazakh: "бала", english: "child" },
        ],
        exercises: [
          { id: "e701", type: "MULTIPLE_CHOICE", prompt: { text: '"Туған күн" means...' }, options: ["Birthday", "Holiday", "Morning", "Family"], correctAns: "Birthday" },
          { id: "e702", type: "TRANSLATE_EN_KK", prompt: { text: "Child" }, correctAns: "бала", tiles: ["бала", "жас", "жыл", "күн"] },
          { id: "e703", type: "FILL_BLANK", prompt: { text: "Маған он ___.", hint: "years old" }, options: ["жас", "жыл", "күн", "бала"], correctAns: "жас" },
          { id: "e704", type: "TRANSLATE_KK_EN", prompt: { text: "жыл" }, options: ["Day", "Month", "Year", "Age"], correctAns: "Year" },
          { id: "e705", type: "MATCH_PAIRS", prompt: { pairs: [["жас", "age"], ["туған күн", "birthday"], ["жыл", "year"], ["бала", "child"]] }, correctAns: null },
          { id: "e706", type: "MULTIPLE_CHOICE", prompt: { text: '"Бала" means...' }, options: ["Adult", "Child", "Elder", "Parent"], correctAns: "Child" },
          { id: "e707", type: "TRANSLATE_EN_KK", prompt: { text: "Year" }, correctAns: "жыл", tiles: ["жыл", "жас", "күн", "ай"] },
          { id: "e708", type: "FILL_BLANK", prompt: { text: "Бүгін менің ___ күнім!", hint: "birth" }, options: ["туған", "жақсы", "үлкен", "жаңа"], correctAns: "туған" },
          { id: "e709", type: "TRANSLATE_KK_EN", prompt: { text: "бала" }, options: ["Year", "Child", "Birthday", "Age"], correctAns: "Child" },
          { id: "e710", type: "MULTIPLE_CHOICE", prompt: { text: 'How do you say "birthday"?' }, options: ["жас күн", "туған күн", "жақсы күн", "бірінші күн"], correctAns: "туған күн" },
          { id: "e711", type: "TRANSLATE_EN_KK", prompt: { text: "Age" }, correctAns: "жас", tiles: ["жас", "бала", "жыл", "күн"] },
          { id: "e712", type: "TRANSLATE_EN_KK", prompt: { text: "Birthday" }, correctAns: "туған күн", tiles: ["туған", "күн", "жас", "жыл"] },
        ],
      },
    ],
  },
  {
    id: 3, order: 3, titleKk: "Тағам", titleEn: "Food & Drink", cefrLevel: "A1",
    culturalNote: 'The Kazakh dastarkhan (дастарқан) is a traditional feast spread. Guests are always offered tea first — refusing is considered impolite. Beshbarmak (бешбармақ), meaning "five fingers", is the national dish traditionally eaten by hand.',
    lessons: [
      {
        id: 301, order: 1, titleKk: "Тағам түрлері", titleEn: "Types of Food",
        vocab: [
          { id: "v301", kazakh: "нан", english: "bread" },
          { id: "v302", kazakh: "ет", english: "meat" },
          { id: "v303", kazakh: "сүт", english: "milk" },
          { id: "v304", kazakh: "шай", english: "tea" },
          { id: "v305", kazakh: "алма", english: "apple" },
          { id: "v306", kazakh: "су", english: "water" },
        ],
        exercises: [
          { id: "e801", type: "MULTIPLE_CHOICE", prompt: { text: '"Нан" means...' }, options: ["Bread", "Meat", "Milk", "Water"], correctAns: "Bread" },
          { id: "e802", type: "TRANSLATE_EN_KK", prompt: { text: "Tea" }, correctAns: "шай", tiles: ["шай", "су", "сүт", "нан"] },
          { id: "e803", type: "MATCH_PAIRS", prompt: { pairs: [["нан", "bread"], ["ет", "meat"], ["сүт", "milk"], ["шай", "tea"], ["су", "water"]] }, correctAns: null },
          { id: "e804", type: "FILL_BLANK", prompt: { text: "Маған бір ___ беріңіз.", hint: "apple" }, options: ["алма", "нан", "ет", "шай"], correctAns: "алма" },
          { id: "e805", type: "TRANSLATE_KK_EN", prompt: { text: "су" }, options: ["Milk", "Tea", "Water", "Juice"], correctAns: "Water" },
          { id: "e806", type: "MULTIPLE_CHOICE", prompt: { text: 'What is the Kazakh word for "meat"?' }, options: ["нан", "ет", "сүт", "алма"], correctAns: "ет" },
          { id: "e807", type: "TRANSLATE_EN_KK", prompt: { text: "Milk" }, correctAns: "сүт", tiles: ["сүт", "су", "шай", "нан"] },
          { id: "e808", type: "FILL_BLANK", prompt: { text: "Бір кесе ___ ішейін.", hint: "tea" }, options: ["шай", "су", "сүт", "ет"], correctAns: "шай" },
          { id: "e809", type: "TRANSLATE_KK_EN", prompt: { text: "алма" }, options: ["Orange", "Apple", "Bread", "Grape"], correctAns: "Apple" },
          { id: "e810", type: "MULTIPLE_CHOICE", prompt: { text: '"Сүт" is...' }, options: ["Water", "Tea", "Milk", "Juice"], correctAns: "Milk" },
          { id: "e811", type: "TRANSLATE_EN_KK", prompt: { text: "Bread" }, correctAns: "нан", tiles: ["нан", "ет", "алма", "су"] },
          { id: "e812", type: "TRANSLATE_EN_KK", prompt: { text: "Water" }, correctAns: "су", tiles: ["су", "шай", "сүт", "нан"] },
        ],
      },
      {
        id: 302, order: 2, titleKk: "Дастарқан", titleEn: "The Feast Table",
        vocab: [
          { id: "v311", kazakh: "бешбармақ", english: "beshbarmak (national dish)" },
          { id: "v312", kazakh: "қымыз", english: "kumis (fermented mare's milk)" },
          { id: "v313", kazakh: "бауырсақ", english: "baursak (fried dough)" },
          { id: "v314", kazakh: "дастарқан", english: "feast table / tablecloth spread" },
        ],
        exercises: [
          { id: "e901", type: "MULTIPLE_CHOICE", prompt: { text: "The national dish of Kazakhstan is..." }, options: ["бешбармақ", "бауырсақ", "қымыз", "нан"], correctAns: "бешбармақ" },
          { id: "e902", type: "TRANSLATE_EN_KK", prompt: { text: "Fried dough" }, correctAns: "бауырсақ", tiles: ["бауырсақ", "бешбармақ", "қымыз", "нан"] },
          { id: "e903", type: "MATCH_PAIRS", prompt: { pairs: [["бешбармақ", "national dish"], ["қымыз", "fermented milk"], ["бауырсақ", "fried dough"], ["дастарқан", "feast table"]] }, correctAns: null },
          { id: "e904", type: "FILL_BLANK", prompt: { text: "___ — қазақтың ұлттық тағамы.", hint: "Beshbarmak" }, options: ["Бешбармақ", "Бауырсақ", "Қымыз", "Нан"], correctAns: "Бешбармақ" },
          { id: "e905", type: "TRANSLATE_KK_EN", prompt: { text: "қымыз" }, options: ["Bread", "National dish", "Fermented mare's milk", "Tea"], correctAns: "Fermented mare's milk" },
          { id: "e906", type: "MULTIPLE_CHOICE", prompt: { text: '"Дастарқан" refers to...' }, options: ["A drink", "A feast table", "A dessert", "A greeting"], correctAns: "A feast table" },
          { id: "e907", type: "TRANSLATE_EN_KK", prompt: { text: "Feast table" }, correctAns: "дастарқан", tiles: ["дастарқан", "бешбармақ", "бауырсақ", "қымыз"] },
          { id: "e908", type: "TRANSLATE_KK_EN", prompt: { text: "бауырсақ" }, options: ["Fried dough", "Bread", "Meat", "Milk"], correctAns: "Fried dough" },
          { id: "e909", type: "FILL_BLANK", prompt: { text: "Қазақтар ___ ішеді.", hint: "kumis" }, options: ["қымыз", "шай", "су", "сүт"], correctAns: "қымыз" },
          { id: "e910", type: "MULTIPLE_CHOICE", prompt: { text: '"Бешбармақ" literally means...' }, options: ["Five fingers", "Big plate", "Hot soup", "Family meal"], correctAns: "Five fingers" },
          { id: "e911", type: "TRANSLATE_EN_KK", prompt: { text: "Kumis" }, correctAns: "қымыз", tiles: ["қымыз", "сүт", "су", "шай"] },
          { id: "e912", type: "TRANSLATE_KK_EN", prompt: { text: "дастарқан" }, options: ["Kitchen", "Feast table", "Restaurant", "Market"], correctAns: "Feast table" },
        ],
      },
    ],
  },
];

export function getUnit(id: number): Unit | undefined {
  return UNITS.find((u) => u.id === id);
}

export function getLesson(id: number) {
  for (const unit of UNITS) {
    const lesson = unit.lessons.find((l) => l.id === id);
    if (lesson) return { lesson, unit };
  }
  return undefined;
}

export function getAllVocab() {
  return UNITS.flatMap((u) => u.lessons.flatMap((l) => l.vocab));
}
