# Testnet facts — how each value was verified (19 Nov 2026)

All values below were verified live on 19 Nov 2026. Anything not verified
this way is marked as such.

## Registry contracts (testnet)

Source: hosted MCP service, `tools/call contract_info` (read-only).

- CIS-8004 Agent Registry: **index 12802, subindex 0**; module
  `0e57473715d1c2a364fa626b8783688db32b7fac9d0e2fc97043da91e1a7d3eb`;
  admin `3whdieGHx43KKRwQYbC5pAUdmWZ61B7yreNRU9i36MtdCvajR8`.
- CIS-8 External Key Registry: **index 12801, subindex 0**; module
  `3236c12fade1b559935906df2e0e43a372234eac5d40599d6e6cb12cdd6b9afd`.
- Explorer base: `https://testnet.ccdscan.io`.

Cross-check: `agent_registry_capabilities` (testnet) returns the same
contracts in its `backends.chain` block, and all 41 tools are available
with none unavailable. Mainnet cross-check returned `<10082,0>` /
`<10081,0>` as documented.

## Network

- Node (gRPC v2 / gRPC-web): `https://grpc.testnet.concordium.com:20000`
  (from MCP `network_status` + Concordium dev-env docs; latest testnet
  block at probe time: 51011307).
- Mainnet node (reference): `https://grpc.mainnet.concordium.software:20000`.

## Genesis hash / CAIP-2 (testnet)

Full genesis hash:
`4221332d34e1694168c2a0c0b3fd0f273809612cb13d000d5c2e00e85f50f796`

CAIP-2: `ccd:4221332d34e1694168c2a0c0b3fd0f27`

Verified by three independent published sources that agree:

1. Chain Agnostic namespaces, CAIP-2 profile
   (`namespaces.chainagnostic.org/ccd/caip2`): example response for the
   testnet node gives genesis `4221332d34e1694168c2a0c0b3fd0f273809612…`
   and CAIP-2 `ccd:4221332d34e1694168c2a0c0b3fd0f27`.
2. SubQuery Concordium manifest docs: `chainId:
   "4221332d34e1694168c2a0c0b3fd0f273809612cb13d000d5c2e00e85f50f796"`.
3. Concordium forum node output (2022): `Genesis block:
   4221332d34e1694168c2a0c0b3fd0f273809612cb13d000d5c2e00e85f50f796`,
   genesis time 2022-06-13 10:00:00 UTC.

Derived CAIP identifiers (testnet):

- CCD (CAIP-19): `ccd:4221332d34e1694168c2a0c0b3fd0f27/slip44:919`
- CIS-8004 contract (CAIP-10): `ccd:4221332d34e1694168c2a0c0b3fd0f27:12802.0`
- CIS-8 contract (CAIP-10): `ccd:4221332d34e1694168c2a0c0b3fd0f27:12801.0`

**Caveat:** a direct gRPC-web call from this VM to the testnet node
(`ConcordiumGRPCWebClient.getConsensusStatus`) failed with `fetch
failed`, although plain HTTPS to the same host returns 200 and the
hosted MCP service reads the node fine. Cause not established (likely
proxy/transport handling of grpc-web from this VM). Operational rule:
do chain reads through the hosted MCP service from this VM; signing and
submission go through the Browser Wallet anyway. Re-test the direct
node path during execution; script kept at
`scripts/verify-genesis.mjs`.

## MCP service

- Hosted: `https://agent-registry-mcp.concordium.com`
  (`/healthz` → `{"ok":true,"version":"0.1.0"}`).
- MCP endpoint `https://agent-registry-mcp.concordium.com/mcp`:
  JSON-RPC 2.0, stateless, no auth; `tools/list` returns **41 tools**
  (docs say 40 — doc drift; extras: `build_set_external_reference`,
  `get_agent_wallet_nonce`).
- REST twins (no auth, CORS open, per-IP rate limit):
  `GET /v1/get-badge-JSON/{badge}`,
  `GET /v1/check-badge/{badge or account}` (alias `/v1/badge-check/{id}`),
  `GET /v1/verify-agent-card/{badge}`,
  `GET /v1/build-set-agent-uri/{badge}?metadata_hash_hex=&agent_uri=&sender=`,
  `GET /openapi.json`, `GET /docs`.
- Verified live: `check-badge` on the documented example badge
  `Mf22soLh1NuZYFgBK8iSs` → `badge_valid: true`, token 484, owner
  `4DDvjwdcLmTy1Ar9FCKKPMiABrS261TvyXJGr4n4ypuuogXeFF`, card hash
  matches on-chain. (Note: that badge is mainnet; `?network=testnet`
  does not change badge resolution — the network is resolved from the
  badge itself.)
- Indexer: `https://agent-registry-indexer.concordium.com/` (routes at `/`).

## Wallet + identity (testnet)

- Browser Wallet for Web: Chrome Web Store → "Concordium Wallet".
  Setup: passcode → **24-word seed phrase (write down, Arbo only)** →
  choose Mainnet or Testnet → request identity → create account.
- **Testnet identity needs no real documents.** Select
  **"Concordium testnet IP"** — it issues a mock identity.
  (Sources: Concordium exchange-onboarding docs — "Testnet works like
  mainnet, but identities are issued without verification"; dev-env
  setup — "You don't have to provide an ID to create an identity on
  testnet when selecting `Concordium testnet IP`"; Encode Concordium 101
  — "Testnet process: much simpler, you receive a mock identity".)
- Mainnet is the opposite: passport/ID photo + selfie/liveness via a
  real IDP (Notabene, Digital Trust Solutions, Global FinReg).
- Network switch in the wallet: menu → Network → Mainnet/Testnet.
  Accounts and identities are NOT shared between networks.

## Faucet

- Browser Wallet → account → Activity → Request CCD. Official tutorial
  says **20,000 CCD** credited within seconds, once per account, only
  for accounts with no incoming transactions.
- **Discrepancy:** the dev-env setup page says 2,000 CCD. Flagged —
  verify the actual amount at claim time.
- No public faucet for testnet PLT stablecoins: issuing a test PLT
  needs the official issuance request form and manual issuance by
  Concordium (per `@x402/concordium` README).

## x402

- Package `@x402/concordium` v2.31.0 on npm ("x402 Payment Protocol
  Concordium Implementation"). Installed 19 Nov; import smoke test
  passes (`ExactConcordiumScheme` in client/server/facilitator).
- Exact scheme + sponsored transactions V1; facilitator verifies 9
  security rules, sponsors gas, submits, waits for finalisation
  (~10 s). Supported assets: native CCD (6 decimals) and PLT.
- Third-party option noted for evaluation: FIZZL x402 Doctor runs a
  live x402 facilitator on Concordium testnet (built for this
  hackathon). Not an endorsement — evaluate in week 2.

## Toolchain (this VM, 19 Nov 2026)

- Node v24.22.1, npm 10.9.4.
- `@concordium/web-sdk` 12.0.2 and `@concordium/node-sdk` 9.5.3
  installed in this repo (npm registry reachable).
- `concordium-client` NOT installed; latest release 10.0.0-0-rc, Linux
  binary:
  `https://github.com/Concordium/concordium-client/releases/download/10.0.0-0-rc/concordium-client-linux`
  (cargo is not installed on this VM). Optional tooling, not required —
  the wallet + MCP cover the registry flow.
