// ─────────────────────────────────────────────────────────────────────────────
// MadeOnSol SDK
// Official TypeScript wrapper for the MadeOnSol Solana API.
// Zero dependencies — uses native fetch (Node ≥ 18).
// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL = "https://madeonsol.com/api/v1";

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
export type LeaderboardPeriod = "today" | "7d" | "30d" | "90d" | "180d";
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

export type KolPairsPeriod = "7d" | "30d";
export type KolHotTokensPeriod = "1h" | "6h";
export type KolTimingPeriod = "7d" | "30d";
export type KolPnlPeriod = "7d" | "30d" | "90d" | "180d";
export type KolTrendingPeriod = "5m" | "15m" | "30m" | "1h" | "2h" | "4h" | "12h";

export interface KolPairsParams {
  /** Time period. Default: "7d". */
  period?: KolPairsPeriod;
  /** Minimum shared tokens to qualify (1–20). Default: 3. */
  min_shared?: number;
  /** Max results (1–50). Default: 20. */
  limit?: number;
}

export interface KolPair {
  kol_a: { name: string; wallet?: string };
  kol_b: { name: string; wallet?: string };
  shared_token_count: number;
  agreement_rate?: number;
  shared_tokens?: string[];
}

export interface KolPairsResponse {
  pairs: KolPair[];
  period: KolPairsPeriod;
  min_shared: number;
}

export interface KolTimingParams {
  /** Time period. Default: "30d". */
  period?: KolTimingPeriod;
}

export interface KolTimingProfile {
  tokens_traded: number;
  positions_closed: number;
  avg_hold_minutes: number | null;
  median_hold_minutes?: number | null;
  pct_closed_1h?: number | null;
  pct_closed_6h?: number | null;
  pct_closed_24h?: number | null;
  avg_buy_size_sol?: number | null;
  avg_sell_size_sol?: number | null;
  most_active_hours?: number[] | null;
  hour_distribution?: Record<string, number> | null;
}

export interface KolTimingResponse {
  kol: { name: string; wallet?: string };
  timing: KolTimingProfile;
  period: KolTimingPeriod;
}

export interface KolHotTokensParams {
  /** Time period. Default: "6h". */
  period?: KolHotTokensPeriod;
  /** Minimum KOL buyers (1–20). Default: 1. */
  min_kols?: number;
  /** Max results (1–50). Default: 20. */
  limit?: number;
}

export interface HotToken {
  token_mint: string;
  token_symbol: string;
  token_name: string;
  kols_total: number;
  kols_recent: number;
  acceleration: number;
  total_buy_sol: number;
  total_sell_sol: number;
  net_flow: number;
  first_kol_buy_age_minutes: number | null;
  kols?: { name: string; wallet?: string }[];
}

export interface KolHotTokensResponse {
  hot_tokens: HotToken[];
  period: KolHotTokensPeriod;
  min_kols: number;
}

export interface KolPnlParams {
  /** Time period. Default: "30d". */
  period?: KolPnlPeriod;
}

export interface KolPnlSummary {
  realized_pnl_sol: number;
  total_volume_sol: number;
  tokens_traded: number;
  closed_positions: number;
  open_positions: number;
  win_count: number;
  loss_count: number;
  win_rate: number | null;
  profit_factor: number | null;
  best_trade_pnl_sol: number;
  worst_trade_pnl_sol: number;
  avg_roi_pct: number | null;
  avg_hold_minutes: number;
  median_hold_minutes: number;
  max_drawdown_sol: number;
}

export interface KolPnlCurvePoint {
  date: string;
  day_pnl: number;
  cumulative_pnl: number;
  trades: number;
}

export interface KolClosedPosition {
  token_mint: string;
  token_symbol: string;
  token_name: string;
  buy_count: number;
  sell_count: number;
  bought_sol: number;
  sold_sol: number;
  pnl_sol: number;
  roi_pct: number;
  hold_minutes: number;
  result: "win" | "loss";
  first_trade: string;
  last_trade: string;
}

