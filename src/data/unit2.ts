import type { Unit } from "@/core/types";

export const unit2: Unit = {
  id: 2,
  order: 2,
  titleKk: "Менің отбасым",
  titleEn: "My Family",
  cefrLevel: "A1",
  emoji: "👨‍👩‍👧",
  description: "Family members, possessives, simple sentences.",
  culturalNote:
    "Family ('отбасы') is central in Kazakh life. Multi-generational households are common, and respect for elders is shown by using 'сіз' (formal you) and standing up when an elder enters the room.",
  lessons: [
    {
      id: "u2-l1",
      unitId: 2,
      order: 1,
      titleKk: "Отбасы мүшелері",
      titleEn: "Family Members",
      vocab: [
        { id: "v-ata", kazakh: "ата", english: "grandfather" },
        { id: "v-aje", kazakh: "әже", english: "grandmother" },
        { id: "v-ake", kazakh: "әке", english: "father" },
        { id: "v-ana2", kazakh: "ана", english: "mother" },
        { id: "v-bauyr", kazakh: "бауыр", english: "brother" },
        { id: "v-apke", kazakh: "әпке", english: "older sister" },
        { id: "v-bala2", kazakh: "бала", english: "child" },
      ],
      exercises: [
        {
          id: "u2-l1-e1",
          type: "MULTIPLE_CHOICE",
          prompt: {
            type: "MULTIPLE_CHOICE",
            promptKk: "әке",
            questionEn: "What does this mean?",
            options: ["mother", "father", "brother", "uncle"],
            correctAns: "father",
          },
        },
        {
          id: "u2-l1-e2",
          type: "MULTIPLE_CHOICE",
          prompt: {
            type: "MULTIPLE_CHOICE",
            promptKk: "ата",
            questionEn: "What does this mean?",
            options: ["grandfather", "grandmother", "uncle", "father"],
            correctAns: "grandfather",
          },
        },
        {
          id: "u2-l1-e3",
          type: "LISTENING",
          prompt: {
            type: "LISTENING",
            audioKk: "әже",
            options: ["ата", "әже", "әке", "ана"],
            correctAns: "әже",
          },
        },
        {
          id: "u2-l1-e4",
          type: "MATCH_PAIRS",
          prompt: {
            type: "MATCH_PAIRS",
            pairs: [
              { kazakh: "ата", english: "grandfather" },
              { kazakh: "әже", english: "grandmother" },
              { kazakh: "әке", english: "father" },
              { kazakh: "ана", english: "mother" },
              { kazakh: "бауыр", english: "brother" },
            ],
          },
        },
        {
          id: "u2-l1-e5",
          type: "TRANSLATE_KK_EN",
          prompt: {
            type: "TRANSLATE_KK_EN",
            promptKk: "әпке",
            options: ["older sister", "younger sister", "aunt", "cousin"],
            correctAns: "older sister",
          },
        },
        {
          id: "u2-l1-e6",
          type: "TRANSLATE_EN_KK",
          prompt: {
            type: "TRANSLATE_EN_KK",
            promptEn: "brother",
            tiles: ["бауыр", "әпке", "ана", "ата"],
            correctAns: ["бауыр"],
          },
        },
        {
          id: "u2-l1-e7",
          type: "FILL_BLANK",
          prompt: {
            type: "FILL_BLANK",
            sentenceKkParts: ["Менің ", "м үлкен."],
            options: ["әке", "әпке", "бала"],
            correctAns: "әпке",
            hintEn: "My older sister is older.",
          },
        },
        {
          id: "u2-l1-e8",
          type: "TRANSLATE_EN_KK",
          prompt: {
            type: "TRANSLATE_EN_KK",
            promptEn: "mother",
            tiles: ["ана", "әже", "әке", "ата"],
            correctAns: ["ана"],
          },
        },
        {
          id: "u2-l1-e9",
          type: "LISTENING",
          prompt: {
            type: "LISTENING",
            audioKk: "бауыр",
            options: ["бауыр", "бала", "ата", "әпке"],
            correctAns: "бауыр",
          },
        },
        {
          id: "u2-l1-e10",
          type: "MULTIPLE_CHOICE",
          prompt: {
            type: "MULTIPLE_CHOICE",
            promptKk: "бала",
            questionEn: "What does this mean?",
            options: ["child", "boy", "girl", "baby"],
            correctAns: "child",
          },
        },
      ],
    },
    {
      id: "u2-l2",
      unitId: 2,
      order: 2,
      titleKk: "Менің / Сенің",
      titleEn: "My / Your",
      vocab: [
        { id: "v-menin", kazakh: "менің", english: "my" },
        { id: "v-senin", kazakh: "сенің", english: "your (informal)" },
        { id: "v-onyn", kazakh: "оның", english: "his / her" },
        { id: "v-bizdin", kazakh: "біздің", english: "our" },
        { id: "v-sizdin", kazakh: "сіздің", english: "your (formal)" },
      ],
      exercises: [
        {
          id: "u2-l2-e1",
          type: "MULTIPLE_CHOICE",
          prompt: {
            type: "MULTIPLE_CHOICE",
            promptKk: "менің",
            questionEn: "What does this mean?",
            options: ["my", "your", "his", "our"],
            correctAns: "my",
          },
        },
        {
          id: "u2-l2-e2",
          type: "TRANSLATE_KK_EN",
          prompt: {
            type: "TRANSLATE_KK_EN",
            promptKk: "оның",
            options: ["my", "their", "his/her", "our"],
            correctAns: "his/her",
          },
        },
        {
          id: "u2-l2-e3",
          type: "FILL_BLANK",
          prompt: {
            type: "FILL_BLANK",
            sentenceKkParts: ["", " анам үйде."],
            options: ["менің", "сенің", "оның"],
            correctAns: "менің",
            hintEn: "My mother is at home.",
          },
        },
        {
          id: "u2-l2-e4",
          type: "MATCH_PAIRS",
          prompt: {
            type: "MATCH_PAIRS",
            pairs: [
              { kazakh: "менің", english: "my" },
              { kazakh: "сенің", english: "your" },
              { kazakh: "оның", english: "his/her" },
              { kazakh: "біздің", english: "our" },
              { kazakh: "сіздің", english: "your (formal)" },
            ],
          },
        },
        {
          id: "u2-l2-e5",
          type: "LISTENING",
          prompt: {
            type: "LISTENING",
            audioKk: "біздің",
            options: ["менің", "сенің", "біздің", "оның"],
            correctAns: "біздің",
          },
        },
        {
          id: "u2-l2-e6",
          type: "TRANSLATE_EN_KK",
          prompt: {
            type: "TRANSLATE_EN_KK",
            promptEn: "our",
            tiles: ["біздің", "менің", "сенің", "оның"],
            correctAns: ["біздің"],
          },
        },
        {
          id: "u2-l2-e7",
          type: "FILL_BLANK",
          prompt: {
            type: "FILL_BLANK",
            sentenceKkParts: ["", " үйіміз үлкен."],
            options: ["біздің", "менің", "сенің"],
            correctAns: "біздің",
            hintEn: "Our house is big.",
          },
        },
        {
          id: "u2-l2-e8",
          type: "TRANSLATE_EN_KK",
          prompt: {
            type: "TRANSLATE_EN_KK",
            promptEn: "your (formal)",
            tiles: ["сіздің", "сенің", "менің", "біздің"],
            correctAns: ["сіздің"],
          },
        },
        {
          id: "u2-l2-e9",
          type: "MULTIPLE_CHOICE",
          prompt: {
            type: "MULTIPLE_CHOICE",
            promptKk: "сенің",
            questionEn: "What does this mean?",
            options: ["my", "your (informal)", "your (formal)", "our"],
            correctAns: "your (informal)",
          },
        },
        {
          id: "u2-l2-e10",
          type: "LISTENING",
          prompt: {
            type: "LISTENING",
            audioKk: "оның",
            options: ["оның", "менің", "сенің", "сіздің"],
            correctAns: "оның",
          },
        },
      ],
    },
    {
      id: "u2-l3",
      unitId: 2,
      order: 3,
      titleKk: "Жасы",
      titleEn: "Ages",
      vocab: [
        { id: "v-jas", kazakh: "жас", english: "age / young" },
        { id: "v-ulken", kazakh: "үлкен", english: "big / older" },
        { id: "v-kishi", kazakh: "кіші", english: "small / younger" },
        { id: "v-zhyl", kazakh: "жыл", english: "year" },
      ],
      exercises: [
        {
          id: "u2-l3-e1",
          type: "MULTIPLE_CHOICE",
          prompt: {
            type: "MULTIPLE_CHOICE",
            promptKk: "үлкен",
            questionEn: "What does this mean?",
            options: ["big", "small", "good", "fast"],
            correctAns: "big",
          },
        },
        {
          id: "u2-l3-e2",
          type: "TRANSLATE_KK_EN",
          prompt: {
            type: "TRANSLATE_KK_EN",
            promptKk: "кіші",
            options: ["younger", "older", "good", "tall"],
            correctAns: "younger",
          },
        },
        {
          id: "u2-l3-e3",
          type: "LISTENING",
          prompt: {
            type: "LISTENING",
            audioKk: "жыл",
            options: ["жыл", "жас", "жоқ", "жақсы"],
            correctAns: "жыл",
          },
        },
        {
          id: "u2-l3-e4",
          type: "FILL_BLANK",
          prompt: {
            type: "FILL_BLANK",
            sentenceKkParts: ["Мен жиырма ", "пын."],
            options: ["жас", "жыл", "кіші"],
            correctAns: "жас",
            hintEn: "I am twenty years old.",
          },
        },
        {
          id: "u2-l3-e5",
          type: "TRANSLATE_EN_KK",
          prompt: {
            type: "TRANSLATE_EN_KK",
            promptEn: "year",
            tiles: ["жыл", "жас", "кіші", "үлкен"],
            correctAns: ["жыл"],
          },
        },
        {
          id: "u2-l3-e6",
          type: "MATCH_PAIRS",
          prompt: {
            type: "MATCH_PAIRS",
            pairs: [
              { kazakh: "жас", english: "young" },
              { kazakh: "үлкен", english: "big" },
              { kazakh: "кіші", english: "small" },
              { kazakh: "жыл", english: "year" },
              { kazakh: "ана", english: "mother" },
            ],
          },
        },
        {
          id: "u2-l3-e7",
          type: "MULTIPLE_CHOICE",
          prompt: {
            type: "MULTIPLE_CHOICE",
            promptKk: "жас",
            questionEn: "What does this mean?",
            options: ["age / young", "big", "old", "tall"],
            correctAns: "age / young",
          },
        },
        {
          id: "u2-l3-e8",
          type: "TRANSLATE_EN_KK",
          prompt: {
            type: "TRANSLATE_EN_KK",
            promptEn: "younger",
            tiles: ["кіші", "үлкен", "жас", "жыл"],
            correctAns: ["кіші"],
          },
        },
        {
          id: "u2-l3-e9",
          type: "LISTENING",
          prompt: {
            type: "LISTENING",
            audioKk: "үлкен",
            options: ["үлкен", "кіші", "жас", "жыл"],
            correctAns: "үлкен",
          },
        },
        {
          id: "u2-l3-e10",
          type: "TRANSLATE_KK_EN",
          prompt: {
            type: "TRANSLATE_KK_EN",
            promptKk: "үлкен",
            options: ["big", "small", "good", "fast"],
            correctAns: "big",
          },
        },
      ],
    },
    {
      id: "u2-l4",
      unitId: 2,
      order: 4,
      titleKk: "Менің отбасым",
      titleEn: "My Family Sentences",
      vocab: [
        { id: "v-meni-otbasy", kazakh: "отбасы", english: "family" },
        { id: "v-bar", kazakh: "бар", english: "there is / have" },
        { id: "v-jokk", kazakh: "жоқ", english: "there isn't / not have" },
      ],
      exercises: [
        {
          id: "u2-l4-e1",
          type: "FILL_BLANK",
          prompt: {
            type: "FILL_BLANK",
            sentenceKkParts: ["Менің ", "м бар."],
            options: ["отбасы", "ата", "ана"],
            correctAns: "отбасы",
            hintEn: "I have a family.",
          },
        },
        {
          id: "u2-l4-e2",
          type: "MULTIPLE_CHOICE",
          prompt: {
            type: "MULTIPLE_CHOICE",
            promptKk: "бар",
            questionEn: "What does this mean?",
            options: ["have / there is", "no", "now", "good"],
            correctAns: "have / there is",
          },
        },
        {
          id: "u2-l4-e3",
          type: "TRANSLATE_KK_EN",
          prompt: {
            type: "TRANSLATE_KK_EN",
            promptKk: "отбасы",
            options: ["family", "house", "child", "year"],
            correctAns: "family",
          },
        },
        {
          id: "u2-l4-e4",
          type: "LISTENING",
          prompt: {
            type: "LISTENING",
            audioKk: "отбасы",
            options: ["отбасы", "ана", "әке", "бала"],
            correctAns: "отбасы",
          },
        },
        {
          id: "u2-l4-e5",
          type: "TRANSLATE_EN_KK",
          prompt: {
            type: "TRANSLATE_EN_KK",
            promptEn: "I have a family.",
            tiles: ["менің", "отбасым", "бар", "жоқ"],
            correctAns: ["менің", "отбасым", "бар"],
          },
        },
        {
          id: "u2-l4-e6",
          type: "TRANSLATE_EN_KK",
          prompt: {
            type: "TRANSLATE_EN_KK",
            promptEn: "My mother is good.",
            tiles: ["менің", "анам", "жақсы", "жаман"],
            correctAns: ["менің", "анам", "жақсы"],
          },
        },
        {
          id: "u2-l4-e7",
          type: "MATCH_PAIRS",
          prompt: {
            type: "MATCH_PAIRS",
            pairs: [
              { kazakh: "отбасы", english: "family" },
              { kazakh: "бар", english: "have" },
              { kazakh: "жоқ", english: "don't have" },
              { kazakh: "үлкен", english: "big" },
              { kazakh: "кіші", english: "small" },
            ],
          },
        },
        {
          id: "u2-l4-e8",
          type: "FILL_BLANK",
          prompt: {
            type: "FILL_BLANK",
            sentenceKkParts: ["Менің балам ", "."],
            options: ["жоқ", "үлкен", "ана"],
            correctAns: "жоқ",
            hintEn: "I don't have a child.",
          },
        },
        {
          id: "u2-l4-e9",
          type: "TRANSLATE_KK_EN",
          prompt: {
            type: "TRANSLATE_KK_EN",
            promptKk: "Менің отбасым үлкен.",
            options: [
              "My family is big.",
              "My family is small.",
              "I have a family.",
              "I don't have a family.",
            ],
            correctAns: "My family is big.",
          },
        },
        {
          id: "u2-l4-e10",
          type: "LISTENING",
          prompt: {
            type: "LISTENING",
            audioKk: "Менің отбасым жақсы.",
            options: [
              "Менің отбасым жақсы.",
              "Сенің отбасың үлкен.",
              "Біздің отбасымыз кіші.",
              "Оның отбасы жоқ.",
            ],
            correctAns: "Менің отбасым жақсы.",
          },
        },
      ],
    },
  ],
};
