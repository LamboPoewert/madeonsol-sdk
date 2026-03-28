// ─────────────────────────────────────────────────────────────────────────────
// MadeOnSol SDK
// Official TypeScript wrapper for the MadeOnSol Solana API on RapidAPI.
// Zero dependencies — uses native fetch (Node ≥ 18).
// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL = "https://madeonsol-solana-kol-tracker-tools-api.p.rapidapi.com";
const RAPIDAPI_HOST = "madeonsol-solana-kol-tracker-tools-api.p.rapidapi.com";

// ─── Error ───────────────────────────────────────────────────────────────────

export class MadeOnSolError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "MadeOnSolError";
    this.status = status;
    this.body = body;
  }
}

// ─── Shared types ────────────────────────────────────────────────────────────

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

// ─── KOL types ───────────────────────────────────────────────────────────────

export type KolAction = "buy" | "sell";
export type LeaderboardPeriod = "today" | "7d" | "30d";
export type CoordinationPeriod = "1h" | "6h" | "24h" | "7d";

export interface KolFeedParams {
  /** Number of trades to return (1–100). Default: 50. */
  limit?: number;
  /** Filter by trade direction. */
  action?: KolAction;
  /** Filter by a specific KOL wallet address. */
  kol?: string;
}

export interface KolLeaderboardParams {
  /** Time window for ranking. Default: "7d". */
  period?: LeaderboardPeriod;
}

export interface KolWalletParams {
  /** Comma-separated extras to include, e.g. "pnl_by_token". */
  include?: "pnl_by_token";
}

export interface KolCoordinationParams {
  /** Look-back window. Default: "24h". */
  period?: CoordinationPeriod;
  /** Minimum number of KOLs required to flag coordination (2–50). Default: 3. */
  min_kols?: number;
  /** Max results (1–50). Default: 20. */
  limit?: number;
}

export interface KolTrade {
  signature: string;
  wallet: string;
  kol_name: string | null;
  kol_twitter: string | null;
  action: KolAction;
  mint: string;
  token_name: string | null;
  token_symbol: string | null;
  sol_amount: number;
  token_amount: number;
  price_usd: number | null;
  timestamp: string;
}

export interface KolFeedResponse {
  trades: KolTrade[];
  count: number;
}

export interface KolLeaderboardEntry {
  wallet: string;
  kol_name: string | null;
  kol_twitter: string | null;
  total_pnl_usd: number;
  win_rate: number;
  trade_count: number;
  rank: number;
}

export interface KolLeaderboardResponse {
  leaderboard: KolLeaderboardEntry[];
  period: LeaderboardPeriod;
}

export interface KolPnlByToken {
  mint: string;
  token_name: string | null;
  token_symbol: string | null;
  realized_pnl_usd: number;
  buy_count: number;
  sell_count: number;
}

export interface KolWalletProfile {
  wallet: string;
  kol_name: string | null;
  kol_twitter: string | null;
  total_pnl_usd: number;
  win_rate: number;
  trade_count: number;
  pnl_by_token?: KolPnlByToken[];
}

export interface CoordinatedToken {
  mint: string;
  token_name: string | null;
  token_symbol: string | null;
  kol_count: number;
  wallets: string[];
  total_sol_volume: number;
  first_seen: string;
  last_seen: string;
}

export interface KolCoordinationResponse {
  tokens: CoordinatedToken[];
  period: CoordinationPeriod;
  count: number;
}

export interface KolTokenActivity {
  mint: string;
  token_name: string | null;
  token_symbol: string | null;
  kol_buyers: string[];
  kol_sellers: string[];
  buy_count: number;
  sell_count: number;
  total_sol_volume: number;
  recent_trades: KolTrade[];
}

// ─── Deployer Hunter types ────────────────────────────────────────────────────

export type DeployerTier = "elite" | "good" | "moderate" | "rising" | "cold";
export type DeployerSortField =
  | "bonding_rate"
  | "recent_bond_rate"
  | "total_bonded"
  | "last_deploy_at";
export type AlertPeriod = "7d" | "30d" | "all";
export type BestTokensPeriod = "7d" | "30d" | "all";

export interface DeployerLeaderboardParams extends PaginationParams {
  /** Filter by tier. */
  tier?: DeployerTier;
  /** Sort field. Default: "bonding_rate". */
  sort?: DeployerSortField;
  /** Max results (1–50). Default: 20. */
  limit?: number;
}

export interface DeployerTokensParams extends PaginationParams {
  /** Max results (1–50). Default: 20. */
  limit?: number;
}

export interface DeployerAlertsParams extends PaginationParams {
  /** ISO 8601 datetime — return alerts since this time. */
  since?: string;
  /** Max results (1–50). Default: 20. */
  limit?: number;
}

export interface DeployerAlertStatsParams {
  /** Time window. Default: "all". */
  period?: AlertPeriod;
}

export interface BestTokensParams {
  /** Time window. Default: "7d". */
  period?: BestTokensPeriod;
  /** Max results (1–20). Default: 5. */
  limit?: number;
}

