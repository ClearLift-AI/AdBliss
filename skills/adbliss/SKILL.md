---
name: adbliss
description: Connect to AdBliss for unified ad performance data across Meta, Google, TikTok, LinkedIn, Shopify, Stripe, HubSpot, Klaviyo, and more. Use when the user wants to analyze ad metrics, revenue, campaign performance, or manage ad recommendations via MCP.
license: MIT
compatibility: Requires an AdBliss account and API key from app.adbliss.io
metadata:
  author: adbliss
  version: "1.0"
---

# AdBliss

Connect your AI agent to AdBliss for unified cross-platform ad data, revenue attribution, and campaign management.

## When to use this skill

Use this skill when the user wants to:
- Query ad metrics across Meta, Google, TikTok, or LinkedIn
- Analyze revenue from Stripe, Shopify, Chargebee, Paddle, or Lemon Squeezy
- View CRM data from HubSpot or Klaviyo
- Get a portfolio snapshot of all campaigns
- Simulate budget changes and their projected impact
- Make campaign optimization recommendations

## Setup

### 1. Get an API key

The user needs an AdBliss API key. They can create one at [app.adbliss.io/settings](https://app.adbliss.io/settings) under the API Keys section.

### 2. Connect via MCP

AdBliss exposes tools via MCP (Model Context Protocol) at `https://mcp.adbliss.io/mcp`.

**Claude Code:**
```bash
export ADBLISS_API_KEY="ab_live_..." && claude mcp add --transport http --scope user adbliss https://mcp.adbliss.io/mcp --header "Authorization: Bearer $ADBLISS_API_KEY"
```

**Cursor / Windsurf / other MCP clients:**

Add to your MCP configuration:
```json
{
  "mcpServers": {
    "adbliss": {
      "url": "https://mcp.adbliss.io/mcp",
      "headers": {
        "Authorization": "Bearer ab_live_..."
      }
    }
  }
}
```

### 3. Verify the connection

After setup, call the `ping` tool to confirm authentication is working.

## Available tools

See [references/tools.md](references/tools.md) for the complete list of 29 tools across these categories:

- **Exploration** (12 tools) — query ad metrics, revenue, growth, contacts, portfolio snapshots
- **Actions** (8 tools) — recommend budget, bid, audience, schedule, and status changes
- **Control** (6 tools) — manage analysis workflow, watchlists, and insights
- **Live** (1 tool) — real-time API calls to connected platforms
- **Simulation** (1 tool) — project impact of proposed changes

## Usage patterns

### Start with the big picture
Call `get_portfolio_snapshot` first to see all campaigns, budgets, and cross-platform totals.

### Drill into specifics
Use `get_entity_detail` for a single campaign's full history, or `query_ad_metrics` for custom queries with filters.

### Check what changed
Call `get_changes_since_last_run` at the start of any analysis to focus on what needs attention.

### Revenue attribution
Use `query_revenue` to pull Stripe/Shopify/subscription data, then `calculate` with `spend_vs_revenue` scope for ROAS.

### Make recommendations
Use action tools (`set_budget`, `set_bid`, `set_status`, etc.) to record optimization recommendations. Use `simulate_change` first to project impact.
