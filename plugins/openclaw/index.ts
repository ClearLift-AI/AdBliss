/**
 * AdBliss OpenClaw Plugin
 *
 * Registers AdBliss MCP tools inside OpenClaw so agents can query ad metrics,
 * revenue, campaign data, and make optimization recommendations across
 * Meta, Google, TikTok, LinkedIn, Shopify, Stripe, HubSpot, Klaviyo, and more.
 *
 * The plugin proxies tool calls to the AdBliss MCP server at mcp.adbliss.io.
 */

import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { Type } from "@sinclair/typebox";

const MCP_BASE = "https://mcp.adbliss.io";

/**
 * Call an AdBliss MCP tool via the REST-style tool execution endpoint.
 */
async function callTool(
  apiKey: string,
  toolName: string,
  params: Record<string, unknown>,
): Promise<{ content: Array<{ type: "text"; text: string }> }> {
  const res = await fetch(`${MCP_BASE}/mcp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "tools/call",
      params: { name: toolName, arguments: params },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`AdBliss API error (${res.status}): ${body}`);
  }

  const json = (await res.json()) as {
    result?: { content: Array<{ type: "text"; text: string }> };
    error?: { message: string };
  };

  if (json.error) {
    throw new Error(`AdBliss tool error: ${json.error.message}`);
  }

  return json.result ?? { content: [{ type: "text", text: "No result" }] };
}

// ---------------------------------------------------------------------------
// Tool definitions — mirrors the 29 tools from @adbliss/tools
// ---------------------------------------------------------------------------

const TOOLS = [
  // ── Exploration ──────────────────────────────────────────────────────────
  {
    name: "ping",
    description:
      "Health check. Returns a timestamp and echoes input. Use to verify AdBliss auth is working.",
    parameters: Type.Object({
      echo: Type.Optional(Type.String({ description: "String to echo back" })),
    }),
  },
  {
    name: "list_active_connectors",
    description:
      "List all active platform connectors for the organization. Use to discover available data sources before querying.",
    parameters: Type.Object({}),
  },
  {
    name: "get_portfolio_snapshot",
    description:
      "Complete portfolio overview: all campaigns with performance + budget, top ad groups, and cross-platform totals in one call.",
    parameters: Type.Object({
      days: Type.Optional(
        Type.Number({ description: "Lookback window in days (default 30)" }),
      ),
    }),
  },
  {
    name: "get_entity_detail",
    description:
      "Full details for a single entity: definition, budget, daily performance time series, and all children with aggregated metrics.",
    parameters: Type.Object({
      platform: Type.String({ description: "Platform: meta, google, tiktok, linkedin" }),
      entity_type: Type.String({ description: "Entity type: campaign, adset, ad" }),
      entity_id: Type.String({ description: "Platform entity ID" }),
      days: Type.Optional(Type.Number({ description: "Lookback days (default 30)" })),
    }),
  },
  {
    name: "get_changes_since_last_run",
    description:
      "What changed since the last analysis: new campaigns, budget changes, significant metric shifts.",
    parameters: Type.Object({}),
  },
  {
    name: "query_ad_metrics",
    description:
      "Query advertising metrics. Requires scope, platform, entity_type. Scopes: performance, children, creatives, audiences, budgets.",
    parameters: Type.Object({
      scope: Type.String({ description: "Query scope: performance, children, creatives, audiences, budgets" }),
      platform: Type.String({ description: "Platform: meta, google, tiktok, linkedin" }),
      entity_type: Type.String({ description: "Entity type: campaign, adset, ad" }),
      entity_id: Type.Optional(Type.String({ description: "Specific entity ID" })),
      days: Type.Optional(Type.Number({ description: "Lookback days" })),
      limit: Type.Optional(Type.Number({ description: "Max results" })),
    }),
  },
  {
    name: "query_revenue",
    description:
      "Revenue data from Stripe, Shopify, Jobber, combined ecommerce, subscriptions, and accounting views.",
    parameters: Type.Object({
      connector: Type.String({ description: "Connector: stripe, shopify, jobber, ecommerce, subscriptions, accounting" }),
      scope: Type.String({ description: "Query scope (varies by connector)" }),
      days: Type.Optional(Type.Number({ description: "Lookback days" })),
    }),
  },
  {
    name: "query_unified_data",
    description:
      "Cross-platform queries with a unified interface. Routes to ad metrics, payments, CRM, or communications based on connector type.",
    parameters: Type.Object({
      connector: Type.String({ description: "Connector identifier" }),
      scope: Type.String({ description: "Query scope" }),
      days: Type.Optional(Type.Number({ description: "Lookback days" })),
    }),
  },
  {
    name: "query_growth",
    description:
      "Growth metrics: CAC trends, affiliate performance, social engagement, review sentiment, ad saturation.",
    parameters: Type.Object({
      scope: Type.String({ description: "Growth scope" }),
      days: Type.Optional(Type.Number({ description: "Lookback days" })),
    }),
  },
  {
    name: "query_operations",
    description:
      "Operational data: support tickets, scheduling/appointments, form submissions.",
    parameters: Type.Object({
      scope: Type.String({ description: "Operations scope" }),
      days: Type.Optional(Type.Number({ description: "Lookback days" })),
    }),
  },
  {
    name: "query_contacts",
    description:
      "CRM pipeline and communications: deal pipeline analysis and marketing communications metrics.",
    parameters: Type.Object({
      scope: Type.String({ description: "Contacts scope" }),
      days: Type.Optional(Type.Number({ description: "Lookback days" })),
    }),
  },
  {
    name: "calculate",
    description:
      "Calculations: budget_change, pct_change, spend_vs_revenue, compare_entities, marginal_efficiency.",
    parameters: Type.Object({
      scope: Type.String({ description: "Calculation scope" }),
      // Additional fields vary by scope — the MCP server validates
    }),
  },

  // ── Actions ──────────────────────────────────────────────────────────────
  {
    name: "set_budget",
    description: "Recommend a budget change for a campaign or ad set.",
    parameters: Type.Object({
      platform: Type.String(),
      entity_type: Type.String(),
      entity_id: Type.String(),
      new_budget: Type.Number(),
      reasoning: Type.String(),
    }),
  },
  {
    name: "set_bid",
    description: "Recommend bid or bid strategy changes.",
    parameters: Type.Object({
      platform: Type.String(),
      entity_type: Type.String(),
      entity_id: Type.String(),
      bid_strategy: Type.String(),
      reasoning: Type.String(),
    }),
  },
  {
    name: "set_status",
    description: "Recommend enabling or pausing an ad entity.",
    parameters: Type.Object({
      platform: Type.String(),
      entity_type: Type.String(),
      entity_id: Type.String(),
      status: Type.String({ description: "enabled or paused" }),
      reasoning: Type.String(),
    }),
  },
  {
    name: "set_audience",
    description: "Recommend audience targeting changes.",
    parameters: Type.Object({
      platform: Type.String(),
      entity_type: Type.String(),
      entity_id: Type.String(),
      changes: Type.String({ description: "Description of targeting changes" }),
      reasoning: Type.String(),
    }),
  },
  {
    name: "set_schedule",
    description: "Recommend ad scheduling changes.",
    parameters: Type.Object({
      platform: Type.String(),
      entity_type: Type.String(),
      entity_id: Type.String(),
      schedule: Type.String({ description: "New schedule description" }),
      reasoning: Type.String(),
    }),
  },
  {
    name: "reallocate_budget",
    description: "Recommend moving budget from one entity to another.",
    parameters: Type.Object({
      from_platform: Type.String(),
      from_entity_id: Type.String(),
      to_platform: Type.String(),
      to_entity_id: Type.String(),
      amount: Type.Number(),
      reasoning: Type.String(),
    }),
  },
  {
    name: "compound_action",
    description:
      "Recommend a coordinated set of 2-5 actions as a single strategy.",
    parameters: Type.Object({
      actions: Type.Array(Type.Object({})),
      reasoning: Type.String(),
    }),
  },
  {
    name: "connector_authorize",
    description:
      "Start an OAuth flow for connecting a third-party platform. Returns a URL the user must open.",
    parameters: Type.Object({
      connector: Type.String({ description: "Platform to connect" }),
      shop_domain: Type.Optional(Type.String({ description: "Required for Shopify" })),
    }),
  },

  // ── Control ──────────────────────────────────────────────────────────────
  {
    name: "general_insight",
    description:
      "Record strategic observations, data quality issues, warnings, or opportunities.",
    parameters: Type.Object({
      insight: Type.String(),
      category: Type.Optional(Type.String()),
    }),
  },
  {
    name: "update_recommendation",
    description: "Update a previously made recommendation.",
    parameters: Type.Object({
      recommendation_id: Type.String(),
      updates: Type.Object({}),
    }),
  },
  {
    name: "delete_recommendation",
    description: "Delete a recommendation that is no longer valid.",
    parameters: Type.Object({
      recommendation_id: Type.String(),
    }),
  },
  {
    name: "manage_watchlist",
    description:
      "Add items to watch, list current watchlist, or resolve watched items.",
    parameters: Type.Object({
      action: Type.String({ description: "add, list, or resolve" }),
    }),
  },
  {
    name: "terminate_phase",
    description: "Signal that the current analysis phase is complete.",
    parameters: Type.Object({}),
  },
  {
    name: "terminate_analysis",
    description: "Signal that the full analysis is complete.",
    parameters: Type.Object({}),
  },

  // ── Live ─────────────────────────────────────────────────────────────────
  {
    name: "query_api",
    description:
      "Real-time API calls to connected platforms (Meta, Google, Stripe, Shopify, HubSpot, Klaviyo, TikTok, LinkedIn, etc.).",
    parameters: Type.Object({
      connector: Type.String({ description: "Platform connector" }),
      query_type: Type.String({ description: "Query type (varies by platform)" }),
    }),
  },

  // ── Simulation ───────────────────────────────────────────────────────────
  {
    name: "simulate_change",
    description:
      "Project the impact of a proposed change using historical data and power-law modeling.",
    parameters: Type.Object({
      platform: Type.String(),
      entity_type: Type.String(),
      entity_id: Type.String(),
      change_type: Type.String(),
      change_value: Type.Number(),
    }),
  },
] as const;

// ---------------------------------------------------------------------------
// Plugin entry
// ---------------------------------------------------------------------------

export default definePluginEntry({
  id: "adbliss",
  name: "AdBliss",
  description:
    "Unified ad performance data across Meta, Google, TikTok, LinkedIn, Shopify, Stripe, HubSpot, Klaviyo, and more.",
  register(api) {
    const config = api.getConfig() as { apiKey?: string };
    const apiKey = config?.apiKey ?? process.env.ADBLISS_API_KEY;

    if (!apiKey) {
      console.warn(
        "[adbliss] No API key configured. Set apiKey in plugin config or ADBLISS_API_KEY env var.",
      );
      return;
    }

    for (const tool of TOOLS) {
      api.registerTool({
        name: `adbliss_${tool.name}`,
        description: `[AdBliss] ${tool.description}`,
        parameters: tool.parameters,
        async execute(_id, params) {
          return callTool(apiKey, tool.name, params as Record<string, unknown>);
        },
      });
    }
  },
});
