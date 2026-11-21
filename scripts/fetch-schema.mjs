// Fetch the CIS-8004 testnet module's embedded schema via gRPC-web (read-only).
// Usage: NODE_EXTRA_CA_CERTS=/run/hatch/egress-tls/ca-bundle.pem node scripts/fetch-schema.mjs
import { writeFileSync } from "node:fs";
import { ConcordiumGRPCWebClient } from "@concordium/web-sdk";
import { ModuleReference } from "@concordium/common-sdk";

const MOD = "0e57473715d1c2a364fa626b8783688db32b7fac9d0e2fc97043da91e1a7d3eb";
const client = new ConcordiumGRPCWebClient("grpc.testnet.concordium.com", 20000);
const schema = await client.getEmbeddedSchema(new ModuleReference(MOD));
console.log("schema:", schema === undefined ? "undefined (no embedded schema)" : JSON.stringify(schema).slice(0, 400));
if (schema) {
  const b = Buffer.from(schema.value ?? schema);
  console.log("schema bytes:", b.length, "version:", schema.version);
  writeFileSync("cis8004-schema.b64", b.toString("base64"));
  console.log("schema written: cis8004-schema.b64");
}
