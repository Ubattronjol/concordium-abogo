// Build the sign-ready CIS-8004 register payload (no keys, no submission).
// Output: register-payload.json — Arbo signs + submits this in his Browser Wallet.
// Usage: node scripts/build-register.mjs
import { writeFileSync } from "node:fs";

const BASE = "https://agent-registry-mcp.concordium.com/mcp";

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
  sender: "4cLPgWjrEecJnH4uPExRX8fvHhpkjWVoKbYFkrEXVwfW5mzACC",
  agent_uri: "https://ubattronjol.github.io/concordium-abogo/.well-known/agent-card.json",
  metadata_hash_hex: "76b3d458bce285607362967410a7804cab503ebc3785f52646bd1b40d975ba00",
};

const out = await call("tools/call", { name: "build_register", arguments: args }, 1);
writeFileSync("register-payload.json", JSON.stringify(out, null, 2) + "\n");
console.log(JSON.stringify(out, null, 1).slice(0, 3000));