export interface KolOpenPosition {
  token_mint: string;
  token_symbol: string;
  token_name: string;
  buy_count: number;
  bought_sol: number;
  first_buy_at: string;
}

export interface KolPnlResponse {
  kol: { name: string; wallet?: string; twitter_url?: string; strategy_tag?: string };
  summary: KolPnlSummary;
  pnl_curve?: KolPnlCurvePoint[];
  closed_positions?: KolClosedPosition[];
  open_positions?: KolOpenPosition[];
  period: KolPnlPeriod;
}

export interface KolTrendingParams {
  /** Time period. Default: "1h". Sub-hour periods (5m/15m/30m) require PRO/ULTRA. */
  period?: KolTrendingPeriod;
  /** Minimum KOL buyers (1–20). Default: 1. */
  min_kols?: number;
  /** Max results (1–50). Default: 20. */
  limit?: number;
}

export interface TrendingToken {
  token_mint: string;
  token_symbol: string;
  token_name: string;
  buy_volume_sol: number;
  sell_volume_sol: number;
  net_flow_sol: number;
  buy_count: number;
  sell_count: number;
  kol_count: number;
  latest_buy_age_minutes: number | null;
  token_image_url?: string;
  first_buy_at?: string;
  latest_buy_at?: string;
  kols?: { name: string; wallet?: string }[];
}

