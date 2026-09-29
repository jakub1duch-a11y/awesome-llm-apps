# Base44 Dev Environment

## What this repo is

"Awesome LLM Apps" — a collection of 100+ open-source AI agents, agent skills, and RAG apps. Not a single application; each subdirectory is an independent project.

## App running in the preview

The preview runs `generative_ui_agents/generative-ui-starter-project/` — a CopilotKit + LangGraph generative-UI demo (AI chat-driven kanban todo board).

### Architecture

- **web** service: Next.js 16 (Turbopack) dev server on port 3000, bind-mounted from source.
- **agent** service: Python 3.12 LangGraph agent on port 8123, using `langgraph dev` (in-memory runtime via `langgraph-cli[inmem]`).

### Key details

- `npm install --ignore-scripts` is used for the web service because the `postinstall` script tries to run `uv sync` (Python) which isn't available in the Node image.
- The agent's `langgraph.json` references `"env": "../.env"` — the compose startup command creates this file from the `OPENAI_API_KEY` env var.
- `next.config.ts` has `allowedDevOrigins` set to accept the preview origin.
- The original `src/app/api/copilotkit/[[...slug]]/route.ts` connects to the LangGraph Platform server via `AGENT_URL` (defaults to `http://localhost:8123`, overridden to `http://agent:8123` in compose).

### Required secret

- `OPENAI_API_KEY` — needed for the agent's `ChatOpenAI(model="gpt-5.5")` call. Without a real key, the UI renders but the AI chat won't respond. A development placeholder is generated to unblock startup.

### How to verify

1. `docker compose -f docker-compose.base44.yml up -d --build`
2. Wait for both services to be healthy: `docker compose -f docker-compose.base44.yml ps`
3. Curl the web entry point: `curl -s http://localhost:3000 | head -20`
4. The preview should show a split layout: chat panel on the left, todo board on the right.
