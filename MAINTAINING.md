# Maintaining this skill

For the Nimply team. This repository is public: everything in it must be safe to publish and true of the shipped product.

## When to update

Update the skill in the same week as any of these:

| Change in Nimply | File to edit |
|---|---|
| A price, plan limit, trial term, credit pack or add-on | `references/pricing-and-credits.md` |
| An agent added, retired, renamed, or its channels or settings changed | `references/agents.md`, the count in `SKILL.md` and `README.md` |
| A "coming soon" agent or network ships | Remove it from the "not available" lists in `agents.md` / `product-map.md` |
| A new automation recipe, trigger or step | `references/automations.md` |
| A network gains or loses publishing, inbox or analytics | The matrix in `references/product-map.md` |
| A new public API area, scope, webhook event or MCP tool group | `references/developer-platform.md` |
| An integration ships or changes status (Zapier, Make, a store listing) | `references/integrations.md` |
| A new product surface | `references/product-map.md` and the map in `SKILL.md` |
| A new common customer type or a better starting setup | `references/solution-playbooks.md` |

A developer-docs changelog entry is a good trigger: if a change earned one there, check whether it belongs here.

## Rules for content

1. **Shipped only.** Describe what a customer can use today. If it is behind a flag, limited to a pilot, or "coming soon", say so or leave it out. When marketing copy and the product disagree, follow the product.
2. **Public only.** No internal architecture, hosting, vendors, model names, prompts, costs, margins, environment variable names, file paths, or admin tooling. No customer names or data.
3. **No invented numbers.** Real prices and limits; estimates labelled as estimates.
4. **Plain language.** Most readers of the skill's output are non-technical. Outcome first. Keep Nimply's names consistent (agents, Planner, Inbox, Visor, Brand Kit, Nimply Pages, credits).
5. **Explain why.** The skill works best when it gives the assistant the reasoning, not a list of commands.
6. **Keep `SKILL.md` under 500 lines.** Detail goes in `references/`.

## Releasing

1. Edit the files. Update `Snapshot:` at the top of each reference you touched and `metadata.snapshot` in `SKILL.md`.
2. Bump the version in **both** `.claude-plugin/plugin.json` and `metadata.version` in `SKILL.md`. Use a patch bump for corrections, a minor bump for new features covered, a major bump if the skill's structure changes. Claude Code only offers users an update when this number changes.
3. Add a `CHANGELOG.md` entry at the top.
4. Run the checks:

   ```bash
   node scripts/check.mjs
   claude plugin validate . --profile directory
   ```

5. Commit, then tag and push:

   ```bash
   git tag v1.0.1 && git push origin main --tags
   ```

   The release workflow builds `nimply.zip` (for claude.ai uploads) and attaches it to a GitHub release.

## Testing a change

Install the working copy locally and ask it the questions in `skills/nimply/evals/`:

```bash
claude --plugin-dir .
```

Each folder there holds a prompt and what a good answer contains. If you have Claude Code, `claude plugin eval` can run them.

## Where the facts come from

| Fact | Source of truth |
|---|---|
| Agent templates | The agent gallery in the app; `GET /v1/agent-templates` |
| Recipes and steps | `GET /v1/automation-recipes`, `GET /v1/automation-step-types` |
| Plans and prices | The pricing page and the plan catalog |
| API, scopes, webhooks, MCP tools | The developer docs and their changelog |
| Network capabilities | The channel capabilities returned by `GET /v1/channels` |