export interface KolTrendingResponse {
  trending: TrendingToken[];
  period: KolTrendingPeriod;
  min_kols: number;
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
  /**
   * Filter alerts by deployer tier.
   * **PRO/ULTRA only** — BASIC subscribers passing this receive HTTP 403.
   */
  tier?: DeployerTier;
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

export interface DeployerTrajectoryData {
  current_streak: { type: "bond" | "fail" | "none"; count: number };
  longest_bond_streak: number;
  longest_fail_streak: number;
  rolling_bond_rates: { window_end: number; bond_rate: number }[];
  trend: "improving" | "declining" | "stable";
  avg_days_between_deploys: number | null;
  avg_recovery_tokens: number | null;
  best_stretch: { start_index: number; end_index: number; bond_rate: number } | null;
  worst_stretch: { start_index: number; end_index: number; bond_rate: number } | null;
  total_tokens_analyzed: number;
}

export interface DeployerTrajectoryResponse {
  deployer: {
    wallet_address: string;
    total_tokens_deployed: number;
    total_bonded: number;
    bonding_rate: number;
    recent_bond_rate: number;
    tier: string;
  };
  trajectory: DeployerTrajectoryData;
}

// ─── Alpha wallet intelligence types ─────────────────────────────────────────

export type AlphaSort = "win_rate" | "pnl" | "roi";
export type AlphaPeriod = "7d" | "30d" | "all";

export interface AlphaLeaderboardParams {
  /** Time period. Default: "all". */
  period?: AlphaPeriod;
  /** Minimum tokens traded to qualify (1–20). Default: 5. */
  min_tokens?: number;
  /** Sort field. Default: "win_rate". */
  sort?: AlphaSort;
  /** Exclude medium/high bot-confidence wallets. Default: true. */
  exclude_bots?: boolean;
}

export interface AlphaWalletEntry {
  rank: number;
  wallet: string;
  tokens_traded: number;
  wins: number;
  losses: number;
  /** BASIC: integer %. PRO/ULTRA: decimal fraction 0–1 (4dp). */
  win_rate: number | null;
  net_pnl_sol: number;
  // PRO/ULTRA fields
  total_sol_bought?: number;
  total_sol_sold?: number;
  roi?: number | null;
  avg_rank?: number | null;
  best_rank?: number | null;
  total_buys?: number;
  total_sells?: number;
  last_seen?: string | null;
  // ULTRA fields
  bundle_rate?: number;
  buy_size_stddev?: number;
  active_hours?: number | null;
  bot_confidence?: string | null;
}

export interface AlphaLeaderboardResponse {
  leaderboard: AlphaWalletEntry[];
  total: number;
  period: AlphaPeriod;
  sort: AlphaSort;
  min_tokens: number;
  exclude_bots: boolean;
}

export interface AlphaWalletPosition {
  token_mint: string;
  token_symbol: string | null;
  token_name: string | null;
  first_buy_at: string | null;
  last_trade_at: string | null;
  buy_count: number;
  sell_count: number;
  total_bought_sol: number;
  total_sold_sol: number;
  realized_pnl_sol: number;
  roi_pct: number | null;
  result: "win" | "loss" | "open";
}

export interface AlphaWalletBotSignal {
  signal: string;
  detail: string;
}

export interface AlphaWalletResponse {
  wallet: string;
  summary: {
    tokens_traded: number;
    wins: number;
    losses: number;
    win_rate: number | null;
    net_pnl_sol: number;
    total_vol_sol: number;
    roi: number | null;
    avg_rank: number | null;
    best_rank: number | null;
    bundle_rate: number;
    buy_size_stddev: number;
    active_hours: number | null;
    bot_confidence: string;
    night_only_activity: boolean;
  };
  positions: AlphaWalletPosition[];
  bot_signals: AlphaWalletBotSignal[];
}

export interface AlphaLinkedWallet {
  wallet_address: string;
  shared_tokens: number;
  similarity_score: number;
}

export interface AlphaLinkedResponse {
  wallet: string;
  linked_wallets: AlphaLinkedWallet[];
  total: number;
}

export interface AlphaCapTableBuyer {
  rank: number;
  wallet: string;
  first_buy_sol: number;
  first_buy_at: string | null;
  is_bundle: boolean;
  is_kol: boolean;
  kol_name: string | null;
  bot_confidence: string | null;
  historical_win_rate: number | null;
  historical_pnl_sol: number | null;
  historical_tokens: number | null;
}

export interface AlphaCapTableSummary {
  known_alpha_wallets: number;
  known_kols: number;
  bundle_buyers: number;
  buyer_quality_score: number;
  confidence: "low" | "medium" | "high";
  signal: "positive" | "neutral" | "negative";
}

export interface AlphaCapTableResponse {
  mint: string;
  buyers: AlphaCapTableBuyer[];
  summary: AlphaCapTableSummary;
}

export interface AlphaBuyerQualityBreakdown {
  alpha_wallet_count: number;
  kol_count: number;
  bundle_buyer_count: number;
  avg_historical_win_rate: number | null;
  bot_dominated: boolean;
}

export interface AlphaBuyerQualityResponse {
  mint: string;
  score: number;
  confidence: "low" | "medium" | "high";
  signal: "positive" | "neutral" | "negative";
  cached_at: string;
  /** PRO/ULTRA only */
  breakdown?: AlphaBuyerQualityBreakdown;
  note?: string;
}

// ─── Wallet Tracker types ─────────────────────────────────────────────────────

export type WalletTrackerEventType = "swap" | "transfer";
export type WalletTrackerAction = "buy" | "sell" | "transfer_in" | "transfer_out";
export type WalletTrackerSummaryPeriod = "24h" | "7d" | "30d";

export interface WatchlistAddParams {
  /** Solana wallet address to track. */
  wallet_address: string;
  /** Optional human-readable label. */
  label?: string;
}

export interface WatchlistUpdateParams {
  /** New label for the wallet, or null to clear it. */
  label: string | null;
}

export interface WalletEntry {
  wallet_address: string;
  label: string | null;
  added_at: string;
}

export interface WatchlistResponse {
  wallets: WalletEntry[];
  count: number;
  limit: number;
  remaining: number;
}

export interface WalletTrackerEvent {
  id: string;
  wallet_address: string;
  label: string | null;
  event_type: WalletTrackerEventType;
  action: WalletTrackerAction;
  /** Solana block time (Unix seconds). */
  block_time: number;
  /** Block time as ISO string. */
  block_time_iso: string;
  token_mint: string | null;
  token_symbol: string | null;
  token_name: string | null;
  sol_amount: number;
  token_amount: number | null;
  price_per_token_sol: number | null;
  counterparty: string | null;
  /** Transaction signature — BASIC tier: null. */
  tx_signature: string | null;
  program: string | null;
}

export interface WalletTrackerTradesParams {
  /** Filter by specific wallet address. */
  wallet?: string;
  /** Filter by action type. */
  action?: WalletTrackerAction;
  /** Filter by event type. */
  event_type?: WalletTrackerEventType;
  /** Max results (1–200). Default: 50. */
  limit?: number;
  /** Cursor for pagination: block_time of the last item from the previous page. */
  before?: number;
}

export interface WalletTrackerTradesResponse {
  events: WalletTrackerEvent[];
  count: number;
}

export interface WalletTrackerWalletStats {
  wallet_address: string;
  label: string | null;
  swap_count: number;
  buys: number;
  sells: number;
  sol_bought: number;
  sol_sold: number;
  last_event_at: string | null;
}

export interface WalletTrackerSummaryParams {
  /** Time window for stats. Default: "7d". */
  period?: WalletTrackerSummaryPeriod;
  /** Filter to a specific wallet address. */
  wallet?: string;
}

export interface WalletTrackerSummaryResponse {
  wallets: WalletTrackerWalletStats[];
  period: WalletTrackerSummaryPeriod;
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
   * MadeOnSol API key (starts with `msk_`).
   * Get a free key at https://madeonsol.com/developer
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
   * @param params Optional period filter ("today" | "7d" | "30d" | "90d" | "180d").
   * KOL trade data is retained for 180 days; the 90d/180d windows fill up over time.
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

