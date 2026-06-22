// Refreshes the latest 6 @doctororsini post permalinks in src/content/instagram.ts
// (official embed). Run locally: node scripts/pull-instagram.mjs
// Note: Instagram may rate-limit/block this from datacenter IPs; it's meant for
// occasional local runs. For an always-fresh feed, use a widget instead.
import { execFileSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";

const USER = "doctororsini";
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36";

let json;
try {
  const out = execFileSync(
    "curl",
    [
      "-s",
      "-A",
      UA,
      "-H",
      "x-ig-app-id: 936619743392459",
      "-H",
      "Accept: */*",
      "--max-time",
      "30",
      `https://www.instagram.com/api/v1/users/web_profile_info/?username=${USER}`,
    ],
    { maxBuffer: 20 * 1024 * 1024 },
  );
  json = JSON.parse(out.toString());
} catch (e) {
  console.error("Request failed (Instagram may have blocked it):", e.message);
  process.exit(1);
}

const edges = json?.data?.user?.edge_owner_to_timeline_media?.edges ?? [];
const posts = edges
  .map((e) => ({ code: e.node.shortcode, ts: e.node.taken_at_timestamp }))
  .filter((x) => x.code)
  .sort((a, b) => b.ts - a.ts)
  .slice(0, 6)
  .map((x) => `https://www.instagram.com/p/${x.code}/`);

if (posts.length === 0) {
  console.error("No posts found in the response.");
  process.exit(1);
}

const file = "src/content/instagram.ts";
const src = await readFile(file, "utf8");
const arr = "[\n" + posts.map((p) => `    "${p}",`).join("\n") + "\n  ]";
const next = src.replace(/posts:\s*\[[\s\S]*?\]\s*as string\[\]/, `posts: ${arr} as string[]`);
await writeFile(file, next);

console.log(`Updated ${file} with the latest ${posts.length} posts:`);
posts.forEach((p) => console.log("  " + p));
