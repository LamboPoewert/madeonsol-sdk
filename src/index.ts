// ─────────────────────────────────────────────────────────────────────────────
// MadeOnSol SDK
// Official TypeScript wrapper for the MadeOnSol Solana API.
// Zero dependencies — uses native fetch (Node ≥ 18).
// Supports MadeOnSol API key (free) and RapidAPI key.
// ─────────────────────────────────────────────────────────────────────────────

const DIRECT_BASE_URL = "https://madeonsol.com/api/v1";
const RAPIDAPI_BASE_URL = "https://madeonsol-solana-kol-tracker-tools-api.p.rapidapi.com";
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

// ─── Streaming types ────────────────────────────────────────────────────────

export interface StreamToken {
  token: string;
  expires_at: string;
  ws_url: string;
  /** DEX trade stream URL — only present for Ultra tier subscribers */
  dex_ws_url?: string;
  usage: string;
}

// ─── Webhook types ──────────────────────────────────────────────────────────

export interface WebhookCreateParams {
  url: string;
  events: string[];
  filters?: Record<string, unknown>;
}

export interface WebhookUpdateParams {
  url?: string;
  events?: string[];
  filters?: Record<string, unknown>;
  status?: "active" | "paused";
}

export interface Webhook {
  id: number;
  url: string;
  events: string[];
  filters: Record<string, unknown> | null;
  status: string;
  created_at: string;
}

export interface WebhookListResponse {
  webhooks: Webhook[];
  count: number;
}

// ─── Client config ────────────────────────────────────────────────────────────

export interface MadeOnSolConfig {
  /**
   * MadeOnSol API key (starts with `msk_`) or RapidAPI key.
   * Get a free MadeOnSol API key at https://madeonsol.com/developer
   * Or subscribe on RapidAPI at https://rapidapi.com/ClaudeTools/api/madeonsol-solana-kol-tracker-tools-api
   */
  apiKey: string;
}

// ─── Internal helpers ────────────────────────────────────────────────────────

function buildUrl(baseUrl: string, path: string, params?: Record<string, string | number | boolean | undefined>): string {
  const url = new URL(`${baseUrl}${path}`);
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
  constructor(private readonly _fetch: <T>(url: string) => Promise<T>, private readonly _baseUrl: string) {}

  /**
   * Live feed of KOL trades.
   * @param params Optional filters: limit (1–100), action, kol wallet.
   */
  feed(params?: KolFeedParams): Promise<KolFeedResponse> {
    return this._fetch(buildUrl(this._baseUrl, "/kol/feed", params as Record<string, string | number | undefined>));
  }

  /**
   * KOL PnL leaderboard.
   * @param params Optional period filter ("today" | "7d" | "30d").
   */
  leaderboard(params?: KolLeaderboardParams): Promise<KolLeaderboardResponse> {
    return this._fetch(buildUrl(this._baseUrl, "/kol/leaderboard", params as Record<string, string | undefined>));
  }

  /**
   * Full profile for a single KOL wallet.
   * @param wallet Solana wallet address.
   * @param params Optional: include "pnl_by_token" for per-token breakdown.
   */
  wallet(wallet: string, params?: KolWalletParams): Promise<KolWalletProfile> {
    return this._fetch(buildUrl(this._baseUrl, `/kol/${encodeURIComponent(wallet)}`, params as Record<string, string | undefined>));
  }

  /**
   * Detect coordinated buying activity across KOL wallets.
   * @param params Optional filters: period, min_kols, limit.
   */
  coordination(params?: KolCoordinationParams): Promise<KolCoordinationResponse> {
    return this._fetch(buildUrl(this._baseUrl, "/kol/coordination", params as Record<string, string | number | undefined>));
  }

  /**
   * KOL activity for a specific token mint.
   * @param mint Token mint address.
   */
  token(mint: string): Promise<KolTokenActivity> {
    return this._fetch(buildUrl(this._baseUrl, `/kol/tokens/${encodeURIComponent(mint)}`));
  }
}

// ─── Deployer namespace ───────────────────────────────────────────────────────

class DeployerClient {
  constructor(private readonly _fetch: <T>(url: string) => Promise<T>, private readonly _baseUrl: string) {}

  /**
   * Global deployer statistics.
   */
  stats(): Promise<DeployerStats> {
    return this._fetch(buildUrl(this._baseUrl, "/deployer-hunter/stats"));
  }

