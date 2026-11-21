// Self-hosted @x402/concordium facilitator.
// SCAFFOLD (week 2): expose /supported, /verify, /settle per the x402
// facilitator spec, funded by the sponsor key in .env (testnet only).
// The facilitator verifies the 9 security rules, adds the sponsor
// signature, submits the sponsored transaction, and waits for finalisation.
import { ExactConcordiumScheme } from "@x402/concordium/exact/facilitator";

const PORT = Number(process.env.X402_FACILITATOR_PORT ?? 4022);

// TODO (week 2): build the facilitator with the sponsor signer
// (CCD_FACILITATOR_ADDRESS + CCD_FACILITATOR_PRIVATE_KEY from .env),
// fund the sponsor account with test CCD from the faucet, and expose:
//   GET  /supported  -> networks, assets, feePayer
//   POST /verify     -> verify payload against the 9 security rules
//   POST /settle     -> sponsor-sign, submit, wait for finalisation
// See @x402/concordium README (exact/facilitator) for the call shapes.
const scheme = new ExactConcordiumScheme();
console.log("facilitator scaffold loaded; scheme =", typeof scheme);
console.log(`TODO: serve facilitator endpoints on :${PORT}`);