  /**
   * KOL affinity pairs — which KOLs frequently co-trade the same tokens.
   * @param params Optional: period, min_shared, limit.
   */
  pairs(params?: KolPairsParams): Promise<KolPairsResponse> {
    return this._fetch(buildUrl(this._baseUrl, "/kol/pairs", params as Record<string, string | number | undefined>));
  }

  /**
   * KOL entry/exit timing profile — hold duration, exit speed, activity patterns.
   * @param wallet KOL wallet address.
   * @param params Optional: period.
   */
  timing(wallet: string, params?: KolTimingParams): Promise<KolTimingResponse> {
    return this._fetch(buildUrl(this._baseUrl, `/kol/${encodeURIComponent(wallet)}/timing`, params as Record<string, string | undefined>));
  }

  /**
   * KOL momentum tokens — tokens with accelerating KOL buy interest.
   * @param params Optional: period, min_kols, limit.
   */
  hotTokens(params?: KolHotTokensParams): Promise<KolHotTokensResponse> {
    return this._fetch(buildUrl(this._baseUrl, "/kol/tokens/hot", params as Record<string, string | number | undefined>));
  }

  /**
   * Deep per-wallet PnL breakdown — realized PnL, win rate, profit factor,
   * max drawdown, daily equity curve, and per-token closed/open positions.
   * BASIC: summary only. PRO: + curve + closed positions. ULTRA: + open positions.
   * @param wallet KOL wallet address.
   * @param params Optional: period (7d/30d/90d/180d).
   */
  pnl(wallet: string, params?: KolPnlParams): Promise<KolPnlResponse> {
    return this._fetch(buildUrl(this._baseUrl, `/kol/${encodeURIComponent(wallet)}/pnl`, params as Record<string, string | undefined>));
  }

  /**
   * Tokens ranked by KOL buy volume — pure capital-flow signal.
   * Sub-hour periods (5m/15m/30m) require PRO/ULTRA. BASIC capped at 10 results.
   * @param params Optional: period (5m–12h), min_kols, limit.
   */
  trendingTokens(params?: KolTrendingParams): Promise<KolTrendingResponse> {
    return this._fetch(buildUrl(this._baseUrl, "/kol/tokens/trending", params as Record<string, string | number | undefined>));
  }
}

// ─── Alpha namespace ─────────────────────────────────────────────────────────

class AlphaClient {
  constructor(private readonly _fetch: <T>(url: string) => Promise<T>, private readonly _baseUrl: string) {}

