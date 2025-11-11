# TipChain MCP Server

> Model Context Protocol server enabling AI assistants to interact with TipChain autonomously

## What is MCP?

The [Model Context Protocol (MCP)](https://modelcontextprotocol.io) allows AI assistants like Claude to connect to external tools and data sources. This MCP server enables AI agents to:

- Discover and analyze creators
- Send tips with x402 payments
- Query platform statistics
- Register as autonomous agents
- Track reputation on-chain

## Installation

```bash
cd mcp-server
npm install
npm run build
```

## Configuration

### Claude Desktop

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "tipchain": {
      "command": "node",
      "args": ["/path/to/solana-x402/mcp-server/dist/index.js"],
      "env": {
        "SOLANA_RPC_URL": "https://api.devnet.solana.com",
        "WALLET_PATH": "/path/to/wallet.json"
      }
    }
  }
}
```

### Environment Variables

- `SOLANA_RPC_URL` - Solana RPC endpoint (default: devnet)
- `WALLET_PATH` - Path to wallet keypair JSON (optional, needed for tipping)

## Available Tools

### `discover_creators`

Find creators based on criteria:

```typescript
{
  minReputation?: number;  // 0-100
  limit?: number;          // 1-50
  sortBy?: "reputation" | "tips" | "volume";
}
```

**Example:**
```
Claude, discover creators with reputation above 80
```

### `get_creator`

Get detailed creator information:

```typescript
{
  basename: string;  // e.g., "alice"
}
```

**Example:**
```
Claude, get information about creator @alice
```

### `tip_creator`

Send tip to a creator:

```typescript
{
  basename: string;
  amount: number;     // SOL amount (0.001-100)
  message?: string;   // Optional message (max 280 chars)
}
```

**Example:**
```
Claude, tip @alice 0.1 SOL with message "Great content!"
```

### `get_platform_stats`

Get overall platform statistics:

```typescript
{}  // No parameters
```

**Example:**
```
Claude, what are the TipChain platform statistics?
```

### `register_agent`

Register AI as an autonomous agent:

```typescript
{
  agentName: string;    // e.g., "ClaudeBot"
  agentType: string;    // e.g., "discovery"
}
```

**Example:**
```
Claude, register yourself as a discovery agent named "ClaudeBot"
```

## Usage Examples

### With Claude Desktop

1. Install and configure MCP server in Claude Desktop
2. Start chatting with Claude:

```
User: Discover top creators on TipChain

Claude: I'll use the discover_creators tool to find top creators.

[Uses MCP tool: discover_creators with sortBy: "reputation"]

Here are the top creators:
1. @alice - Reputation: 95, 150 tips, 5.2 SOL received
2. @bob - Reputation: 88, 120 tips, 3.8 SOL received
...
```

### Programmatic Usage

```typescript
import { Client } from "@modelcontextprotocol/sdk/client/index.js";

const client = new Client({
  name: "my-client",
  version: "1.0.0",
});

// Connect to MCP server
await client.connect(transport);

// List tools
const { tools } = await client.listTools();

// Call tool
const result = await client.callTool({
  name: "discover_creators",
  arguments: {
    minReputation: 80,
    limit: 10,
  },
});
```

## Development

```bash
# Build
npm run build

# Watch mode
npm run dev

# Start server
npm start
```

## Testing

```bash
# Test with MCP Inspector
npx @modelcontextprotocol/inspector node dist/index.js
```

## Security

- Wallet keys are never exposed to the AI
- All transactions require explicit wallet signature
- Rate limiting can be implemented
- Read-only operations don't require wallet

## Architecture

```
Claude/GPT <-> MCP Protocol <-> TipChain MCP Server <-> Solana/TipChain
```

The MCP server acts as a bridge, translating AI tool calls into TipChain SDK operations.

## License

MIT
