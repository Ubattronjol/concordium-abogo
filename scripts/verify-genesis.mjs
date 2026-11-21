// Verify testnet genesis hash directly against the live testnet node (read-only).
import { ConcordiumGRPCWebClient } from "@concordium/web-sdk";

const client = new ConcordiumGRPCWebClient("grpc.testnet.concordium.com", 20000);
const status = await client.getConsensusStatus();
const genesis = status.genesisBlock?.value ?? status.genesisBlock;
console.log(JSON.stringify({
  genesisBlock: genesis,
  genesisTime: status.genesisTime,
  bestBlockHeight: status.bestBlockHeight?.toString?.() ?? String(status.bestBlockHeight),
  lastFinalizedBlockHeight: status.lastFinalizedBlockHeight?.toString?.() ?? String(status.lastFinalizedBlockHeight),
  expected: "4221332d34e1694168c2a0c0b3fd0f273809612cb13d000d5c2e00e85f50f796",
  match: genesis === "4221332d34e1694168c2a0c0b3fd0f273809612cb13d000d5c2e00e85f50f796",
}, null, 2));