  /**
   * Leaderboard of statistically profitable wallets ranked by win rate, PnL, or ROI.
   * Scored from 47,000+ early buyers tracked across Pump.fun tokens.
   * BASIC: 25 results, truncated wallets. PRO: 100. ULTRA: 500 + behavioral signals.
   * @param params Optional: period, min_tokens, sort, exclude_bots.
   */
  leaderboard(params?: AlphaLeaderboardParams): Promise<AlphaLeaderboardResponse> {
    return this._fetch(buildUrl(this._baseUrl, "/alpha/leaderboard", params as Record<string, string | number | boolean | undefined>));
  }

  /**
   * Full alpha profile for a single wallet. Per-token trade history, win rate,
   * realized PnL, and bot_signals array explaining the confidence rating.
   * **ULTRA only** — BASIC/PRO receive HTTP 403.
   * @param wallet Solana wallet address.
   */
  wallet(wallet: string): Promise<AlphaWalletResponse> {
    return this._fetch(buildUrl(this._baseUrl, `/alpha/${encodeURIComponent(wallet)}`));
  }

  /**
   * Wallets behaviorally linked to this one — co-bought 3+ tokens within a 2-second
   * window (likely same actor or coordinated group). Returns similarity scores.
   * **ULTRA only** — BASIC/PRO receive HTTP 403.
   * @param wallet Solana wallet address.
   */
  linked(wallet: string): Promise<AlphaLinkedResponse> {
    return this._fetch(buildUrl(this._baseUrl, `/alpha/${encodeURIComponent(wallet)}/linked`));
  }

  /**
   * Cap table: first 10–20 non-deployer early buyers for a token, enriched with
   * historical win rates, PnL, KOL identity, and bundle flags.
   * **BASIC**: HTTP 403. **PRO**: top 10, truncated wallets. **ULTRA**: top 20, full wallets.
   * @param mint Token mint address.
   */
  capTable(mint: string): Promise<AlphaCapTableResponse> {
    return this._fetch(buildUrl(this._baseUrl, `/tokens/${encodeURIComponent(mint)}/cap-table`));
  }

  /**
   * 0–100 buyer quality score for a token's early-buyer cohort.
   * Signal: "positive" (>60), "neutral" (40–60), "negative" (<40). 5-minute cache.
   * BASIC: score + confidence + signal. PRO/ULTRA: + breakdown.
   * @param mint Token mint address.
   */
  buyerQuality(mint: string): Promise<AlphaBuyerQualityResponse> {
    return this._fetch(buildUrl(this._baseUrl, `/tokens/${encodeURIComponent(mint)}/buyer-quality`));
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
   * @param params Optional filters: since (ISO datetime), limit, offset, tier.
   * The `tier` filter (elite/good/moderate/rising/cold) is **PRO/ULTRA only** —
   * BASIC subscribers passing it receive HTTP 403.
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

  /**
   * Deployer skill curve — streaks, rolling bond rate, improvement trend, deployment cadence.
   * Requires Pro or Ultra subscription.
   * @param wallet Deployer wallet address.
   */
  trajectory(wallet: string): Promise<DeployerTrajectoryResponse> {
    return this._fetch(buildUrl(this._baseUrl, `/deployer-hunter/${encodeURIComponent(wallet)}/trajectory`));
  }
}

// ─── Wallet Tracker namespace ─────────────────────────────────────────────────

class WalletTrackerClient {
  constructor(
    private readonly _get: <T>(url: string) => Promise<T>,
    private readonly _post: <T>(url: string, body?: unknown) => Promise<T>,
    private readonly _patch: <T>(url: string, body?: unknown) => Promise<T>,
    private readonly _delete: <T>(url: string) => Promise<T>,
    private readonly _baseUrl: string,
  ) {}

  /**
   * List your tracked wallets with labels and remaining capacity.
   */
  watchlist(): Promise<WatchlistResponse> {
    return this._get(buildUrl(this._baseUrl, "/wallet-tracker/watchlist"));
  }

  /**
   * Add a wallet to your watchlist.
   * Returns HTTP 409 if already tracked or tier limit is reached.
   * Limits: BASIC=10, PRO=50, ULTRA=100.
   * @param params wallet_address (required), label (optional).
   */
  addToWatchlist(params: WatchlistAddParams): Promise<WalletEntry & { remaining: number }> {
    return this._post(buildUrl(this._baseUrl, "/wallet-tracker/watchlist"), params);
  }

