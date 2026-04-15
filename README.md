# AdBliss

Unified ad performance data across Meta, Google, TikTok, LinkedIn, Shopify, Stripe, HubSpot, Klaviyo, and more. Let AI agents skip messy platform integrations and just start optimizing.

## Integrations

Connect your AI agent to AdBliss using any of these methods:

| Method | Agent | Setup |
|--------|-------|-------|
| [Agent Skill](#agent-skill) | Claude Code, Cursor, Windsurf, and other skill-compatible agents | Install the skill folder |
| [OpenClaw Plugin](#openclaw-plugin) | OpenClaw | Install the plugin |
| [MCP Server](#mcp-server-direct) | Any MCP client | Point at `mcp.adbliss.io` |

All methods require an AdBliss API key. Create one at [app.adbliss.io/settings](https://app.adbliss.io/settings).

---

## Agent Skill

The [Agent Skills](https://agentskills.io) format works across Claude Code, Cursor, Windsurf, and other compatible agents.

**Install:**

Copy the `skills/adbliss/` folder into your project or user skills directory:

```bash
# Claude Code — user-level skill
cp -r skills/adbliss ~/.claude/skills/adbliss

# Or add to a project
cp -r skills/adbliss .claude/skills/adbliss
```

The skill guides your agent through MCP setup and provides a reference of all 29 available tools.

---

## OpenClaw Plugin

Native [OpenClaw](https://openclaw.ai) plugin that registers all AdBliss tools directly.

**Install:**

```bash
openclaw plugins install @adbliss/openclaw-plugin
```

**Configure:**

Set your API key via environment variable:

```bash
export ADBLISS_API_KEY="ab_live_..."
```

Or via OpenClaw plugin config:

```json
{
  "adbliss": {
    "apiKey": "ab_live_..."
  }
}
```

---

## MCP Server (Direct)

For any MCP-compatible client, connect directly to the AdBliss MCP server:

**Claude Code:**
```bash
export ADBLISS_API_KEY="ab_live_..." && claude mcp add --transport http --scope user adbliss https://mcp.adbliss.io/mcp --header "Authorization: Bearer $ADBLISS_API_KEY"
```

**OpenClaw:**
```bash
openclaw mcp set adbliss '{"url":"https://mcp.adbliss.io/mcp","transport":"streamable-http","headers":{"Authorization":"Bearer ab_live_..."}}'
```

**Cursor / Windsurf / other MCP clients:**
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

---

## Available Tools

AdBliss provides 29 tools across 5 categories:

- **Exploration** (12) — ad metrics, revenue, growth, contacts, portfolio snapshots
- **Actions** (8) — budget, bid, audience, schedule, and status recommendations
- **Control** (6) — analysis workflow, watchlists, insights
- **Live** (1) — real-time API calls to connected platforms
- **Simulation** (1) — projected impact of proposed changes

See [skills/adbliss/references/tools.md](skills/adbliss/references/tools.md) for the full reference.

## Supported Platforms

| Category | Platforms |
|----------|-----------|
| Ad Networks | Meta Ads, Google Ads, TikTok Ads, LinkedIn Ads |
| Payments | Stripe, Chargebee, Paddle, Lemon Squeezy |
| Commerce | Shopify, WooCommerce, Jobber |
| CRM | HubSpot |
| Email | Klaviyo, Mailchimp |
| Analytics | Google Analytics |

## Contributing

This repo is the home for community-contributed AdBliss integrations. To add a new connector:

1. Create a folder under `plugins/` or `skills/`
2. Follow the existing patterns
3. Open a pull request

## License

MIT
