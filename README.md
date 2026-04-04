# madeonsol

[![npm version](https://img.shields.io/npm/v/madeonsol?style=flat-square)](https://www.npmjs.com/package/madeonsol)
[![npm downloads](https://img.shields.io/npm/dm/madeonsol?style=flat-square)](https://www.npmjs.com/package/madeonsol)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4+-blue?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen?style=flat-square)](package.json)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

Official TypeScript/JavaScript SDK for the **[MadeOnSol](https://madeonsol.com) Solana API** — zero dependencies, fully typed, works in Node.js ≥ 18 and edge runtimes.

> **Build Solana trading bots, analytics dashboards, KOL copy-trading tools, deployer sniper bots, and ecosystem browsers.**

| Feature | Description |
|---|---|
| **KOL Tracker** | Real-time trade feed, PnL leaderboard, coordination detection, and per-wallet profiles for 946 tracked KOL wallets |
| **Deployer Hunter** | Pump.fun deployer scoring, tier leaderboard, deploy alerts, and bonding intelligence |
| **DEX Trade Stream** | Real-time WebSocket stream of ALL Solana DEX trades — filter by token, wallet, program, or trade size (Ultra) |
| **Webhooks** | Push notifications for KOL trades, coordination signals, and deployer alerts (Pro/Ultra) |
| **Tool Directory** | Search 950+ Solana tools and dApps indexed on MadeOnSol |

**Links:** [Full API docs](https://madeonsol.com/solana-api) · [Website](https://madeonsol.com) · [RapidAPI listing](https://rapidapi.com/ClaudeTools/api/madeonsol-solana-kol-tracker-tools-api)

---

## Install

```bash
npm install madeonsol
# or
yarn add madeonsol
# or
pnpm add madeonsol
```

Requires **Node.js ≥ 18** (uses native `fetch`). Works out of the box in Cloudflare Workers, Vercel Edge, and Bun.

---

## Quick start

```ts
import { MadeOnSol } from "madeonsol";

const client = new MadeOnSol({ apiKey: "your-rapidapi-key" });

// Latest KOL buy trades
const { trades } = await client.kol.feed({ limit: 10, action: "buy" });
console.log(trades[0].kol_name, "bought", trades[0].token_symbol);

// Elite deployer leaderboard
const { deployers } = await client.deployer.leaderboard({ tier: "elite" });

// Recent deploy alerts
const { alerts } = await client.deployer.alerts({ limit: 5 });

// Search Solana tools
const { tools } = await client.tools.search({ q: "trading", limit: 10 });
```

Get your API key at [RapidAPI](https://rapidapi.com/ClaudeTools/api/madeonsol-solana-kol-tracker-tools-api).

---

## Use cases

- **Copy-trading bot** — stream KOL buys via `client.kol.feed()` and mirror trades
- **DEX trade sniping** — subscribe to the all-DEX stream filtered by token or wallet
- **Deployer sniper** — monitor `client.deployer.alerts()` for elite-tier launches
- **Coordination detector** — flag tokens with `client.kol.coordination({ min_kols: 3 })`
- **Analytics dashboard** — combine leaderboard, PnL, and tool data
- **Telegram/Discord bot** — pipe alerts via webhooks into chat
- **Portfolio tracker** — use `client.kol.wallet()` to follow specific KOL positions

---

## API Reference

### KOL Tracker — `client.kol`

#### `client.kol.feed(params?)`

Live feed of trades made by tracked KOL wallets.

```ts
const { trades, count } = await client.kol.feed({
  limit: 50,      // 1–100, default 50
  action: "buy",  // "buy" | "sell"
  kol: "7xKX...", // filter by specific wallet
});
```

Returns: `KolFeedResponse` — `{ trades: KolTrade[], count: number }`

---

#### `client.kol.leaderboard(params?)`

KOL PnL leaderboard ranked by realized profit.

```ts
const { leaderboard, period } = await client.kol.leaderboard({
  period: "7d", // "today" | "7d" | "30d", default "7d"
});
```

Returns: `KolLeaderboardResponse`

---

#### `client.kol.wallet(wallet, params?)`

Full profile for a single KOL wallet, including trade history and optional per-token PnL breakdown.

```ts
const profile = await client.kol.wallet("7xKX...", {
  include: "pnl_by_token",
});
```

Returns: `KolWalletProfile`

---

#### `client.kol.coordination(params?)`

Detect tokens where multiple KOLs are buying simultaneously — a strong signal of coordinated pumps.

```ts
const { tokens } = await client.kol.coordination({
  period: "24h",   // "1h" | "6h" | "24h" | "7d", default "24h"
  min_kols: 3,     // 2–50, default 3
  limit: 20,       // 1–50, default 20
});
```

Returns: `KolCoordinationResponse`

---

#### `client.kol.token(mint)`

KOL buy/sell activity for a specific token mint.

```ts
const activity = await client.kol.token("EPjFW...");
```

Returns: `KolTokenActivity`

---

### Deployer Hunter — `client.deployer`

#### `client.deployer.stats()`

Global statistics across all tracked deployer wallets.

```ts
const stats = await client.deployer.stats();
console.log(stats.overall_bonding_rate); // e.g. 0.043
```

Returns: `DeployerStats`

---

#### `client.deployer.leaderboard(params?)`

Deployers ranked by bonding rate or recent performance.

```ts
const { deployers } = await client.deployer.leaderboard({
  tier: "elite",          // "elite" | "good" | "moderate" | "rising" | "cold"
  sort: "bonding_rate",   // "bonding_rate" | "recent_bond_rate" | "total_bonded" | "last_deploy_at"
  limit: 20,              // 1–50, default 20
  offset: 0,
});
```

Returns: `DeployerLeaderboardResponse`

---

#### `client.deployer.profile(wallet)`

Full profile for a single deployer wallet.

```ts
const deployer = await client.deployer.profile("3xAB...");
console.log(deployer.tier, deployer.bonding_rate);
```

Returns: `DeployerProfile`

---

#### `client.deployer.tokens(wallet, params?)`

All tokens deployed by a specific wallet.

```ts
const { tokens } = await client.deployer.tokens("3xAB...", {
  limit: 20,
  offset: 0,
});
```

Returns: `DeployerTokensResponse`

---

#### `client.deployer.alerts(params?)`

Real-time deploy alerts — fired when a tracked deployer launches a new token.

```ts
const { alerts } = await client.deployer.alerts({
  since: "2025-01-01T00:00:00Z", // ISO 8601
  limit: 20,
  offset: 0,
});
```

Returns: `DeployerAlertsResponse`

---

#### `client.deployer.alertStats(params?)`

Aggregated alert statistics by tier.

```ts
const stats = await client.deployer.alertStats({ period: "7d" });
// "7d" | "30d" | "all", default "all"
```

Returns: `DeployerAlertStats`

---

#### `client.deployer.bestTokens(params?)`

Top-performing tokens from tracked deployers by peak market cap.

```ts
const { tokens } = await client.deployer.bestTokens({
  period: "7d", // "7d" | "30d" | "all", default "7d"
  limit: 5,     // 1–20, default 5
});
```

Returns: `BestTokensResponse`

---

#### `client.deployer.recentBonds(params?)`

Most recently bonded tokens from tracked deployers.

```ts
const { bonds } = await client.deployer.recentBonds({ limit: 20 });
```

Returns: `RecentBondsResponse`

---

### Tool Directory — `client.tools`

#### `client.tools.search(params?)`

Search 950+ Solana tools indexed on MadeOnSol.

```ts
const { tools, count } = await client.tools.search({
  q: "trading bot",     // full-text search
  category: "trading",  // category slug filter
  limit: 20,            // 1–50, default 20
});
```

Returns: `ToolsSearchResponse`

---

### WebSocket Streaming — `client.stream`

#### `client.stream.getToken()`

Generate a 24-hour WebSocket streaming token. Pro/Ultra subscribers get `ws_url` for KOL/deployer event streaming. Ultra subscribers also get `dex_ws_url` for the all-DEX trade stream.

```ts
const token = await client.stream.getToken();
console.log(token.ws_url);      // wss://madeonsol.com/ws/v1/stream
console.log(token.dex_ws_url);  // wss://madeonsol.com/ws/v1/dex-stream (Ultra only)
```

Returns: `StreamToken` — `{ token, expires_at, ws_url, dex_ws_url?, usage }`

**DEX Trade Stream (Ultra):** Connect to `dex_ws_url` and subscribe with filters:

```ts
ws.send(JSON.stringify({
  type: "subscribe",
  filters: { program: "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P", min_sol: 0.5 }
}));
// Filters: token_mint, token_mints (max 50), wallet, wallets (max 50), program, min_sol, max_sol, action
```

---

### Webhooks — `client.webhooks`

Manage push notification webhooks for real-time events (Pro: 3, Ultra: 10).

```ts
// Create a webhook
const webhook = await client.webhooks.create({
  url: "https://example.com/hook",
  events: ["kol:trade", "deployer:alert"],
  filters: { min_sol: 1 },
});

// List, update, delete
const { webhooks } = await client.webhooks.list();
await client.webhooks.update(webhook.id, { status: "paused" });
await client.webhooks.delete(webhook.id);
await client.webhooks.test(webhook.id);
```

---

## Error handling

All methods throw `MadeOnSolError` on non-2xx responses.

```ts
import { MadeOnSol, MadeOnSolError } from "madeonsol";

try {
  const profile = await client.kol.wallet("invalid-wallet");
} catch (err) {
  if (err instanceof MadeOnSolError) {
    console.error(err.message);   // human-readable message
    console.error(err.status);    // HTTP status code, e.g. 404
    console.error(err.body);      // raw response body
  }
}
```

---

## Exported types

All types are exported from the main entry point:

```ts
import type {
  // Errors
  MadeOnSolError,

  // KOL
  KolTrade,
  KolFeedParams,
  KolFeedResponse,
  KolLeaderboardParams,
  KolLeaderboardResponse,
  KolLeaderboardEntry,
  KolWalletParams,
  KolWalletProfile,
  KolCoordinationParams,
  KolCoordinationResponse,
  CoordinatedToken,
  KolTokenActivity,
  KolPnlByToken,

  // Deployer
  DeployerStats,
  DeployerLeaderboardParams,
  DeployerLeaderboardResponse,
  DeployerLeaderboardEntry,
  DeployerProfile,
  DeployerToken,
  DeployerTokensParams,
  DeployerTokensResponse,
  DeployerAlertsParams,
  DeployerAlertsResponse,
  DeployerAlert,
  DeployerAlertStatsParams,
  DeployerAlertStats,
  BestTokensParams,
  BestTokensResponse,
  BestToken,
  RecentBondsParams,
  RecentBondsResponse,
  RecentBond,

  // Tools
  ToolsSearchParams,
  ToolsSearchResponse,
  Tool,

  // Streaming
  StreamToken,

  // Webhooks
  Webhook,
  WebhookCreateParams,
  WebhookUpdateParams,
  WebhookListResponse,

  // Enums / unions
  KolAction,
  LeaderboardPeriod,
  CoordinationPeriod,
  DeployerTier,
  DeployerSortField,
  AlertPeriod,
  BestTokensPeriod,
} from "madeonsol";
```

---

## Related

- [MadeOnSol website](https://madeonsol.com) — Browse 950+ Solana tools
- [API documentation](https://madeonsol.com/solana-api) — Interactive endpoint reference
- [RapidAPI listing](https://rapidapi.com/ClaudeTools/api/madeonsol-solana-kol-tracker-tools-api) — Subscribe and get your API key
- [MadeOnSol on GitHub](https://github.com/LamboPoewert/madeonsol) — Main project repository

---

## License

MIT © [MadeOnSol](https://madeonsol.com)
