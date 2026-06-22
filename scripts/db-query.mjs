// Runs a .sql file against the Supabase project via the Management API.
// Usage: SUPABASE_ACCESS_TOKEN=xxx SUPABASE_PROJECT_REF=xxx node scripts/db-query.mjs scripts/schema.sql
import { readFile } from "node:fs/promises";

const TK = process.env.SUPABASE_ACCESS_TOKEN;
const REF = process.env.SUPABASE_PROJECT_REF;
if (!TK || !REF) {
  console.error("Missing SUPABASE_ACCESS_TOKEN or SUPABASE_PROJECT_REF");
  process.exit(1);
}
const file = process.argv[2];
const query = await readFile(file, "utf8");

const res = await fetch(`https://api.supabase.com/v1/projects/${REF}/database/query`, {
  method: "POST",
  headers: { Authorization: `Bearer ${TK}`, "Content-Type": "application/json" },
  body: JSON.stringify({ query }),
});
const text = await res.text();
console.log("HTTP", res.status);
console.log(text.slice(0, 2000));
if (!res.ok) process.exit(1);
