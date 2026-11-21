import * as client from "@x402/concordium/exact/client";
import * as server from "@x402/concordium/exact/server";
import * as facilitator from "@x402/concordium/exact/facilitator";
console.log("client exports:", Object.keys(client).join(", "));
console.log("server exports:", Object.keys(server).join(", "));
console.log("facilitator exports:", Object.keys(facilitator).join(", "));
