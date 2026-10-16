// Regenerates supabase/migrations/013_beginner_revamp.sql from the content
// source in src/content/beginner/. Run: npm run content:build
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { beginnerUnits } from "../src/content/beginner";
import { BEGINNER_MIGRATION_HEADER, BEGINNER_MIGRATION_PATH } from "../src/content/beginner/migration";
import { buildMigrationSql } from "../src/content/sql";

const target = resolve(__dirname, "..", BEGINNER_MIGRATION_PATH);
writeFileSync(target, buildMigrationSql(beginnerUnits, BEGINNER_MIGRATION_HEADER));
console.log(`wrote ${BEGINNER_MIGRATION_PATH}`);
