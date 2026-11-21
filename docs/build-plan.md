# Build plan — abogo × Concordium (3 weeks, testnet)

Dates: build 19 Nov – 9 Dec 2026. Final submit closes **9 Dec 23:59 UTC**
(10 Dec 06:59 WIB); the platform locks at the deadline — submit early.
Office hours: Tue & Fri 15:00 UTC, 24 Nov – 8 Dec.

## Week 1 — Identity + Registry + Agent Card (19–25 Nov)

Goal: abogo registered on testnet with an Active badge and a verified card.

1. **Arbo: install Concordium Wallet for Web** (Chrome Web Store →
   "Concordium Wallet"), create passcode, **write down the 24-word seed
   phrase and store it privately** (Arbo only — never in chat/files).
2. **Arbo: switch the wallet to Testnet** (menu → Network → Testnet; UI
   turns green) and **request a test identity** — select
   **"Concordium testnet IP"**. No real ID document is needed on testnet:
   the test IP issues a mock identity. Then **Create account** from that
   identity. Record the account address.
3. **Arbo: claim test CCD** — wallet → account → Activity → Request CCD.
   **Confirmed 21 Nov: 20,000 CCD lands** (the setup-env page's 2,000 was
   wrong). More than enough for registry transactions.
4. Repro: call MCP `contract_info` / `network_status` for testnet and
   confirm CIS-8004 `<12802,0>` (already verified 19 Nov — see
   `docs/testnet-facts.md`).
5. Generate the real card with MCP `build_agent_card` (owner account from
   step 2, `agent_uri` = the GitHub Pages URL, skills as in
   `agent-card.json`). Host it at that URL — **byte-stable, no
   reformatting** — and record its SHA-256 (`npm run card:hash`).
6. Build the register payload with MCP `build_register`
   (`agent_uri` + `metadata_hash_hex` + sender = owner account).
   **Arbo signs + submits it in the Browser Wallet — via the official
   Agent Registry DApp, https://agent-registry.concordium.com**
   (connect wallet on testnet → "Register Your Agent for Free" → paste
   the agent URI; the DApp builds and submits the register transaction —
   no custom register page needed). The MCP `build_register` payload
   (`register-payload.json`) is the cross-check for what the DApp
   submits. Result: agent NFT minted, `token_id` issued.
7. Confirm with MCP `verify_agent_card` → `match: true`.
8. **Badge, second pass:** `GET /v1/get-badge-JSON/<badge>` → paste the
   extension into the card → re-host → re-hash → pin with
   `build_set_agent_uri` (Arbo signs) → confirm with
   `GET /v1/check-badge/<badge>` (`badge_valid`, `extension_conformant`,
   `verification_present` all `true`, empty `issues`).
9. **Optional (stretch): CIS-8 link to the BSC wallet.**
   `build_cis8_canonical_bytes` (Concordium account + `eip155:56` +
   uncompressed secp256k1 pubkey of `0x9BDdB92088fe1dA652Cc2E7F99a5B4D06F2d8C4d`)
   → personal-sign with the agent wallet → `build_cis8_register` →
   re-register with `Cis8` external reference. **Open question: does the
   Binance Agentic Wallet (`baw`) support arbitrary personal-sign?** If not,
   skip — native-only registration still earns the badge.
10. Flip `x402Support` to `true` in the card at the end of week 2 via
    `build_set_agent_uri` (the card is pinned in week 1 with `false`).

Exit criteria: badge string in hand, `check-badge` green,
`verify_agent_card` `match: true`, card live at its public URL.

## Week 2 — x402 buyer + seller (26 Nov – 2 Dec)

Goal: a complete pay-per-call loop in test CCD, both directions.

1. Install + smoke-test `@x402/concordium` (done 19 Nov: v2.31.0 imports
   clean; `npm run smoke:x402`).
2. **Seller — `src/server.mjs`:** `GET /signals/mint` returns the latest
   verified free-mint signal; protected by `@x402/concordium` server
   middleware. Price: a small fixed amount of test CCD per call (set at
   implementation; must be > 0 and cheap enough to demo repeatedly).
3. **Facilitator — `src/facilitator.mjs`:** self-hosted
   `@x402/concordium` facilitator. It verifies the 9 security rules, adds
   the sponsor signature, submits, and waits for finalisation (~10 s).
   Needs a sponsor key funded with test CCD (faucet, testnet only).
4. **Buyer — `src/client-buy-signal.mjs`:** fetches the signal endpoint,
   receives 402, **first verifies the seller's badge**
   (`check_badge` / `verify_agent_card` via MCP), then builds and
   sender-signs the sponsored transaction and resends with `X-PAYMENT`.
   The client never broadcasts; the facilitator submits.
5. Demo the loop end-to-end on testnet and capture: 402 response,
   payment payload, facilitator verification, finalised tx hash on
   `testnet.ccdscan.io`, and the returned signal.
6. **Settlement asset decision (fixed): test CCD, not a PLT stablecoin.**
   Testnet PLT has no public faucet — issuance needs a manual request
   form to Concordium. CCD keeps week 2 self-contained. See
   `docs/x402-design.md`.

Exit criteria: one recorded loop, buyer → 402 → badge check → pay →
facilitator → finalised tx → signal delivered; tx link on CCDScan testnet.

## Week 3 — Demo + submit (3–9 Dec)

1. Record the demo video (≤3 min): problem → badge verification →
   x402 loop → CCDScan link → what it would take to go live.
2. Make this repo public; confirm every link in the submission is public.
3. Submit from the Encode Club project page:
   https://www.encodeclub.com/my-programmes/concordium-trusted-agents-hackathon
   — description, repo URL, video, CCDExplorer link, path to production.
4. Submit at least a day early (8 Dec target) — the platform locks at the
   deadline.

## Path to production (for the submission)

- Mainnet: same contracts at CIS-8004 `<10082,0>` / CIS-8 `<10081,0>`;
  operator identity verified with a real IDP (passport + liveness) instead
  of the test IP; agent re-registered on mainnet.
- The mint-signal feed goes from demo pricing to a real price in a
  mainnet PLT stablecoin; the facilitator becomes a hosted service with
  its own sponsor funding and rate limits.
- abogo's BSC minting continues unchanged — Concordium is the trust layer,
  not the minting chain.
