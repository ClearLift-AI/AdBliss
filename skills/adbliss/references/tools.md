# AdBliss Tools Reference

## Exploration

| Tool | Description |
|------|-------------|
| `ping` | Health check. Returns a timestamp and echoes input. Use to verify auth and tool execution. |
| `list_active_connectors` | List all active platform connectors for the organization. Use to discover available data sources. |
| `get_portfolio_snapshot` | Complete portfolio overview: all campaigns with performance + budget, top ad groups, and cross-platform totals in one call. |
| `get_entity_detail` | Full details for a single entity: definition, budget, daily performance time series, and all children with aggregated metrics. |
| `get_changes_since_last_run` | What changed since the last analysis: new campaigns, budget changes, and significant metric shifts. |
| `query_ad_metrics` | Query advertising metrics from cache. Requires `scope`, `platform`, and `entity_type`. Scopes: `performance`, `children`, `creatives`, `audiences`, `budgets`. |
| `query_revenue` | Revenue data from Stripe, Shopify, Jobber, combined ecommerce, subscriptions, and accounting views. |
| `query_unified_data` | Cross-platform queries with a unified interface. Routes to ad metrics, payment events, CRM, or communications based on connector type. |
| `query_growth` | Growth metrics: CAC trends, affiliate performance, social engagement, review sentiment, ad saturation signals. |
| `query_operations` | Operational data: support tickets, scheduling/appointments, form submissions. |
| `query_contacts` | CRM pipeline and communications: deal pipeline analysis and marketing communications metrics. |
| `calculate` | Calculations with scopes: `budget_change`, `pct_change`, `spend_vs_revenue`, `compare_entities`, `marginal_efficiency`. |

## Actions

| Tool | Description |
|------|-------------|
| `set_budget` | Recommend a budget change for a campaign or ad set. |
| `set_bid` | Recommend bid or bid strategy changes. |
| `set_status` | Recommend enabling or pausing an ad entity. |
| `set_audience` | Recommend audience targeting changes. |
| `set_schedule` | Recommend ad scheduling changes for delivery time optimization. |
| `reallocate_budget` | Recommend moving budget from one entity to another. |
| `compound_action` | Recommend a coordinated set of 2-5 actions as a single strategy. |
| `connector_authorize` | Start an OAuth flow for connecting a third-party platform. |

## Control

| Tool | Description |
|------|-------------|
| `general_insight` | Record strategic observations, data quality issues, warnings, or opportunities. |
| `update_recommendation` | Update a previously made recommendation with new parameters or reasoning. |
| `delete_recommendation` | Delete a recommendation that is no longer valid. |
| `manage_watchlist` | Add items to watch, list current watchlist, or resolve watched items. |
| `terminate_phase` | Signal that the current analysis phase is complete. |
| `terminate_analysis` | Signal that the full analysis is complete. |

## Live

| Tool | Description |
|------|-------------|
| `query_api` | Real-time API calls to connected platforms. Supports: Meta Ads, Google Ads, Google Analytics, Stripe, Shopify, HubSpot, Klaviyo, TikTok, LinkedIn, Chargebee, Paddle, Lemon Squeezy, Jobber, Mailchimp, WooCommerce. Each platform has specific query types (e.g., `campaign_details`, `keyword_performance`, `recent_transactions`). |

## Simulation

| Tool | Description |
|------|-------------|
| `simulate_change` | Project the impact of a proposed change using historical data and power-law modeling. Estimates effects on conversions and CAC. |
