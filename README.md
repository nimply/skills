# Nimply skill

The official [Agent Skill](https://agentskills.io) for [Nimply](https://nimply.io), the AI social media workforce.

Install it and your AI assistant understands how Nimply works: its 17 AI agents, the Planner, Inbox, automations, Nimply Design, Nimply Pages, the public API, the MCP server and the integrations around them. Describe a business and it designs a setup that fits: which accounts to connect, which agents to hire, which automations to switch on, which plan to pick and what it will cost to run.

It is for business owners deciding whether Nimply fits, agencies and consultants designing setups for clients, and developers building on the Nimply API or MCP server.

## What you can ask

- "I run a café with busy Instagram and WhatsApp DMs. What would a Nimply setup look like, and what would it cost?"
- "Which Nimply agents should a real-estate team start with?"
- "How does Comment-to-DM work, and on which networks?"
- "We're an agency with 12 clients. How should we structure workspaces and approvals?"
- "Design an integration that sends Nimply leads to our CRM."
- "What can the Nimply MCP server do that the Zapier app can't?"
- "Is Nimply a good replacement for Buffer plus ManyChat plus Linktree?"

## Install

### Claude Code

```
/plugin marketplace add nimply/skills
/plugin install nimply@nimply
```

This also adds the hosted Nimply MCP server (`https://mcp.nimply.io/mcp`), so Claude can act in your workspace once you sign in. Run `/mcp` and choose **nimply** to connect. The skill works without connecting.

### Any agent that supports skills (Cursor, Codex, Gemini CLI and others)

```bash
npx skills add nimply/skills
```

### claude.ai and Claude Desktop

1. Download `nimply.zip` from the [latest release](https://github.com/nimply/skills/releases/latest).
2. Open **Customize → Skills** and upload it.

To let Claude act in your workspace as well, add Nimply under **Connectors** (it is in the [Claude connectors directory](https://claude.ai/directory/connectors/nimply)).

### By hand

Copy the `skills/nimply` folder into `~/.claude/skills/` (or your agent's skills folder).

## Updating

Nimply ships most weeks, and this skill is updated with it. See [CHANGELOG.md](CHANGELOG.md).

| Installed with | Update with |
|---|---|
| Claude Code plugin | `/plugin marketplace update nimply`, then `/plugin update nimply@nimply`. Or turn on auto-update under `/plugin` → Marketplaces → nimply |
| `npx skills add` | `npx skills update` |
| claude.ai upload | Download the latest `nimply.zip` and upload it again |
| By hand | Replace the folder |

Between releases the skill stays accurate by checking live sources (the pricing page, the developer docs and your own workspace) before quoting anything that changes often. It also tells you once when a newer version is available.

## What is inside

```
skills/nimply/
├── SKILL.md                      How to explain Nimply and design a solution
└── references/
    ├── product-map.md            Every part of the product; what works on which network
    ├── agents.md                 The agent gallery, the safety rails, credits per run
    ├── automations.md            Recipes, building blocks, Comment-to-DM, Everywhere
    ├── developer-platform.md     REST API, permissions, webhooks, MCP server, limits
    ├── integrations.md           AI assistants, Zapier, Make, n8n, Slack, HubSpot and more
    ├── pricing-and-credits.md    Plans, AI credits, how to estimate a monthly budget
    ├── solution-playbooks.md     Starting setups for ten kinds of business
    └── staying-current.md        Which facts go stale and where the live answer is
```

The skill contains no executable code. It describes the public product and platform only.

## Accuracy

Everything in this skill describes shipped functionality as of the snapshot date in `SKILL.md`. It contains no invented metrics. If you find something wrong or out of date, please [open an issue](https://github.com/nimply/skills/issues) or write to hello@nimply.io.

## Links

- Nimply: https://nimply.io
- Developer docs: https://developer.nimply.io
- MCP server: https://developer.nimply.io/docs/mcp
- Privacy: https://nimply.io/privacy · Terms: https://nimply.io/terms
- Support: hello@nimply.io

## License

MIT © Admire Digital Marketing FZC (Nimply). The Nimply service is subject to the [Nimply terms](https://nimply.io/terms).
