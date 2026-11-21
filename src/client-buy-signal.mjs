// Buyer side: pay for a mint signal over x402 — but check the seller's
// Verified by Concordium badge BEFORE paying.
// SCAFFOLD (week 2): wire the client signing + facilitator settle calls.
import { ExactConcordiumScheme } from "@x402/concordium/exact/client";

const SIGNAL_URL = process.env.SIGNAL_URL ?? "http://127.0.0.1:4021/signals/mint";
const MCP = "https://agent-registry-mcp.concordium.com";

// Step 1: ask for the signal. Expect 402 + PaymentRequirements.
const first = await fetch(SIGNAL_URL);
console.log("first response:", first.status);
if (first.status !== 402) {
  console.log(await first.text());
  process.exit(0);
}
const requirements = await first.json();
console.log("payment requirements:", JSON.stringify(requirements).slice(0, 500));

// Step 2: verify the seller's badge BEFORE paying.
// TODO (week 2): resolve the seller's badge string from the requirements
// (seller advertises it in its Agent Card) and call:
//   GET ${MCP}/v1/check-badge/<badge>
// Require badge_valid === true and hash_matches_on_chain === true.
// Refuse to pay when the check fails.
console.log("TODO: check_badge(seller) via", MCP, "— refuse to pay on failure.");

// Step 3: build + sender-sign the sponsored transaction.
// TODO (week 2): ExactConcordiumScheme client with the demo signer
// (CCD_DEMO_ADDRESS + CCD_DEMO_PRIVATE_KEY from .env, testnet only),
// then resend GET with the X-PAYMENT header and print the signal.
// The client never broadcasts — the facilitator submits.
console.log("TODO: ExactConcordiumScheme client sign + resend with X-PAYMENT.");
