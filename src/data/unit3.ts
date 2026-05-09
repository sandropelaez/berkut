import type { Unit } from "@/core/types";

export const unit3: Unit = {
  id: 3,
  order: 3,
  titleKk: "Тағам",
  titleEn: "Food & Drink",
  cefrLevel: "A1",
  emoji: "🍲",
  description: "Common foods, ordering, traditional dishes.",
  culturalNote:
    "The 'дастархан' is the laden tablecloth at the heart of Kazakh hospitality. Beshbarmak ('бесбармақ' — 'five fingers') is the national dish, eaten by hand from a shared platter. Tea ('шай') is offered to every guest.",
  lessons: [
    {
      id: "u3-l1",
      unitId: 3,
      order: 1,
      titleKk: "Тағам сөздері",
      titleEn: "Food Words",
      vocab: [
        { id: "v-non", kazakh: "нан", english: "bread" },
        { id: "v-su", kazakh: "су", english: "water" },
        { id: "v-shay", kazakh: "шай", english: "tea" },
        { id: "v-et", kazakh: "ет", english: "meat" },
        { id: "v-suit", kazakh: "сүт", english: "milk" },
        { id: "v-alma", kazakh: "алма", english: "apple" },
        { id: "v-jemis", kazakh: "жеміс", english: "fruit" },
      ],
      exercises: [
        {
          id: "u3-l1-e1",
          type: "MULTIPLE_CHOICE",
          prompt: {
            type: "MULTIPLE_CHOICE",
            promptKk: "нан",
            questionEn: "What does this mean?",
            options: ["bread", "water", "milk", "tea"],
            correctAns: "bread",
          },
        },
        {
          id: "u3-l1-e2",
          type: "TRANSLATE_KK_EN",
          prompt: {
            type: "TRANSLATE_KK_EN",
            promptKk: "су",
            options: ["water", "milk", "soup", "tea"],
            correctAns: "water",
          },
        },
        {
          id: "u3-l1-e3",
          type: "LISTENING",
          prompt: {
            type: "LISTENING",
            audioKk: "шай",
            options: ["шай", "су", "сүт", "нан"],
            correctAns: "шай",
          },
        },
        {
          id: "u3-l1-e4",
          type: "MATCH_PAIRS",
          prompt: {
            type: "MATCH_PAIRS",
            pairs: [
              { kazakh: "нан", english: "bread" },
              { kazakh: "су", english: "water" },
              { kazakh: "шай", english: "tea" },
              { kazakh: "ет", english: "meat" },
              { kazakh: "сүт", english: "milk" },
            ],
          },
        },
        {
          id: "u3-l1-e5",
          type: "TRANSLATE_EN_KK",
          prompt: {
            type: "TRANSLATE_EN_KK",
            promptEn: "apple",
            tiles: ["алма", "жеміс", "ет", "сүт"],
            correctAns: ["алма"],
          },
        },
        {
          id: "u3-l1-e6",
          type: "FILL_BLANK",
          prompt: {
            type: "FILL_BLANK",
            sentenceKkParts: ["Мен ", " ішемін."],
            options: ["шай", "ет", "нан"],
            correctAns: "шай",
            hintEn: "I drink tea.",
          },
        },
        {
          id: "u3-l1-e7",
          type: "MULTIPLE_CHOICE",
          prompt: {
            type: "MULTIPLE_CHOICE",
            promptKk: "сүт",
            questionEn: "What does this mean?",
            options: ["water", "milk", "soup", "salt"],
            correctAns: "milk",
          },
        },
        {
          id: "u3-l1-e8",
          type: "TRANSLATE_EN_KK",
          prompt: {
            type: "TRANSLATE_EN_KK",
            promptEn: "fruit",
            tiles: ["жеміс", "алма", "ет", "нан"],
            correctAns: ["жеміс"],
          },
        },
        {
          id: "u3-l1-e9",
          type: "LISTENING",
          prompt: {
            type: "LISTENING",
            audioKk: "ет",
            options: ["ет", "су", "нан", "шай"],
            correctAns: "ет",
          },
        },
        {
          id: "u3-l1-e10",
          type: "TRANSLATE_KK_EN",
          prompt: {
            type: "TRANSLATE_KK_EN",
            promptKk: "жеміс",
            options: ["fruit", "vegetable", "meat", "bread"],
            correctAns: "fruit",
          },
        },
      ],
    },
    {
      id: "u3-l2",
      unitId: 3,
      order: 2,
      titleKk: "Дастархан",
      titleEn: "The Dastarkhan",
      vocab: [
        { id: "v-dastarkhan", kazakh: "дастархан", english: "the laid table" },
        { id: "v-konak", kazakh: "қонақ", english: "guest" },
        { id: "v-tabaq", kazakh: "табақ", english: "platter" },
        { id: "v-tagam", kazakh: "тағам", english: "food" },
        { id: "v-iz", kazakh: "із", english: "trace / spoon (small)" },
      ],
      exercises: [
        {
          id: "u3-l2-e1",
          type: "MULTIPLE_CHOICE",
          prompt: {
            type: "MULTIPLE_CHOICE",
            promptKk: "қонақ",
            questionEn: "What does this mean?",
            options: ["guest", "host", "child", "friend"],
            correctAns: "guest",
          },
        },
        {
          id: "u3-l2-e2",
          type: "TRANSLATE_KK_EN",
          prompt: {
            type: "TRANSLATE_KK_EN",
            promptKk: "тағам",
            options: ["food", "drink", "table", "kitchen"],
            correctAns: "food",
          },
        },
        {
          id: "u3-l2-e3",
          type: "LISTENING",
          prompt: {
            type: "LISTENING",
            audioKk: "дастархан",
            options: ["дастархан", "табақ", "тағам", "қонақ"],
            correctAns: "дастархан",
          },
        },
        {
          id: "u3-l2-e4",
          type: "MATCH_PAIRS",
          prompt: {
            type: "MATCH_PAIRS",
            pairs: [
              { kazakh: "дастархан", english: "the laid table" },
              { kazakh: "қонақ", english: "guest" },
              { kazakh: "табақ", english: "platter" },
              { kazakh: "тағам", english: "food" },
              { kazakh: "шай", english: "tea" },
            ],
          },
        },
        {
          id: "u3-l2-e5",
          type: "TRANSLATE_EN_KK",
          prompt: {
            type: "TRANSLATE_EN_KK",
            promptEn: "guest",
            tiles: ["қонақ", "тағам", "табақ", "дастархан"],
            correctAns: ["қонақ"],
          },
        },
        {
          id: "u3-l2-e6",
          type: "FILL_BLANK",
          prompt: {
            type: "FILL_BLANK",
            sentenceKkParts: ["", " дайын."],
            options: ["дастархан", "қонақ", "ет"],
            correctAns: "дастархан",
            hintEn: "The dastarkhan is ready.",
          },
        },
        {
          id: "u3-l2-e7",
          type: "MULTIPLE_CHOICE",
          prompt: {
            type: "MULTIPLE_CHOICE",
            promptKk: "табақ",
            questionEn: "What does this mean?",
            options: ["plate", "platter", "spoon", "cup"],
            correctAns: "platter",
          },
        },
        {
          id: "u3-l2-e8",
          type: "TRANSLATE_EN_KK",
          prompt: {
            type: "TRANSLATE_EN_KK",
            promptEn: "food",
            tiles: ["тағам", "су", "шай", "ет"],
            correctAns: ["тағам"],
          },
        },
        {
          id: "u3-l2-e9",
          type: "LISTENING",
          prompt: {
            type: "LISTENING",
            audioKk: "қонақ",
            options: ["қонақ", "тағам", "табақ", "дастархан"],
            correctAns: "қонақ",
          },
        },
        {
          id: "u3-l2-e10",
          type: "TRANSLATE_KK_EN",
          prompt: {
            type: "TRANSLATE_KK_EN",
            promptKk: "табақ",
            options: ["platter", "plate", "spoon", "cup"],
            correctAns: "platter",
          },
        },
      ],
    },
    {
      id: "u3-l3",
      unitId: 3,
      order: 3,
      titleKk: "Тапсырыс",
      titleEn: "Ordering",
      vocab: [
        { id: "v-beriniz", kazakh: "беріңіз", english: "give me (formal)" },
        { id: "v-kerek", kazakh: "керек", english: "need" },
        { id: "v-magan", kazakh: "маған", english: "to me" },
        { id: "v-bir2", kazakh: "бір", english: "one / a" },
      ],
      exercises: [
        {
          id: "u3-l3-e1",
          type: "MULTIPLE_CHOICE",
          prompt: {
            type: "MULTIPLE_CHOICE",
            promptKk: "беріңіз",
            questionEn: "What does this mean?",
            options: ["give me", "thanks", "please", "yes"],
            correctAns: "give me",
          },
        },
        {
          id: "u3-l3-e2",
          type: "FILL_BLANK",
          prompt: {
            type: "FILL_BLANK",
            sentenceKkParts: ["Маған бір шай ", "."],
            options: ["беріңіз", "керек", "иә"],
            correctAns: "беріңіз",
            hintEn: "Give me one tea.",
          },
        },
        {
          id: "u3-l3-e3",
          type: "TRANSLATE_KK_EN",
          prompt: {
            type: "TRANSLATE_KK_EN",
            promptKk: "керек",
            options: ["need", "want", "have", "give"],
            correctAns: "need",
          },
        },
        {
          id: "u3-l3-e4",
          type: "LISTENING",
          prompt: {
            type: "LISTENING",
            audioKk: "маған",
            options: ["маған", "саған", "оған", "бізге"],
            correctAns: "маған",
          },
        },
        {
          id: "u3-l3-e5",
          type: "TRANSLATE_EN_KK",
          prompt: {
            type: "TRANSLATE_EN_KK",
            promptEn: "I need water.",
            tiles: ["маған", "су", "керек", "шай"],
            correctAns: ["маған", "су", "керек"],
          },
        },
        {
          id: "u3-l3-e6",
          type: "MATCH_PAIRS",
          prompt: {
            type: "MATCH_PAIRS",
            pairs: [
              { kazakh: "беріңіз", english: "give me" },
              { kazakh: "керек", english: "need" },
              { kazakh: "маған", english: "to me" },
              { kazakh: "бір", english: "one" },
              { kazakh: "шай", english: "tea" },
            ],
          },
        },
        {
          id: "u3-l3-e7",
          type: "FILL_BLANK",
          prompt: {
            type: "FILL_BLANK",
            sentenceKkParts: ["", " нан керек."],
            options: ["маған", "сізге", "оған"],
            correctAns: "маған",
            hintEn: "I need bread.",
          },
        },
        {
          id: "u3-l3-e8",
          type: "TRANSLATE_KK_EN",
          prompt: {
            type: "TRANSLATE_KK_EN",
            promptKk: "Маған шай беріңіз.",
            options: [
              "Give me tea, please.",
              "I have tea.",
              "Tea is good.",
              "I need water.",
            ],
            correctAns: "Give me tea, please.",
          },
        },
        {
          id: "u3-l3-e9",
          type: "LISTENING",
          prompt: {
            type: "LISTENING",
            audioKk: "Маған бір нан керек.",
            options: [
              "Маған бір нан керек.",
              "Маған бір шай керек.",
              "Маған бір су керек.",
              "Маған бір ет керек.",
            ],
            correctAns: "Маған бір нан керек.",
          },
        },
        {
          id: "u3-l3-e10",
          type: "MULTIPLE_CHOICE",
          prompt: {
            type: "MULTIPLE_CHOICE",
            promptKk: "бір",
            questionEn: "What does this mean?",
            options: ["one / a", "two", "the", "some"],
            correctAns: "one / a",
          },
        },
      ],
    },
    {
      id: "u3-l4",
      unitId: 3,
      order: 4,
      titleKk: "Бесбармақ",
      titleEn: "Beshbarmak & tea culture",
      vocab: [
        { id: "v-besbarmaq", kazakh: "бесбармақ", english: "beshbarmak" },
        { id: "v-baursaq", kazakh: "бауырсақ", english: "fried dough" },
        { id: "v-qymyz", kazakh: "қымыз", english: "fermented mare's milk" },
        { id: "v-shubat", kazakh: "шұбат", english: "fermented camel's milk" },
        { id: "v-dam", kazakh: "дәмді", english: "delicious" },
      ],
      exercises: [
        {
          id: "u3-l4-e1",
          type: "MULTIPLE_CHOICE",
          prompt: {
            type: "MULTIPLE_CHOICE",
            promptKk: "бесбармақ",
            questionEn: "What is this?",
            options: [
              "a national meat & noodle dish",
              "fermented milk",
              "fried dough",
              "tea",
            ],
            correctAns: "a national meat & noodle dish",
          },
        },
        {
          id: "u3-l4-e2",
          type: "TRANSLATE_KK_EN",
          prompt: {
            type: "TRANSLATE_KK_EN",
            promptKk: "дәмді",
            options: ["delicious", "salty", "spicy", "cold"],
            correctAns: "delicious",
          },
        },
        {
          id: "u3-l4-e3",
          type: "LISTENING",
          prompt: {
            type: "LISTENING",
            audioKk: "қымыз",
            options: ["қымыз", "шұбат", "шай", "сүт"],
            correctAns: "қымыз",
          },
        },
        {
          id: "u3-l4-e4",
          type: "MATCH_PAIRS",
          prompt: {
            type: "MATCH_PAIRS",
            pairs: [
              { kazakh: "бесбармақ", english: "beshbarmak" },
              { kazakh: "бауырсақ", english: "fried dough" },
              { kazakh: "қымыз", english: "mare's milk" },
              { kazakh: "шұбат", english: "camel's milk" },
              { kazakh: "дәмді", english: "delicious" },
            ],
          },
        },
        {
          id: "u3-l4-e5",
          type: "TRANSLATE_EN_KK",
          prompt: {
            type: "TRANSLATE_EN_KK",
            promptEn: "delicious",
            tiles: ["дәмді", "жақсы", "үлкен", "кіші"],
            correctAns: ["дәмді"],
          },
        },
        {
          id: "u3-l4-e6",
          type: "FILL_BLANK",
          prompt: {
            type: "FILL_BLANK",
            sentenceKkParts: ["Бесбармақ ", "."],
            options: ["дәмді", "кіші", "жоқ"],
            correctAns: "дәмді",
            hintEn: "Beshbarmak is delicious.",
          },
        },
        {
          id: "u3-l4-e7",
          type: "TRANSLATE_KK_EN",
          prompt: {
            type: "TRANSLATE_KK_EN",
            promptKk: "бауырсақ",
            options: ["fried dough", "rice", "porridge", "cake"],
            correctAns: "fried dough",
          },
        },
        {
          id: "u3-l4-e8",
          type: "MULTIPLE_CHOICE",
          prompt: {
            type: "MULTIPLE_CHOICE",
            promptKk: "шұбат",
            questionEn: "What is this?",
            options: ["camel's milk", "mare's milk", "cow's milk", "goat's milk"],
            correctAns: "camel's milk",
          },
        },
        {
          id: "u3-l4-e9",
          type: "TRANSLATE_EN_KK",
          prompt: {
            type: "TRANSLATE_EN_KK",
            promptEn: "The tea is delicious.",
            tiles: ["шай", "дәмді", "жоқ", "су"],
            correctAns: ["шай", "дәмді"],
          },
        },
        {
          id: "u3-l4-e10",
          type: "LISTENING",
          prompt: {
            type: "LISTENING",
            audioKk: "Бесбармақ дәмді.",
            options: [
              "Бесбармақ дәмді.",
              "Шай дәмді.",
              "Сүт жақсы.",
              "Нан керек.",
            ],
            correctAns: "Бесбармақ дәмді.",
          },
        },
      ],
    },
  ],
};
