# madeonsol

[![npm version](https://img.shields.io/npm/v/madeonsol?style=flat-square)](https://www.npmjs.com/package/madeonsol)
[![npm downloads](https://img.shields.io/npm/dm/madeonsol?style=flat-square)](https://www.npmjs.com/package/madeonsol)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4+-blue?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen?style=flat-square)](package.json)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

Official TypeScript/JavaScript SDK for the **[MadeOnSol](https://madeonsol.com) Solana API** — zero dependencies, fully typed, works in Node.js ≥ 18 and edge runtimes.
n> Real-time Solana trading intelligence: track 1,000+ KOL wallets with <3s latency, score 6,700+ Pump.fun deployers by reputation, detect multi-KOL coordination signals, and stream every DEX trade. Free tier: 200 requests/day at [madeonsol.com/developer](https://madeonsol.com/developer) — no credit card required.

> **Build Solana trading bots, analytics dashboards, KOL copy-trading tools, deployer sniper bots, and ecosystem browsers.**

| Feature | Description |
|---|---|
| **KOL Tracker** | Real-time trade feed, PnL leaderboard with five time windows (today, 7d, 30d, 90d, 180d), coordination detection, per-wallet profiles, and deep PnL analytics for 1,000+ tracked KOL wallets. **180 days of trade history** retained. |
| **Alpha Wallet Intel** | Leaderboard of 47,000+ scored early-buyer wallets, full wallet profiles, linked-wallet clustering, token cap-table enrichment, and 0–100 buyer quality scores. |
| **Wallet Tracker** | Monitor any Solana wallet for swaps and transfers. Track up to 10/50/100 wallets (BASIC/PRO/ULTRA). 120-day event retention. WS events on ULTRA. |
| **Deployer Hunter** | Pump.fun deployer scoring, tier leaderboard, deploy alerts, and bonding intelligence |
| **DEX Trade Stream** | Real-time WebSocket stream of ALL Solana DEX trades — filter by token, wallet, program, or trade size (Ultra) |
| **Webhooks** | Push notifications for KOL trades, coordination signals, deployer alerts, and wallet tracker events (Pro/Ultra) |
| **Tool Directory** | Search 950+ Solana tools and dApps indexed on MadeOnSol |

**Links:** [Full docs](https://madeonsol.com/solana-api) · [Website](https://madeonsol.com) · [API docs](https://madeonsol.com/api-docs)

## Authentication

Get a free API key at [madeonsol.com/developer](https://madeonsol.com/developer). Keys start with `msk_`.

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

const client = new MadeOnSol({ apiKey: "msk_your_api_key_here" });

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
  period: "7d", // "today" | "7d" | "30d" | "90d" | "180d", default "7d"
});
```

> **180-day retention** — KOL trade data is retained for 180 days (extended from 31 on 2026-04-07). The 90d and 180d windows fill up over time as the trade table accumulates.

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

#### `client.kol.pnl(wallet, params?)`

Deep per-wallet PnL breakdown with equity curve, risk metrics, and position history.

```ts
const pnl = await client.kol.pnl("7xKX...", {
  period: "30d", // "7d" | "30d" | "90d" | "180d", default "30d"
});
// BASIC: summary stats only
// PRO: + equity curve + closed positions
// ULTRA: + open positions
```

Returns: `KolPnlResponse`

---

#### `client.kol.trendingTokens(params?)`

Tokens ranked by KOL buy volume across multiple time windows.

```ts
const { tokens } = await client.kol.trendingTokens({
  period: "1h",    // "5m" | "15m" | "30m" | "1h" | "4h" | "8h" | "12h", default "1h"
  min_kols: 2,     // minimum distinct KOL buyers
  limit: 20,       // 1–50, default 20
});
// Sub-hour periods (5m, 15m, 30m) require PRO or ULTRA
```

Returns: `KolTrendingTokensResponse`

---

### Alpha Wallet Intelligence — `client.alpha`

#### `client.alpha.leaderboard(params?)`

Leaderboard of 47,000+ scored early-buyer wallets ranked by win rate, PnL, or ROI.

```ts
const { wallets } = await client.alpha.leaderboard({
  period: "30d",   // "7d" | "30d" | "90d", default "30d"
  sort: "win_rate", // "win_rate" | "pnl" | "roi"
  min_tokens: 5,
  exclude_bots: true,
});
// BASIC: 25 results, PRO: 100, ULTRA: 500
```

Returns: `AlphaLeaderboardResponse`

---

#### `client.alpha.wallet(wallet)`

Full profile for an alpha wallet including per-token history and bot signals. ULTRA only.

```ts
const profile = await client.alpha.wallet("7xKX...");
```

Returns: `AlphaWalletResponse`

---

#### `client.alpha.linked(wallet)`

Linked-wallet clustering — wallets that co-bought with this address within 2 seconds. ULTRA only.

```ts
const { linked } = await client.alpha.linked("7xKX...");
```

Returns: `AlphaLinkedResponse`

---

#### `client.alpha.capTable(mint)`

First buyers for a token enriched with historical win rates, PnL, and KOL identity. PRO/ULTRA.

```ts
const { buyers } = await client.alpha.capTable("EPjFW...");
```

Returns: `AlphaCapTableResponse`

---

#### `client.alpha.buyerQuality(mint)`

0–100 cohort quality score based on the profile of a token's first buyers. All tiers. 5-minute cache.

```ts
const { score } = await client.alpha.buyerQuality("EPjFW...");
```

Returns: `AlphaBuyerQualityResponse`

---

### Wallet Tracker — `client.walletTracker`

#### `client.walletTracker.watchlist()`

List your tracked wallets and remaining capacity.

```ts
const { wallets, capacity } = await client.walletTracker.watchlist();
// capacity: { used, limit } — BASIC: 10, PRO: 50, ULTRA: 100
```

Returns: `WatchlistResponse`

---

#### `client.walletTracker.addToWatchlist(wallet, params?)`

Add a wallet to your watchlist. Tracking begins immediately.

```ts
await client.walletTracker.addToWatchlist("7xKX...", { label: "whale" });
```

---

#### `client.walletTracker.removeFromWatchlist(wallet)`

Remove a wallet from your watchlist.

```ts
await client.walletTracker.removeFromWatchlist("7xKX...");
```

---

#### `client.walletTracker.updateLabel(wallet, label)`

Update the label for a tracked wallet.

```ts
await client.walletTracker.updateLabel("7xKX...", "smart money");
```

---

#### `client.walletTracker.trades(params?)`

Historical swap and transfer events for your watched wallets. 120-day retention.

```ts
const { events } = await client.walletTracker.trades({
  wallet: "7xKX...",    // filter by specific wallet
  action: "buy",        // "buy" | "sell"
  event_type: "swap",   // "swap" | "transfer"
  limit: 50,
  before: "2026-04-01T00:00:00Z", // ISO 8601 cursor
});
```

Returns: `WalletTrackerTradesResponse`

---

#### `client.walletTracker.summary(params?)`

Per-wallet stats across your watchlist: swap counts, SOL bought/sold, last event time.

```ts
const { wallets } = await client.walletTracker.summary({
  period: "7d",        // "24h" | "7d" | "30d", default "7d"
  wallet: "7xKX...",  // optional: single wallet
});
```

Returns: `WalletTrackerSummaryResponse`

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
  tier: "elite", // "elite" | "good" | "moderate" | "rising" | "cold" — PRO/ULTRA only
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

  // KOL PnL & Trending
  KolPnlResponse,
  KolTrendingTokensResponse,
  TrendingToken,

  // Alpha Wallet Intelligence
  AlphaWalletEntry,
  AlphaLeaderboardResponse,
  AlphaWalletResponse,
  AlphaLinkedResponse,
  AlphaCapTableResponse,
  AlphaBuyerQualityResponse,

  // Wallet Tracker
  WalletEntry,
  WatchlistResponse,
  WalletTrackerEvent,
  WalletTrackerTradesResponse,
  WalletTrackerSummaryResponse,

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
- [MadeOnSol on GitHub](https://github.com/LamboPoewert/madeonsol) — Main project repository

## Also Available

| Platform | Package |
|---|---|
| Python (LangChain, CrewAI) | [`madeonsol-x402`](https://pypi.org/project/madeonsol-x402/) on PyPI |
| MCP Server (Claude, Cursor) | [`mcp-server-madeonsol`](https://www.npmjs.com/package/mcp-server-madeonsol) |
| ElizaOS | [`@madeonsol/plugin-madeonsol`](https://www.npmjs.com/package/@madeonsol/plugin-madeonsol) |
| Solana Agent Kit | [`solana-agent-kit-plugin-madeonsol`](https://www.npmjs.com/package/solana-agent-kit-plugin-madeonsol) |

---

## License

MIT © [MadeOnSol](https://madeonsol.com)