export interface RecentBondsParams {
  /** Max results (1–50). Default: 20. */
  limit?: number;
}

export interface DeployerStats {
  total_deployers: number;
  elite_count: number;
  good_count: number;
  moderate_count: number;
  rising_count: number;
  cold_count: number;
  total_tokens_deployed: number;
  total_bonded: number;
  overall_bonding_rate: number;
}

export interface DeployerLeaderboardEntry {
  wallet: string;
  tier: DeployerTier;
  bonding_rate: number;
  recent_bond_rate: number;
  total_deployed: number;
  total_bonded: number;
  last_deploy_at: string | null;
}

export interface DeployerLeaderboardResponse {
  deployers: DeployerLeaderboardEntry[];
  count: number;
  total: number;
}

export interface DeployerProfile extends DeployerLeaderboardEntry {
  first_seen: string | null;
  tokens?: DeployerToken[];
}

export interface DeployerToken {
  mint: string;
  name: string | null;
  symbol: string | null;
  bonded: boolean;
  deployed_at: string;
  bonded_at: string | null;
  peak_market_cap_usd: number | null;
}

export interface DeployerTokensResponse {
  tokens: DeployerToken[];
  count: number;
  total: number;
}

export interface DeployerAlert {
  id: string;
  wallet: string;
  tier: DeployerTier;
  mint: string;
  token_name: string | null;
  token_symbol: string | null;
  deployed_at: string;
  bonding_rate_at_deploy: number;
}

export interface DeployerAlertsResponse {
  alerts: DeployerAlert[];
  count: number;
}

export interface DeployerAlertStats {
  period: AlertPeriod;
  total_alerts: number;
  by_tier: Record<DeployerTier, number>;
  bonded_count: number;
  bonding_rate: number;
}

export interface BestToken {
  mint: string;
  name: string | null;
  symbol: string | null;
  deployer_wallet: string;
  deployer_tier: DeployerTier;
  peak_market_cap_usd: number | null;
  bonded_at: string | null;
}

export interface BestTokensResponse {
  tokens: BestToken[];
  period: BestTokensPeriod;
}

export interface RecentBond {
  mint: string;
  name: string | null;
  symbol: string | null;
  deployer_wallet: string;
  deployer_tier: DeployerTier;
  bonded_at: string;
  peak_market_cap_usd: number | null;
}

export interface RecentBondsResponse {
  bonds: RecentBond[];
  count: number;
}

// ─── Tools types ─────────────────────────────────────────────────────────────

export interface ToolsSearchParams {
  /** Full-text search query. */
  q?: string;
  /** Category slug filter. */
  category?: string;
  /** Max results (1–50). Default: 20. */
  limit?: number;
}

export interface Tool {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  website_url: string;
  logo_url: string | null;
  categories: string[];
  pricing_model: string | null;
  upvote_count: number;
  twitter_url: string | null;
}

export interface ToolsSearchResponse {
  tools: Tool[];
  count: number;
}

// ─── Client config ────────────────────────────────────────────────────────────

export interface MadeOnSolConfig {
  /** Your RapidAPI key. Get one at https://rapidapi.com. */
  apiKey: string;
}

// ─── Internal helpers ────────────────────────────────────────────────────────

function buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

// ─── KOL namespace ───────────────────────────────────────────────────────────

class KolClient {
  constructor(private readonly _fetch: <T>(url: string) => Promise<T>) {}

  /**
   * Live feed of KOL trades.
   * @param params Optional filters: limit (1–100), action, kol wallet.
   */
  feed(params?: KolFeedParams): Promise<KolFeedResponse> {
    return this._fetch(buildUrl("/kol/feed", params as Record<string, string | number | undefined>));
  }

  /**
   * KOL PnL leaderboard.
   * @param params Optional period filter ("today" | "7d" | "30d").
   */
  leaderboard(params?: KolLeaderboardParams): Promise<KolLeaderboardResponse> {
    return this._fetch(buildUrl("/kol/leaderboard", params as Record<string, string | undefined>));
  }

  /**
   * Full profile for a single KOL wallet.
   * @param wallet Solana wallet address.
   * @param params Optional: include "pnl_by_token" for per-token breakdown.
   */
  wallet(wallet: string, params?: KolWalletParams): Promise<KolWalletProfile> {
    return this._fetch(buildUrl(`/kol/${encodeURIComponent(wallet)}`, params as Record<string, string | undefined>));
  }

  /**
   * Detect coordinated buying activity across KOL wallets.
   * @param params Optional filters: period, min_kols, limit.
   */
  coordination(params?: KolCoordinationParams): Promise<KolCoordinationResponse> {
    return this._fetch(buildUrl("/kol/coordination", params as Record<string, string | number | undefined>));
  }

  /**
   * KOL activity for a specific token mint.
   * @param mint Token mint address.
   */
  token(mint: string): Promise<KolTokenActivity> {
    return this._fetch(buildUrl(`/kol/tokens/${encodeURIComponent(mint)}`));
  }
}

// ─── Deployer namespace ───────────────────────────────────────────────────────

