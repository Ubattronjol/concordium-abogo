// Read-only MCP probes against the hosted Agent Registry service.
// No keys, no transactions. Usage: node scripts/mcp-probe.mjs
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

const tools = await call("tools/list");
console.log("tools:", tools.result.tools.length);

for (const net of ["testnet", "mainnet"]) {
  const info = await call("tools/call", { name: "contract_info", arguments: { network: net } }, 2);
  console.log(`\ncontract_info ${net}:`, JSON.stringify(JSON.parse(info.result.content[0].text), null, 1).slice(0, 600));
}
const status = await call("tools/call", { name: "network_status", arguments: { network: "testnet" } }, 3);
console.log("\nnetwork_status testnet:", status.result.content[0].text.slice(0, 500));
