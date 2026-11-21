# x402 design — abogo

## Decision summary

| Question | Decision | Why |
| --- | --- | --- |
| Settlement asset | **Test CCD** (native, 6 decimals) | Testnet PLT has no public faucet: issuing a test stablecoin needs a manual request form to Concordium and manual issuance to a governance account. CCD keeps week 2 self-contained and demoable. |
| Seller | abogo's mint-signal feed (`GET /signals/mint`) | The feed is abogo's real, existing output: a verified free-mint signal (contract, gate verdict, expiry). Charging per call is the honest product. |
| Buyer | abogo as a client paying for data | Proves the other direction of the loop and, critically, that abogo **checks the seller's badge before paying** — the trust story the hackathon judges. |
| Facilitator | Self-hosted `@x402/concordium` facilitator | Official package (merged into the x402 repo 26 Jun 2026). The facilitator sponsors gas, so the buyer never needs CCD for fees — the feature Concordium highlights. |
| Counterparty for the buyer demo | Prefer an external live seller; fallback is our own second endpoint | Paying our own second endpoint is a weaker demo. First choice to evaluate in week 2: the FIZZL x402 Doctor testnet facilitator/service (live, built for this hackathon). If it doesn't fit, run a second independent seller service (different key, different endpoint) and say so plainly in the video. |

## The loop (Exact scheme, sponsored tx V1)

```
buyer (abogo client)                seller (abogo server)         facilitator
  │  GET /signals/mint                 │                              │
  │ ─────────────────────────────────► │                              │
  │  402 + PaymentRequirements         │                              │
  │ ◄───────────────────────────────── │                              │
  │  1. check_badge(seller) via MCP    │                              │
  │  2. build + sender-sign sponsored  │                              │
  │     tx (facilitator as sponsor)    │                              │
  │  GET /signals/mint + X-PAYMENT     │                              │
  │ ─────────────────────────────────► │ ── verify (9 rules) ──────► │
  │                                     │ ◄── sponsor sign + submit ── │
  │                                     │        wait finalisation (~10s)
  │  200 + signal                      │                              │
  │ ◄───────────────────────────────── │                              │
```

Notes:

- The client **never broadcasts** — the facilitator submits after
  sponsoring. The buyer's key only ever signs the payment itself.
- The 9 facilitator security rules bind sponsorship to the exact
  recipient, amount, asset, and expiry, so the facilitator cannot move
  funds it was not asked to move.
- Settlement is final when the block is final (~10 s deterministic
  finality on Concordium).
- The `agentWallet` on-chain metadata key (set via
  `build_set_agent_wallet`) is the payment wallet that receives the
  seller's income. Decision: point it at the owner testnet account
  first; a dedicated agent sub-account is possible later.

## What abogo pays for (buyer side)

The buyer demo pays for **external data abogo actually consumes**: a
preflight safety check on a mint candidate (the x402 Doctor pattern —
check a paid API before paying for it) or a price-feed call. The
concrete seller is chosen in week 2; the requirement is that it is a
real third-party x402 endpoint on testnet, not abogo paying itself.

## What abogo charges for (seller side)

One verified mint signal per call: contract address, token id / supply,
gate verdict (exact_match, drain scan, market gate), and expiry. Price
is a small fixed amount of test CCD, set at implementation time — cheap
enough to demo repeatedly, non-zero so the 402 path actually triggers.

## What this proves (judging)

- **Depth of integration:** identity (badge check before payment) +
  registry (the seller is resolvable on-chain) + payments (x402 with
  sponsored transactions) — all three in one loop.
- **It works:** end-to-end, with a finalised transaction link on
  testnet CCDScan.
- **Usefulness:** agents that pay for data need to know the seller is
  accountable before money moves; the badge check is that gate.