class DeployerClient {
  constructor(private readonly _fetch: <T>(url: string) => Promise<T>) {}

  /**
   * Global deployer statistics.
   */
  stats(): Promise<DeployerStats> {
    return this._fetch(buildUrl("/deployer-hunter/stats"));
  }

  /**
   * Ranked list of deployers.
   * @param params Optional filters: tier, sort, limit, offset.
   */
  leaderboard(params?: DeployerLeaderboardParams): Promise<DeployerLeaderboardResponse> {
    return this._fetch(buildUrl("/deployer-hunter/leaderboard", params as Record<string, string | number | undefined>));
  }

  /**
   * Full profile for a single deployer wallet.
   * @param wallet Solana wallet address.
   */
  profile(wallet: string): Promise<DeployerProfile> {
    return this._fetch(buildUrl(`/deployer-hunter/${encodeURIComponent(wallet)}`));
  }

  /**
   * Tokens deployed by a specific wallet.
   * @param wallet Solana wallet address.
   * @param params Optional: limit, offset.
   */
  tokens(wallet: string, params?: DeployerTokensParams): Promise<DeployerTokensResponse> {
    return this._fetch(buildUrl(
      `/deployer-hunter/${encodeURIComponent(wallet)}/tokens`,
      params as Record<string, number | undefined>,
    ));
  }

  /**
   * Recent deploy alerts from high-quality deployers.
   * @param params Optional filters: since (ISO datetime), limit, offset.
   */
  alerts(params?: DeployerAlertsParams): Promise<DeployerAlertsResponse> {
    return this._fetch(buildUrl("/deployer-hunter/alerts", params as Record<string, string | number | undefined>));
  }

  /**
   * Alert statistics over a time period.
   * @param params Optional: period ("7d" | "30d" | "all").
   */
  alertStats(params?: DeployerAlertStatsParams): Promise<DeployerAlertStats> {
    return this._fetch(buildUrl("/deployer-hunter/alert-stats", params as Record<string, string | undefined>));
  }

  /**
   * Best-performing tokens deployed by tracked wallets.
   * @param params Optional: period, limit.
   */
  bestTokens(params?: BestTokensParams): Promise<BestTokensResponse> {
    return this._fetch(buildUrl("/deployer-hunter/best-tokens", params as Record<string, string | number | undefined>));
  }

  /**
   * Most recently bonded tokens from tracked deployers.
   * @param params Optional: limit.
   */
  recentBonds(params?: RecentBondsParams): Promise<RecentBondsResponse> {
    return this._fetch(buildUrl("/deployer-hunter/recent-bonds", params as Record<string, number | undefined>));
  }
}

// ─── Tools namespace ─────────────────────────────────────────────────────────

class ToolsClient {
  constructor(private readonly _fetch: <T>(url: string) => Promise<T>) {}

  /**
   * Search the MadeOnSol tool directory.
   * @param params Optional: q (search query), category (slug), limit.
   */
  search(params?: ToolsSearchParams): Promise<ToolsSearchResponse> {
    return this._fetch(buildUrl("/tools/search", params as Record<string, string | number | undefined>));
  }
}

// ─── Main client ─────────────────────────────────────────────────────────────

/**
 * MadeOnSol API client.
 *
 * @example
 * ```ts
 * import { MadeOnSol } from "madeonsol";
 *
 * const client = new MadeOnSol({ apiKey: "your-rapidapi-key" });
 *
 * const { trades } = await client.kol.feed({ limit: 10, action: "buy" });
 * const { deployers } = await client.deployer.leaderboard({ tier: "elite" });
 * const { alerts } = await client.deployer.alerts({ limit: 5 });
 * ```
 */
export class MadeOnSol {
  /** KOL wallet tracking endpoints. */
  readonly kol: KolClient;
  /** Pump.fun deployer intelligence endpoints. */
  readonly deployer: DeployerClient;
  /** Solana tool directory endpoints. */
  readonly tools: ToolsClient;

  private readonly _apiKey: string;

  constructor(config: MadeOnSolConfig) {
    if (!config.apiKey || typeof config.apiKey !== "string") {
      throw new Error("MadeOnSol: apiKey is required.");
    }
    this._apiKey = config.apiKey;

    const bound = this._request.bind(this);
    this.kol = new KolClient(bound);
    this.deployer = new DeployerClient(bound);
    this.tools = new ToolsClient(bound);
  }

  private async _request<T>(url: string): Promise<T> {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": this._apiKey,
        "X-RapidAPI-Host": RAPIDAPI_HOST,
        "Accept": "application/json",
      },
    });

    let body: unknown;
    const contentType = response.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      body = await response.json();
    } else {
      body = await response.text();
    }

    if (!response.ok) {
      const message =
        typeof body === "object" &&
        body !== null &&
        "message" in body &&
        typeof (body as Record<string, unknown>).message === "string"
          ? (body as Record<string, string>).message
          : `Request failed with status ${response.status}`;
      throw new MadeOnSolError(message, response.status, body);
    }

    return body as T;
  }
}

// Re-export config type for convenience
export type { MadeOnSolConfig as Config };
