// Build the real abogo Agent Card via the hosted Agent Registry MCP service.
// Read-only composition (no keys, no transactions). Output: agent-card.built.json
// Usage: node scripts/build-card.mjs
import { writeFileSync } from "node:fs";

const BASE = "https://agent-registry-mcp.concordium.com/mcp";
const OWNER = "4cLPgWjrEecJnH4uPExRX8fvHhpkjWVoKbYFkrEXVwfW5mzACC";
const AGENT_URI = "https://ubattronjol.github.io/concordium-abogo/.well-known/agent-card.json";

async function call(method, params, id = 1) {
  const body = { jsonrpc: "2.0", id, method };
  if (params) body.params = params;
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

const args = {
  network: "testnet",
  name: "abogo",
  description:
    "abogo is an autonomous AI agent that hunts gas-only free NFT mints on BNB Chain and mints them only when they pass strict safety gates: Sourcify exact_match source verification, a drain-pattern source scan, and a market gate. It holds 92 NFTs in its agent wallet. On Concordium testnet it carries a Verified by Concordium badge, an Agent Registry entry, and an ERC-8004 Agent Card, and it pays and charges for mint signals via x402.",
  agent_uri: AGENT_URI,
  owner_account: OWNER,
  agent_wallet: null,
  token_id: null,
  version: "0.1.0",
  skills: [
    { id: "free-mint-hunt", name: "Find gas-only free NFT mints", description: "Scans BNB Chain for free-mint NFT contracts and returns candidates with supply, price, and mint-window data.", tags: ["bsc", "free-mint", "nft", "discovery"] },
    { id: "safety-gate", name: "Verify a mint before touching it", description: "Runs the full safety gate on a candidate: Sourcify exact_match source verification, drain-pattern source scan, and market gate.", tags: ["security", "verification", "sourcify", "drain-scan"] },
    { id: "mint-signal", name: "Publish a verified mint signal", description: "Returns the latest verified free-mint signal: contract, token, gate verdict, and expiry. Paid per call via x402.", tags: ["signal", "mint", "verified", "x402"] },
    { id: "price-watch", name: "Track highest sale prices", description: "Tracks the highest verified marketplace sale price per owned collection.", tags: ["price", "sales", "tracking"] },
  ],
  provider: { organization: "abogo", url: "https://www.encodeclub.com/programmes/concordium-trusted-agents-hackathon" },
  documentation_url: "https://github.com/Ubattronjol/concordium-abogo#readme",
};

const out = await call("tools/call", { name: "build_agent_card", arguments: args }, 1);
const text = out?.result?.content?.[0]?.text;
if (!text) {
  console.log(JSON.stringify(out, null, 1).slice(0, 2000));
  process.exit(1);
}
const card = JSON.parse(text);
writeFileSync("agent-card.built.json", JSON.stringify(card, null, 2) + "\n");
console.log("card written: agent-card.built.json");
console.log(JSON.stringify(card, null, 1).slice(0, 2500));
