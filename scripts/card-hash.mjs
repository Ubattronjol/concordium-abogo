// SHA-256 of the Agent Card bytes — the value verifiers compare against the
// on-chain metadata_hash. Hash the SERVED bytes (what a verifier fetches),
// not just the file on disk: pass a URL as the first argument.
//   node scripts/card-hash.mjs                      -> hashes agent-card.json
//   node scripts/card-hash.mjs <url>                -> hashes the served bytes
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const target = process.argv[2];
let bytes;
if (target && /^https?:\/\//.test(target)) {
  const res = await fetch(target);
  if (!res.ok) throw new Error(`fetch ${target}: HTTP ${res.status}`);
  bytes = Buffer.from(await res.arrayBuffer());
} else {
  bytes = readFileSync(new URL("../agent-card.json", import.meta.url));
}
console.log(createHash("sha256").update(bytes).digest("hex"));