  /**
   * Ranked list of deployers.
   * @param params Optional filters: tier, sort, limit, offset.
   */
  leaderboard(params?: DeployerLeaderboardParams): Promise<DeployerLeaderboardResponse> {
    return this._fetch(buildUrl(this._baseUrl, "/deployer-hunter/leaderboard", params as Record<string, string | number | undefined>));
  }

  /**
   * Full profile for a single deployer wallet.
   * @param wallet Solana wallet address.
   */
  profile(wallet: string): Promise<DeployerProfile> {
    return this._fetch(buildUrl(this._baseUrl, `/deployer-hunter/${encodeURIComponent(wallet)}`));
  }

  /**
   * Tokens deployed by a specific wallet.
   * @param wallet Solana wallet address.
   * @param params Optional: limit, offset.
   */
  tokens(wallet: string, params?: DeployerTokensParams): Promise<DeployerTokensResponse> {
    return this._fetch(buildUrl(
      this._baseUrl,
      `/deployer-hunter/${encodeURIComponent(wallet)}/tokens`,
      params as Record<string, number | undefined>,
    ));
  }

  /**
   * Recent deploy alerts from high-quality deployers.
   * @param params Optional filters: since (ISO datetime), limit, offset.
   */
  alerts(params?: DeployerAlertsParams): Promise<DeployerAlertsResponse> {
    return this._fetch(buildUrl(this._baseUrl, "/deployer-hunter/alerts", params as Record<string, string | number | undefined>));
  }

  /**
   * Alert statistics over a time period.
   * @param params Optional: period ("7d" | "30d" | "all").
   */
  alertStats(params?: DeployerAlertStatsParams): Promise<DeployerAlertStats> {
    return this._fetch(buildUrl(this._baseUrl, "/deployer-hunter/alert-stats", params as Record<string, string | undefined>));
  }

  /**
   * Best-performing tokens deployed by tracked wallets.
   * @param params Optional: period, limit.
   */
  bestTokens(params?: BestTokensParams): Promise<BestTokensResponse> {
    return this._fetch(buildUrl(this._baseUrl, "/deployer-hunter/best-tokens", params as Record<string, string | number | undefined>));
  }

  /**
   * Most recently bonded tokens from tracked deployers.
   * @param params Optional: limit.
   */
  recentBonds(params?: RecentBondsParams): Promise<RecentBondsResponse> {
    return this._fetch(buildUrl(this._baseUrl, "/deployer-hunter/recent-bonds", params as Record<string, number | undefined>));
  }
}

// ─── Tools namespace ─────────────────────────────────────────────────────────

class ToolsClient {
  constructor(private readonly _fetch: <T>(url: string) => Promise<T>, private readonly _baseUrl: string) {}

  /**
   * Search the MadeOnSol tool directory.
   * @param params Optional: q (search query), category (slug), limit.
   */
  search(params?: ToolsSearchParams): Promise<ToolsSearchResponse> {
    return this._fetch(buildUrl(this._baseUrl, "/tools/search", params as Record<string, string | number | undefined>));
  }
}

// ─── Stream namespace ───────────────────────────────────────────────────────

class StreamClient {
  constructor(private readonly _post: <T>(url: string) => Promise<T>, private readonly _baseUrl: string) {}

  /**
   * Generate a 24-hour WebSocket streaming token.
   * Pro/Ultra: ws_url for KOL/deployer event streaming.
   * Ultra only: dex_ws_url for all-DEX trade streaming.
   */
  getToken(): Promise<StreamToken> {
    return this._post(buildUrl(this._baseUrl, "/stream/token"));
  }
}

// ─── Webhook namespace ──────────────────────────────────────────────────────

class WebhookClient {
  constructor(
    private readonly _get: <T>(url: string) => Promise<T>,
    private readonly _post: <T>(url: string, body?: unknown) => Promise<T>,
    private readonly _patch: <T>(url: string, body?: unknown) => Promise<T>,
    private readonly _delete: <T>(url: string) => Promise<T>,
    private readonly _baseUrl: string,
  ) {}

  /** List all webhooks. */
  list(): Promise<WebhookListResponse> {
    return this._get(buildUrl(this._baseUrl, "/webhooks"));
  }

  /** Create a new webhook. */
  create(params: WebhookCreateParams): Promise<Webhook> {
    return this._post(buildUrl(this._baseUrl, "/webhooks"), params);
  }