  /**
   * Remove a wallet from your watchlist.
   * @param address Solana wallet address to remove.
   */
  removeFromWatchlist(address: string): Promise<{ success: boolean }> {
    return this._delete(buildUrl(this._baseUrl, `/wallet-tracker/watchlist/${encodeURIComponent(address)}`));
  }

  /**
   * Update a wallet's label.
   * @param address Solana wallet address.
   * @param params label (string to set, null to clear).
   */
  updateLabel(address: string, params: WatchlistUpdateParams): Promise<WalletEntry> {
    return this._patch(buildUrl(this._baseUrl, `/wallet-tracker/watchlist/${encodeURIComponent(address)}`), params);
  }

  /**
   * Historical events (swaps + transfers) for all watched wallets.
   * BASIC: truncated wallets, no tx_signature, no counterparty.
   * @param params Optional filters: wallet, action, event_type, limit (max 200), before (cursor).
   */
  trades(params?: WalletTrackerTradesParams): Promise<WalletTrackerTradesResponse> {
    return this._get(buildUrl(this._baseUrl, "/wallet-tracker/trades", params as Record<string, string | number | undefined>));
  }

  /**
   * Per-wallet stats (swap counts, SOL bought/sold, last activity).
   * @param params Optional: period (24h/7d/30d), wallet (filter to one address).
   */
  summary(params?: WalletTrackerSummaryParams): Promise<WalletTrackerSummaryResponse> {
    return this._get(buildUrl(this._baseUrl, "/wallet-tracker/summary", params as Record<string, string | undefined>));
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
 * - **MadeOnSol API key** — starts with `msk_`, get one free at https://madeonsol.com/developer
 *
 * @example
 * ```ts
 * import { MadeOnSol } from "madeonsol";
 *
 * const client = new MadeOnSol({ apiKey: "msk_your_api_key_here" });
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
  /** Alpha wallet intelligence: leaderboard, profiles, cap tables, buyer quality. */
  readonly alpha: AlphaClient;
  /** Solana tool directory endpoints. */
  readonly tools: ToolsClient;
  /** WebSocket streaming token (Pro/Ultra). */
  readonly stream: StreamClient;
  /** Webhook management (Pro/Ultra). */
  readonly webhooks: WebhookClient;
  /** Wallet tracker: watchlist CRUD, trades, and per-wallet stats. */
  readonly walletTracker: WalletTrackerClient;

  private readonly _apiKey: string;
  private readonly _baseUrl: string;

  constructor(config: MadeOnSolConfig) {
    if (!config.apiKey || typeof config.apiKey !== "string") {
      throw new Error("MadeOnSol: apiKey is required. Get a free key at madeonsol.com/developer");
    }
    this._apiKey = config.apiKey;
    this._baseUrl = BASE_URL;

    const boundGet = this._request.bind(this);
    const boundPost = ((url: string, body?: unknown) => this._requestWithBody("POST", url, body)) as <T>(url: string, body?: unknown) => Promise<T>;
    const boundPatch = ((url: string, body?: unknown) => this._requestWithBody("PATCH", url, body)) as <T>(url: string, body?: unknown) => Promise<T>;
    const boundDelete = ((url: string) => this._requestWithBody("DELETE", url)) as <T>(url: string) => Promise<T>;

    this.kol = new KolClient(boundGet, this._baseUrl);
    this.deployer = new DeployerClient(boundGet, this._baseUrl);
    this.alpha = new AlphaClient(boundGet, this._baseUrl);
    this.tools = new ToolsClient(boundGet, this._baseUrl);
    this.stream = new StreamClient(boundPost, this._baseUrl);
    this.webhooks = new WebhookClient(boundGet, boundPost, boundPatch, boundDelete, this._baseUrl);
    this.walletTracker = new WalletTrackerClient(boundGet, boundPost, boundPatch, boundDelete, this._baseUrl);
  }

  private _headers(): Record<string, string> {
    return { Authorization: `Bearer ${this._apiKey}`, Accept: "application/json" };
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
