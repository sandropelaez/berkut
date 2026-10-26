// A1.1 beginner course (Units 1–7) plus the alphabet section, compiled to
// supabase/migrations/013_beginner_revamp.sql by
// `npm run content:build`.
import type { ContentUnit } from "../builders";
import { alphabet } from "./alphabet";
import { unit1, unit2, unit3, unit4 } from "./units1to4";
import { unit5, unit6, unit7 } from "./units5to7";

export const beginnerUnits: ContentUnit[] = [alphabet, unit1, unit2, unit3, unit4, unit5, unit6, unit7];
