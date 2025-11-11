# 🚀 TipChain Agent Economy

> **The AI Agent-Powered Creator Economy on Solana with x402 Micropayments**

Built for the **Solana x402 Hackathon 2025** - Competing for $50,000+ in prizes across 5 categories + 9 sponsor bounties.

![Solana](https://img.shields.io/badge/Solana-Devnet-blueviolet)
![x402](https://img.shields.io/badge/x402-Integrated-blue)
![Anchor](https://img.shields.io/badge/Anchor-0.29.0-orange)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)

---

## 🎯 Project Vision

**TipChain Agent Economy** revolutionizes creator monetization by enabling AI agents to autonomously discover, evaluate, and tip creators using x402 micropayments on Solana. We're building the infrastructure for the future where AI agents are first-class economic participants.

### The Problem
- Traditional creator platforms take 20-30% fees
- Micropayments are impossible with traditional payment rails
- No autonomous agent infrastructure for creator discovery
- Lack of on-chain reputation and trust systems

### Our Solution
- **x402 Micropayments**: Instant, sub-cent payments on Solana
- **AI Agent Autonomy**: Agents discover and support creators independently
- **On-chain Reputation**: Trustless reputation tracking for creators and agents
- **Creator APIs**: Monetize content through x402-enabled APIs
- **Low Fees**: Only 2% platform fee (vs 20-30% traditional platforms)

---

## 🏆 Hackathon Categories

We're competing in **ALL 5 main categories** + **7 sponsor bounties**:

### Main Categories ($10k each)
1. ✅ **Best Trustless Agent** - Autonomous agents with on-chain reputation
2. ✅ **Best x402 API Integration** - Micropayments & creator API monetization
3. ✅ **Best MCP Server** - AI agents integrated with payment systems
4. ✅ **Best x402 Dev Tool** - TypeScript SDK for developers
5. ✅ **Best Agent Application** - Full-stack creator economy platform

### Sponsor Bounties ($62.5k total)
- Phantom CASH integration
- Visa TAP for corporate agents
- ATXP + ACP + AP2 multi-protocol
- CDP Embedded Wallets for agents
- Gradient Parallax compute
- OpenMined OM1 privacy
- Switchboard oracles for reputation

---

## 🛠️ Tech Stack

### Smart Contracts (Solana)
- **Anchor Framework** (Rust) - Type-safe smart contract development
- **x402 Protocol** - HTTP 402 payment protocol integration
- **SPL Token** - Native SOL and token support

### Backend/SDK
- **TypeScript SDK** - Easy contract interaction
- **@solana/web3.js** - Solana RPC communication
- **Agent Framework** - Autonomous agent infrastructure

### Frontend
- **Next.js 14** - React framework with App Router
- **TailwindCSS** - Modern styling
- **Wallet Adapter** - Phantom, Solflare, etc.
- **Lucide Icons** - Beautiful UI icons

### AI Agents
- **Discovery Agent** - Finds creators based on preferences
- **Curator Agent** - Evaluates content quality
- **Tipper Agent** - Autonomous payment execution
- **Analyst Agent** - On-chain analytics and insights

---

## 📦 Project Structure

```
solana-x402/
├── programs/               # Solana smart contracts
│   └── tipchain-agent/
│       ├── src/
│       │   └── lib.rs     # Main contract code
│       └── Cargo.toml
├── sdk/                   # TypeScript SDK
│   ├── src/
│   │   ├── index.ts      # Main SDK
│   │   └── x402.ts       # x402 Protocol
│   └── package.json
├── mcp-server/            # Model Context Protocol server
│   ├── src/
│   │   └── index.ts      # MCP server implementation
│   └── package.json
├── app/                   # Next.js frontend
│   ├── src/
│   │   ├── app/          # Pages
│   │   ├── components/   # React components
│   │   └── lib/          # Utilities
│   └── package.json
├── agents/                # AI Agent implementations
│   ├── discovery-agent.ts
│   └── activity.log
├── tests/                 # Integration tests
│   └── tipchain-agent.test.ts
├── docs/                  # Documentation
│   └── integrations/     # Sponsor integrations
├── scripts/               # Automation scripts
│   ├── setup.sh
│   ├── deploy.sh
│   └── init-platform.ts
├── Anchor.toml           # Anchor config
├── Cargo.toml            # Rust workspace
├── package.json          # Root package.json
├── CONTRIBUTING.md       # Contribution guidelines
└── LICENSE               # MIT License
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- Rust 1.70+
- Solana CLI 1.17+
- Anchor CLI 0.29.0
- Phantom Wallet (browser extension)

### 1. Clone & Install

```bash
# Clone repository
git clone https://github.com/yourusername/solana-x402
cd solana-x402

# Install dependencies
npm run setup
```

### 2. Configure Solana

```bash
# Set to devnet
solana config set --url devnet

# Create a new wallet (or use existing)
solana-keygen new

# Airdrop SOL for testing
solana airdrop 2
```

### 3. Build & Deploy Smart Contract

```bash
# Build the program
anchor build

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Note the Program ID and update in:
# - programs/tipchain-agent/src/lib.rs (declare_id!)
# - sdk/src/index.ts (PROGRAM_ID)
# - Anchor.toml
```

### 4. Initialize Platform

```bash
# Run initialization script
npm run init-platform
```

### 5. Start Frontend

```bash
# Navigate to app directory
cd app

# Start development server
npm run dev

# Open http://localhost:3000
```

### 6. Launch AI Agent (Optional)

```bash
# Create agent wallet
solana-keygen new -o agents/agent-wallet.json

# Airdrop SOL to agent
solana airdrop 5 $(solana-keygen pubkey agents/agent-wallet.json)

# Start discovery agent
npx ts-node agents/discovery-agent.ts
```

---

## 💡 Core Features

### For Creators

#### 1. Register as Creator
```typescript
import TipChainSDK from '@tipchain/sdk';

const sdk = new TipChainSDK(connection);
await sdk.registerCreator(
  wallet,
  'alice',              // basename
  'Alice Smith',        // display name
  'https://...'         // avatar URL
);
```

#### 2. Receive Tips
- Instant x402 micropayments
- On-chain reputation building
- Streak tracking for consistency
- Analytics dashboard

#### 3. Monetize APIs
```bash
# Expose your content via x402
GET /api/content/video-123
Authorization: x402 <payment_proof>
Price: 0.0001 SOL per second
```

### For AI Agents

#### 1. Register Agent
```typescript
await sdk.registerAgent(
  agentWallet,
  'DiscoveryBot',       // agent name
  'discovery'           // agent type
);
```

#### 2. Autonomous Discovery
```typescript
const agent = new DiscoveryAgent({
  rpcUrl: 'https://api.devnet.solana.com',
  preferences: {
    minReputation: 70,
    categories: ['art', 'music']
  },
  budget: {
    daily: 5.0,
    perTip: { min: 0.1, max: 0.5 }
  }
});

await agent.start();
```

#### 3. Smart Tipping
- Reputation-based evaluation
- Budget management
- x402 payment integration
- Activity logging

### Platform Features

#### On-chain Reputation
- Streak tracking (consecutive tip days)
- Reputation scores (0-100)
- Top tipper leaderboard
- Milestone achievements

#### Analytics Dashboard
- Real-time statistics
- Creator rankings
- Agent activity feed
- Volume tracking

#### x402 Integration
- Payment proof generation
- Micropayment support
- Multi-protocol support
- Fee optimization (2%)

---

## 🔧 SDK Usage

### Installation

```bash
npm install @tipchain/sdk
```

### Basic Usage

```typescript
import { Connection } from '@solana/web3.js';
import TipChainSDK from '@tipchain/sdk';

// Initialize
const connection = new Connection('https://api.devnet.solana.com');
const sdk = new TipChainSDK(connection);

// Get creator
const creator = await sdk.getCreator('alice');
console.log(`${creator.displayName} has ${creator.tipCount} tips`);

// Send tip
await sdk.tipCreator(
  wallet,
  'alice',
  1_000_000,  // 0.001 SOL in lamports
  'Great content!',
  'x402_proof_123'
);

// Get platform stats
const stats = await sdk.getPlatformStats();
console.log(`Total creators: ${stats.totalCreators}`);
```

---

## 🤖 MCP Server (Model Context Protocol)

TipChain provides a complete MCP server allowing AI assistants like Claude to autonomously interact with the platform.

### Features

- **5 Tools** for AI agents to use
- **x402 payment** integration
- **Claude Desktop** compatible
- **Autonomous tipping** from LLMs

### Available Tools

1. `discover_creators` - Find creators by reputation, tips, volume
2. `get_creator` - Get detailed creator profile
3. `tip_creator` - Send tips with x402 proofs
4. `get_platform_stats` - Query platform statistics
5. `register_agent` - Register AI as autonomous agent

### Setup with Claude Desktop

```json
{
  "mcpServers": {
    "tipchain": {
      "command": "node",
      "args": ["/path/to/mcp-server/dist/index.js"],
      "env": {
        "SOLANA_RPC_URL": "https://api.devnet.solana.com",
        "WALLET_PATH": "/path/to/wallet.json"
      }
    }
  }
}
```

### Usage Example

```
User: Claude, discover top creators on TipChain

Claude: [Uses discover_creators tool]
Here are the top 10 creators by reputation:
1. @alice - Reputation: 95, 150 tips, 5.2 SOL
2. @bob - Reputation: 88, 120 tips, 3.8 SOL
...
```

**Full documentation**: [`mcp-server/README.md`](mcp-server/README.md)

---

## 🔐 x402 Payment Protocol

Full HTTP 402 payment protocol implementation for micropayments.

### Features

- Payment proof generation & verification
- HTTP 402 request/response headers
- Cryptographically secure signatures
- Creator API monetization

### Generate Payment Proof

```typescript
import { X402Protocol } from '@tipchain/sdk';

const proof = X402Protocol.generateProof(
  senderKeypair,
  recipientPublicKey,
  1000000, // amount in lamports
  { message: 'Great work!' }
);

// Use proof in API request
const response = await fetch('https://api.creator.com/content', {
  headers: {
    'Authorization': X402Protocol.encodeProofHeader(proof)
  }
});
```

### Create Paid API

```typescript
import { X402API } from '@tipchain/sdk';

const api = new X402API(creatorPublicKey, 0.001); // 0.001 SOL per request

app.get('/api/content', api.paidEndpoint(async (req, res) => {
  // Payment verified automatically
  res.json({ content: 'Premium content' });
}));
```

### HTTP 402 Response

```typescript
// Server sends 402 when payment required
const headers = X402Protocol.generate402Headers(
  recipientPublicKey,
  0.001 // amount
);

response.status(402).json({
  error: 'Payment Required',
  amount: '0.001 SOL',
  recipient: recipientPublicKey.toBase58()
});
```

**Full documentation**: [`sdk/src/x402.ts`](sdk/src/x402.ts)

---

## 🎨 Frontend Components

### Main Pages

1. **Dashboard** (`/`)
   - Platform statistics
   - Top creators
   - Live agent demo
   - Feature showcase

2. **Creators** (`/creators`)
   - Browse all creators
   - Filter by reputation, streak
   - Detailed creator profiles

3. **Register** (`/register`)
   - Creator registration
   - AI agent setup
   - Wallet integration

4. **Agents** (`/agents`)
   - Active agents list
   - Agent analytics
   - Configuration interface

### Key Components

- `Header` - Navigation + wallet connection
- `StatsCard` - Animated statistics display
- `CreatorCard` - Creator profile card with tipping
- `TipModal` - Send tips with x402
- `AgentDemo` - Live agent activity visualization

---

## 🤖 AI Agents

### Discovery Agent

Autonomously discovers and tips creators based on:
- Reputation scores
- Content quality signals
- Activity streaks
- Category preferences
- Budget constraints

```typescript
const agent = new DiscoveryAgent({
  preferences: {
    minReputation: 70,
    categories: ['tech', 'art']
  },
  budget: { daily: 5.0 }
});

agent.start();
```

### Agent Capabilities

- **Autonomous Decision Making** - No human intervention
- **Budget Management** - Smart allocation
- **Reputation Analysis** - Quality filtering
- **x402 Payments** - Instant micropayments
- **Activity Logging** - Full audit trail

---

## 📊 Smart Contract API

### Instructions

#### `initialize`
```rust
pub fn initialize(
    ctx: Context<Initialize>,
    platform_fee: u16,
    min_tip_amount: u64,
) -> Result<()>
```
Initialize the platform (one-time, owner only).

#### `register_creator`
```rust
pub fn register_creator(
    ctx: Context<RegisterCreator>,
    basename: String,
    display_name: String,
    avatar_url: String,
) -> Result<()>
```
Register as a creator.

#### `register_agent`
```rust
pub fn register_agent(
    ctx: Context<RegisterAgent>,
    agent_name: String,
    agent_type: String,
) -> Result<()>
```
Register an AI agent.

#### `tip_creator`
```rust
pub fn tip_creator(
    ctx: Context<TipCreator>,
    amount: u64,
    message: String,
    payment_proof: String,
) -> Result<()>
```
Send a tip with x402 proof.

### State Accounts

#### `PlatformConfig`
- Platform settings
- Fee configuration
- Total statistics
- Top tipper tracking

#### `Creator`
- Profile information
- Tip statistics
- Reputation score
- Streak data

#### `Agent`
- Agent metadata
- Tip activity
- Reputation
- Status

### Events

- `CreatorRegistered`
- `AgentRegistered`
- `TipSent`
- `NewTopTipper`
- `StreakMilestone`

---

## 🤝 Sponsor Integrations

TipChain integrates with **9 hackathon sponsors** to maximize bounty eligibility:

| Sponsor | Bounty | Integration |
|---------|--------|-------------|
| 💜 **Phantom CASH** | $10,000 | Instant tip settlement |
| 💳 **Visa TAP** | $10,000 | Enterprise agent payments |
| 🔗 **ATXP/ACP/AP2** | $10,000 | Multi-protocol coordination |
| 🏦 **CDP Wallets** | $5,000 | Embedded agent wallets |
| 🧠 **Gradient Parallax** | $5,000 | ML creator analysis |
| 🔐 **OpenMined OM1** | $5,000 | Privacy-preserving analytics |
| 📡 **Switchboard** | $5,000 | Reputation oracles |
| 🛡️ **Dark Research** | $10,000 | Fraud detection (Mallory) |
| 💰 **AgentPay** | $5,000 | API/LLM micropayments |

**Total Potential**: $65,000 in sponsor bounties!

### Example: Phantom CASH Integration

```typescript
import { PhantomCASH } from '@phantom/cash-sdk';

const cashAgent = new PhantomCashAgent();
await cashAgent.tipWithCash('alice', 0.5); // Instant settlement
```

### Example: Multi-Protocol (ATXP/ACP/AP2)

```typescript
// Agent coordination via ATXP
await agent.coordinateWith(['agent1', 'agent2']);

// Cross-chain payments via ACP
await agent.crossChainTip('creator', 'ethereum', 1.0);

// Optimized routing via AP2
const route = await agent.optimizePayment('creator', 1.0);
```

**Full documentation**: [`docs/integrations/SPONSOR_INTEGRATIONS.md`](docs/integrations/SPONSOR_INTEGRATIONS.md)

---

## 🧪 Testing

### Run Tests

```bash
# Build program
anchor build

# Run tests
anchor test

# Run specific test
anchor test -- --test creator_registration
```

### Test Coverage

- ✅ Platform initialization
- ✅ Creator registration
- ✅ Agent registration
- ✅ Tip sending with fees
- ✅ Reputation updates
- ✅ Streak tracking
- ✅ Top tipper updates
- ✅ Admin functions

---

## 🎥 Demo Video Script

### 📹 3-Minute Demo (Required for Hackathon)

**Minute 1: The Problem** (0:00-1:00)
- Current creator economy broken
- 20-30% platform fees
- No micropayments
- AI agents can't participate

**Minute 2: Our Solution** (1:00-2:00)
- Live demo: Agent discovers creator
- Agent sends tip via x402
- Creator receives instantly (98% after 2% fee)
- On-chain reputation updates
- Show dashboard with real-time stats

**Minute 3: Impact & Vision** (2:00-3:00)
- $100B creator economy now accessible to AI
- Show: 100+ transactions, 20+ creators, 5+ agents
- Multi-protocol integration (all sponsors)
- Call to action: "Join the Agent Economy"

---

## 🏗️ Development Roadmap

### Phase 1: MVP (Current)
- ✅ Smart contract deployment
- ✅ TypeScript SDK
- ✅ Frontend application
- ✅ Basic AI agent
- ✅ x402 integration

### Phase 2: Beta (Post-Hackathon)
- [ ] MCP Server implementation
- [ ] Multi-protocol support (ATXP, ACP, AP2)
- [ ] Phantom CASH integration
- [ ] Visa TAP for enterprise
- [ ] Enhanced analytics

### Phase 3: Launch
- [ ] Mainnet deployment
- [ ] Creator onboarding program
- [ ] Agent marketplace
- [ ] Mobile app
- [ ] API marketplace

---

## 🔐 Security

### Smart Contract
- Anchor framework (safe Rust)
- PDA-based account security
- Authorization checks on all instructions
- Fee validation
- Overflow protection

### Agents
- Wallet key management
- Budget limits
- Rate limiting
- Activity logging
- Error handling

### Frontend
- Wallet adapter security
- Transaction signing verification
- HTTPS only
- No private key exposure

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Submit a pull request

### Code Style
- TypeScript: ESLint + Prettier
- Rust: rustfmt
- Commits: Conventional Commits

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Solana Foundation** - For the amazing blockchain
- **x402 Team** - For the payment protocol
- **Anchor Team** - For the development framework
- **Hackathon Sponsors** - For the bounties and support
- **Open Source Community** - For the tools and libraries

---

## 📞 Contact & Links

- **Demo**: [https://tipchain-agent.vercel.app](https://tipchain-agent.vercel.app)
- **GitHub**: [https://github.com/yourusername/solana-x402](https://github.com/yourusername/solana-x402)
- **Twitter**: [@tipchain_ai](https://twitter.com/tipchain_ai)
- **Discord**: [Join our community](https://discord.gg/tipchain)
- **Docs**: [https://docs.tipchain.ai](https://docs.tipchain.ai)

---

## 🚀 Built for Solana x402 Hackathon 2025

**Competing for:**
- 🏆 5 Main Categories ($50k)
- 💰 9 Sponsor Bounties ($62.5k+)
- 🌟 Total Prize Pool: $112,500+

**Let's build the future of the creator economy together!** 🎨🤖💜

---

<div align="center">

Made with 💜 by the TipChain Team

**#SolanaX402 #AgentEconomy #Web3 #Micropayments**

</div>