  /** Update a webhook. */
  update(id: number, params: WebhookUpdateParams): Promise<Webhook> {
    return this._patch(buildUrl(this._baseUrl, `/webhooks/${id}`), params);
  }

  /** Delete a webhook. */
  delete(id: number): Promise<{ success: boolean }> {
    return this._delete(buildUrl(this._baseUrl, `/webhooks/${id}`));
  }

  /** Send a test payload to a webhook. */
  test(webhookId: number): Promise<unknown> {
    return this._post(buildUrl(this._baseUrl, "/webhooks/test"), { webhook_id: webhookId });
  }
}

// ─── Main client ─────────────────────────────────────────────────────────────

/**
 * MadeOnSol API client.
 *
 * Supports two authentication methods:
 * - **MadeOnSol API key** (recommended) — starts with `msk_`, get one free at https://madeonsol.com/developer
 * - **RapidAPI key** — subscribe at https://rapidapi.com/ClaudeTools/api/madeonsol-solana-kol-tracker-tools-api
 *
 * @example
 * ```ts
 * import { MadeOnSol } from "madeonsol";
 *
 * // With MadeOnSol API key (recommended)
 * const client = new MadeOnSol({ apiKey: "msk_your_api_key_here" });
 *
 * // Or with RapidAPI key
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
  /** WebSocket streaming token (Pro/Ultra). */
  readonly stream: StreamClient;
  /** Webhook management (Pro/Ultra). */
  readonly webhooks: WebhookClient;

  private readonly _apiKey: string;
  private readonly _isDirect: boolean;
  private readonly _baseUrl: string;

  constructor(config: MadeOnSolConfig) {
    if (!config.apiKey || typeof config.apiKey !== "string") {
      throw new Error("MadeOnSol: apiKey is required. Get a free key at madeonsol.com/developer");
    }
    this._apiKey = config.apiKey;
    this._isDirect = config.apiKey.startsWith("msk_");
    this._baseUrl = this._isDirect ? DIRECT_BASE_URL : RAPIDAPI_BASE_URL;

    const boundGet = this._request.bind(this);
    const boundPost = ((url: string, body?: unknown) => this._requestWithBody("POST", url, body)) as <T>(url: string, body?: unknown) => Promise<T>;
    const boundPatch = ((url: string, body?: unknown) => this._requestWithBody("PATCH", url, body)) as <T>(url: string, body?: unknown) => Promise<T>;
    const boundDelete = ((url: string) => this._requestWithBody("DELETE", url)) as <T>(url: string) => Promise<T>;

    this.kol = new KolClient(boundGet, this._baseUrl);
    this.deployer = new DeployerClient(boundGet, this._baseUrl);
    this.tools = new ToolsClient(boundGet, this._baseUrl);
    this.stream = new StreamClient(boundPost, this._baseUrl);
    this.webhooks = new WebhookClient(boundGet, boundPost, boundPatch, boundDelete, this._baseUrl);
  }

  private _headers(): Record<string, string> {
    return this._isDirect
      ? { Authorization: `Bearer ${this._apiKey}`, Accept: "application/json" }
      : { "X-RapidAPI-Key": this._apiKey, "X-RapidAPI-Host": RAPIDAPI_HOST, Accept: "application/json" };
  }

  private async _request<T>(url: string): Promise<T> {
    const response = await fetch(url, { method: "GET", headers: this._headers() });
    return this._handleResponse<T>(response);
  }

  private async _requestWithBody<T>(method: string, url: string, body?: unknown): Promise<T> {
    const response = await fetch(url, {
      method,
      headers: { ...this._headers(), "Content-Type": "application/json" },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    return this._handleResponse<T>(response);
  }

  private async _handleResponse<T>(response: Response): Promise<T> {
    let responseBody: unknown;
    const contentType = response.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      responseBody = await response.json();
    } else {
      responseBody = await response.text();
    }

    if (!response.ok) {
      const message =
        typeof responseBody === "object" &&
        responseBody !== null &&
        "message" in responseBody &&
        typeof (responseBody as Record<string, unknown>).message === "string"
          ? (responseBody as Record<string, string>).message
          : `Request failed with status ${response.status}`;
      throw new MadeOnSolError(message, response.status, responseBody);
    }

    return responseBody as T;
  }
}

// Re-export config type for convenience
export type { MadeOnSolConfig as Config };
