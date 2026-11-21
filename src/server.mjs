// Seller side: x402-protected mint-signal endpoint.
// SCAFFOLD (week 2): wire the facilitator URL + price from .env, then run.
// Flow: GET /signals/mint without payment -> 402 + PaymentRequirements.
// With a valid X-PAYMENT header -> facilitator verifies -> 200 + signal.
import { createServer } from "node:http";
import { ExactConcordiumScheme } from "@x402/concordium/exact/server";

const PORT = Number(process.env.X402_PORT ?? 4021);
// TODO (week 2): set the facilitator URL that serves /supported + /verify + /settle.
const FACILITATOR_URL = process.env.X402_FACILITATOR_URL ?? "http://127.0.0.1:4022";
// TODO (week 2): fixed price per signal call, in test CCD micro-units (1 CCD = 1_000_000 microCCD).
const PRICE_MICRO_CCD = process.env.SIGNAL_PRICE_MICRO_CCD ?? "10000"; // 0.01 CCD

const scheme = new ExactConcordiumScheme();

function latestSignal() {
  // TODO (week 2): replace with the real latest verified signal from abogo's
  // buru-alpha pipeline (contract, gate verdict, expiry). Never serve a
  // signal that did not pass the full safety gate.
  return {
    contract: "TBD_CONTRACT",
    gate: { exact_match: true, drain_scan: "clean", market_gate: "pass" },
    note: "SCAFFOLD — no real signal yet",
    signal: "none",
  };
}

const server = createServer(async (req, res) => {
  if (req.url !== "/signals/mint" || req.method !== "GET") {
    res.writeHead(404).end("not found");
    return;
  }
  const payment = req.headers["x-payment"];
  if (!payment) {
    // TODO (week 2): build PaymentRequirements via the server scheme
    // (price, asset = test CCD, payTo = agentWallet, facilitator feePayer),
    // then answer 402 with them. The `scheme` import above is verified to
    // load; the exact requirements-building call is wired in week 2.
    res.writeHead(402, { "Content-Type": "application/json" }).end(
      JSON.stringify({
        error: "payment required",
        price_micro_ccd: PRICE_MICRO_CCD,
        asset: "ccd:4221332d34e1694168c2a0c0b3fd0f27/slip44:919",
        facilitator: FACILITATOR_URL,
        todo: "wire ExactConcordiumScheme PaymentRequirements here",
      })
    );
    return;
  }
  // TODO (week 2): verify the X-PAYMENT payload with the facilitator
  // (POST /verify); on success return the signal, else 402 again.
  res.writeHead(200, { "Content-Type": "application/json" }).end(
    JSON.stringify({ ...latestSignal(), todo: "verify X-PAYMENT via facilitator" })
  );
});

server.listen(PORT, () => console.log(`mint-signal server on :${PORT}`));
