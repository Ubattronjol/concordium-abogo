# abogo — Verified Autonomous NFT Agent

Entry for the **Concordium Trusted Agents Hackathon** (Encode Club).
Checkpoint 1 done (19 Nov 2026, status Registered).
Final submission closes **9 Dec 2026, 23:59 UTC** (10 Dec 06:59 WIB).

## What abogo is

abogo is a live, working AI agent that hunts gas-only free NFT mints on BNB
Chain and mints them only when they pass strict safety gates:

- **Sourcify `exact_match`** source verification
- **Drain-pattern source scan** (withdraw/selfdestruct/delegatecall/upgrade, …)
- **Market gate** (own-market functions or a verified marketplace sale)

It runs on a Binance Agentic Wallet (Agent ID `abogo.ai`) and holds 92 NFTs.
In this hackathon abogo gains a Concordium trust layer:

1. **Verified by Concordium badge** — the operator's identity is verified once
   by an independent Identity Provider; the badge proves an accountable person
   stands behind the agent without revealing who.
2. **Agent Registry (CIS-8004)** — an on-chain NFT identity, resolvable by
   token ID or badge string.
3. **ERC-8004 Agent Card** — one JSON document that is both an ERC-8004
   registration file and an A2A v1.0 Agent Card.
4. **x402 payments** — abogo pays other agents for data and charges for its
   verified mint-signal feed, settled in test CCD via sponsored transactions.

## Architecture

```
BSC (live, today)                  Concordium testnet (this build)
┌─────────────────────┐            ┌──────────────────────────────────┐
│ abogo agent         │            │ Agent Registry CIS-8004 <12802,0>│
│  Agent ID abogo.ai  │            │  agent NFT ──► agent-card.json   │
│  92 NFTs, safety    │  badge +   │  (SHA-256 pinned on-chain)       │
│  gates, price watch │  card      │                                  │
└──────────┬──────────┘            │ CIS-8 <12801,0> (optional link  │
           │                       │  to BSC wallet 0x9BDd…2d8C4d)    │
           │ x402                  │                                  │
           ▼                       │ x402 facilitator (self-hosted,   │
┌─────────────────────┐            │  @x402/concordium) pays gas;    │
│ mint-signal feed    │◄──────────►│  buyer/seller settle in test CCD │
│  GET /signals/mint  │  402 + pay │                                  │
└─────────────────────┘            └──────────────────────────────────┘
```

## Verified network facts (testnet)

| Item | Value |
| --- | --- |
| Node (gRPC v2 / gRPC-web) | `https://grpc.testnet.concordium.com:20000` |
| Genesis hash | `4221332d34e1694168c2a0c0b3fd0f273809612cb13d000d5c2e00e85f50f796` |
| CAIP-2 | `ccd:4221332d34e1694168c2a0c0b3fd0f27` |
| CIS-8004 Agent Registry | `<12802,0>` |
| CIS-8 External Key Registry | `<12801,0>` |
| Testnet CCD (CAIP-19) | `ccd:4221332d34e1694168c2a0c0b3fd0f27/slip44:919` |
| MCP service | `https://agent-registry-mcp.concordium.com/mcp` (41 tools, no auth) |
| REST twins | `https://agent-registry-mcp.concordium.com/v1/…` |
| Indexer | `https://agent-registry-indexer.concordium.com/` |
| Explorer | `https://testnet.ccdscan.io` |
| Faucet | 20,000 test CCD once per account, Browser Wallet → Activity → Request CCD (confirmed 21 Nov 2026; the setup-env page's 2,000 was wrong) |

Mainnet (for reference only — the entry builds on testnet): CIS-8004
`<10082,0>`, CIS-8 `<10081,0>`, CAIP-2 `ccd:9dd9ca4d19e9393877d2c44b70f89acb`.

## Repo map

| Path | What it is |
| --- | --- |
| `agent-card.json` | Agent Card, built 21 Nov 2026 via MCP `build_agent_card` (owner `4cLP...zACC`, SHA-256 `76b3d458…`). Identical bytes served at `.well-known/agent-card.json`. `tokenAddress` stays null until the register TX mints the NFT — then rebuild with the token id. |
| `.well-known/agent-card.json` | The hosted card (byte-identical to `agent-card.json`). Served by GitHub Pages at `https://ubattronjol.github.io/concordium-abogo/.well-known/agent-card.json`. |
| `src/server.mjs` | x402-protected mint-signal endpoint (seller side). |
| `src/client-buy-signal.mjs` | x402 buyer demo: verify seller badge, then pay (buyer side). |
| `src/facilitator.mjs` | Self-hosted `@x402/concordium` facilitator (sponsors gas). |
| `scripts/verify-genesis.mjs` | Read-only check of the testnet genesis hash via web-sdk. |
| `scripts/smoke-x402.mjs` | Import smoke test for `@x402/concordium` client/server/facilitator. |
| `scripts/card-hash.mjs` | SHA-256 of the served card bytes (what verifiers compare). |
| `scripts/mcp-probe.mjs` | Read-only MCP probes (`contract_info`, `network_status`, …). |
| `docs/build-plan.md` | Concrete 3-week build plan. |
| `docs/x402-design.md` | x402 design decisions and why. |
| `docs/testnet-facts.md` | How every testnet fact above was verified. |

## Quickstart (dev, testnet only)

```bash
npm install
cp .env.example .env   # fill in — NEVER commit .env
npm run server         # x402 mint-signal endpoint on :4021
npm run facilitator    # local facilitator (needs sponsor key in .env)
npm run client:buy-signal   # buyer demo against the local server
```

Signing and account creation happen in the **Concordium Browser Wallet**
(Arbo's browser). This repo never holds a seed phrase or a mainnet key.
Testnet keys in `.env` are demo-only; rotate them if they ever leak.

## Judging criteria (from Encode Club)

Depth of integration (identity, Agent Registry, payments) · credible path to
production · core flow works end-to-end · solves a real problem.
Transaction counts play no part.

## Status

- [x] Checkpoint 1 (project + team + idea) — 19 Nov 2026
- [x] Week 1 (part): testnet identity + account + 20,000 CCD faucet — 21 Nov 2026
- [x] Week 1 (part): Agent Card built via MCP, SHA-256 pinned — 21 Nov 2026
- [ ] Week 1 (rest): host card on GitHub Pages → register via Agent Registry DApp → verify card
- [ ] Week 2: x402 buyer + seller, facilitator live
- [ ] Week 3: demo video (≤3 min), final submit (9 Dec)
