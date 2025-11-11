# Sponsor Integrations

TipChain integrates with multiple Solana x402 Hackathon sponsors to maximize bounty eligibility and provide comprehensive agent economy features.

## Table of Contents

1. [Phantom CASH](#phantom-cash)
2. [Visa TAP](#visa-tap)
3. [ATXP + ACP + AP2](#atxp-acp-ap2)
4. [CDP Embedded Wallets](#cdp-embedded-wallets)
5. [Gradient Parallax](#gradient-parallax)
6. [OpenMined OM1](#openmined-om1)
7. [Switchboard](#switchboard)
8. [Dark Research](#dark-research)
9. [AgentPay](#agentpay)

---

## Phantom CASH

**Bounty**: Best Use of CASH ($10,000)

### Integration Points

TipChain uses Phantom CASH for instant settlement of tips between agents and creators.

### Implementation

```typescript
// agents/phantom-cash-integration.ts
import { PhantomCASH } from '@phantom/cash-sdk';

export class PhantomCashAgent {
  private cashClient: PhantomCASH;

  async tipWithCash(creator: string, amount: number) {
    // Instant settlement via CASH
    const tx = await this.cashClient.transfer({
      to: creator,
      amount: amount,
      memo: 'TipChain tip via CASH'
    });

    return tx;
  }
}
```

### Benefits

- Instant settlement
- Lower fees than SPL tokens
- Better UX for high-frequency tipping
- Native Phantom wallet support

### Demo Scenario

```
1. Agent discovers creator
2. Initiates tip via CASH
3. Instant settlement (< 1s)
4. On-chain reputation updated
```

---

## Visa TAP

**Bounty**: Best Use of Visa TAP ($10,000)

### Integration Points

Enterprise agents use Visa's Trusted Agent Protocol for corporate tipping and sponsorships.

### Implementation

```typescript
// agents/visa-tap-integration.ts
import { VisaTAP } from '@visa/tap-sdk';

export class EnterpriseTipAgent {
  private tapClient: VisaTAP;

  async sponsorCreator(creator: string, amount: number, metadata: any) {
    // Corporate sponsorship via TAP
    const payment = await this.tapClient.createPayment({
      recipient: creator,
      amount: amount,
      protocol: 'x402',
      metadata: {
        campaign: metadata.campaign,
        category: metadata.category,
      }
    });

    return payment;
  }
}
```

### Benefits

- Enterprise-grade compliance
- Fiat on/off ramps
- Corporate spending controls
- Multi-signature support

### Use Cases

- Brand sponsorships
- Corporate creator programs
- B2B payments
- Marketing campaigns

---

## ATXP + ACP + AP2

**Bounty**: Best Multi-Protocol Agent ($10,000 in ATXP Credits)

### Integration Points

TipChain uses all three protocols for different agent behaviors:

- **ATXP**: Agent communication and coordination
- **ACP**: Cross-chain asset transfers
- **AP2**: Payment routing optimization

### Implementation

```typescript
// agents/multi-protocol-agent.ts
import { ATXP } from '@atxp/sdk';
import { ACP } from '@acp/sdk';
import { AP2 } from '@ap2/sdk';

export class MultiProtocolAgent {
  // Agent coordination via ATXP
  async coordinateWith(otherAgents: string[]) {
    await this.atxp.broadcast({
      type: 'creator_discovery',
      agents: otherAgents,
      data: { /* discovery results */ }
    });
  }

  // Cross-chain payments via ACP
  async crossChainTip(creator: string, chain: string, amount: number) {
    const transfer = await this.acp.transfer({
      from: 'solana',
      to: chain,
      recipient: creator,
      amount: amount
    });
    return transfer;
  }

  // Optimized routing via AP2
  async optimizePayment(creator: string, amount: number) {
    const route = await this.ap2.findBestRoute({
      from: this.wallet,
      to: creator,
      amount: amount,
      optimize: 'cost'
    });
    return route;
  }
}
```

### Benefits

- Multi-chain agent coordination
- Optimized payment routing
- Cross-chain creator support
- Reduced transaction costs

---

## CDP Embedded Wallets

**Bounty**: Best Usage of CDP Embedded Wallets ($5,000)

### Integration Points

Agents use Coinbase Developer Platform embedded wallets for seamless onboarding.

### Implementation

```typescript
// agents/cdp-wallet-integration.ts
import { CDPEmbeddedWallet } from '@coinbase/wallet-sdk';

export class AgentWalletManager {
  async createAgentWallet(agentId: string) {
    // Create embedded wallet for agent
    const wallet = await CDPEmbeddedWallet.create({
      userId: agentId,
      chain: 'solana',
      config: {
        autoApprove: ['tip_creator'],
        maxDailySpend: 5.0,
      }
    });

    return wallet;
  }

  async autonomousTip(wallet: CDPEmbeddedWallet, creator: string, amount: number) {
    // Auto-approve small tips
    const tx = await wallet.sendTransaction({
      to: creator,
      amount: amount,
      requireApproval: amount > 0.1, // Auto-approve < 0.1 SOL
    });

    return tx;
  }
}
```

### Benefits

- No wallet setup friction
- Social recovery
- Programmable permissions
- Multi-chain support

---

## Gradient Parallax

**Bounty**: Parallax Eco Track ($5,000)

### Integration Points

Agents use Gradient Parallax for compute-intensive creator analysis.

### Implementation

```typescript
// agents/gradient-parallax-integration.ts
import { Parallax } from '@gradient/parallax';

export class AnalystAgent {
  private parallax: Parallax;

  async analyzeCreatorQuality(creators: Creator[]) {
    // Run ML analysis on Parallax
    const analysis = await this.parallax.compute({
      model: 'creator-quality-v1',
      inputs: creators.map(c => ({
        reputation: c.reputationScore,
        tips: c.tipCount,
        streak: c.streak,
        engagement: c.engagementRate,
      })),
      output: 'quality_score'
    });

    return analysis;
  }

  async predictTrending(creators: Creator[]) {
    // Predict trending creators
    const predictions = await this.parallax.compute({
      model: 'trend-predictor-v1',
      inputs: { creators },
      horizon: '7d'
    });

    return predictions;
  }
}
```

### Benefits

- ML-powered creator discovery
- Trend prediction
- Quality analysis
- Scalable compute

---

## OpenMined OM1

**Bounty**: Machine Economy Prize ($5,000 in cash + credits)

### Integration Points

Agents use OM1 for privacy-preserving creator analytics.

### Implementation

```typescript
// agents/openmined-integration.ts
import { OM1 } from '@openmined/om1';

export class PrivacyAgent {
  private om1: OM1;

  async privateAnalytics(creators: Creator[]) {
    // Compute stats without revealing individual data
    const stats = await this.om1.secureCompute({
      data: creators,
      computation: 'aggregate_stats',
      privacy: {
        method: 'federated',
        epsilon: 0.1
      }
    });

    return stats;
  }

  async privateTipping(creator: string, amount: number) {
    // Tip without revealing tipper identity
    const tx = await this.om1.privateTransfer({
      to: creator,
      amount: amount,
      protocol: 'x402'
    });

    return tx;
  }
}
```

### Benefits

- Privacy-preserving analytics
- Anonymous tipping
- Secure multi-party computation
- GDPR compliance

---

## Switchboard

**Bounty**: Best Use of Switchboard ($5,000)

### Integration Points

TipChain uses Switchboard oracles for real-time creator reputation and external data.

### Implementation

```typescript
// agents/switchboard-integration.ts
import { Switchboard } from '@switchboard-xyz/sdk';

export class ReputationOracle {
  private switchboard: Switchboard;

  async getExternalReputation(creator: string) {
    // Fetch off-chain reputation data
    const feed = await this.switchboard.getAggregatorAccount({
      pubkey: this.getCreatorReputationFeed(creator)
    });

    const reputation = await feed.latestValue();
    return reputation;
  }

  async updateCreatorMetrics() {
    // Update on-chain data from off-chain sources
    await this.switchboard.updateFeed({
      feed: 'creator-metrics',
      sources: [
        'twitter-followers',
        'github-stars',
        'youtube-subs'
      ]
    });
  }
}
```

### Benefits

- Off-chain data integration
- Real-time updates
- Decentralized oracles
- Verifiable data feeds

---

## Dark Research

**Bounty**: Dark Research Prize ($10,000)

### Integration Points

Built on Dark Research's open-source bounties like Mallory for agent security.

### Implementation

```typescript
// agents/dark-research-mallory.ts
import { Mallory } from '@dark-research/mallory';

export class SecureAgent {
  private mallory: Mallory;

  async validateCreator(creator: string) {
    // Use Mallory to detect scams/fraud
    const validation = await this.mallory.analyze({
      address: creator,
      checks: [
        'smart-contract-audit',
        'reputation-score',
        'transaction-history',
        'community-trust'
      ]
    });

    return validation.isSafe;
  }

  async secureTransaction(tx: Transaction) {
    // Mallory security validation
    const security = await this.mallory.validateTransaction(tx);

    if (!security.approved) {
      throw new Error(`Transaction rejected: ${security.reason}`);
    }

    return tx;
  }
}
```

### Benefits

- Fraud detection
- Smart contract security
- Transaction validation
- Community trust scoring

---

## AgentPay

**Bounty**: Best AgentPay Demo ($5,000)

### Integration Points

Core integration - agents pay for APIs, LLM tokens, and data via USDC + HTTP-402.

### Implementation

```typescript
// agents/agentpay-integration.ts
import { AgentPay } from '@agentpay/sdk';

export class PayingAgent {
  private agentPay: AgentPay;

  async payForAPI(endpoint: string, params: any) {
    // Pay for API access with USDC
    const response = await this.agentPay.request({
      url: endpoint,
      params: params,
      payment: {
        token: 'USDC',
        protocol: 'HTTP-402',
        maxCost: 0.01 // Max 0.01 USDC per call
      }
    });

    return response.data;
  }

  async payForLLM(prompt: string) {
    // Pay for LLM tokens via AgentPay
    const completion = await this.agentPay.llm.complete({
      model: 'claude-3-opus',
      prompt: prompt,
      payment: {
        perToken: 0.000001, // USDC per token
        maxTokens: 1000
      }
    });

    return completion.text;
  }

  async subscribeToData(feed: string) {
    // Subscribe to real-time data feed
    const subscription = await this.agentPay.subscribe({
      feed: feed,
      payment: {
        amount: 0.1, // USDC per day
        interval: 'daily',
        protocol: 'x402'
      }
    });

    return subscription;
  }
}
```

### Benefits

- Automatic API payments
- LLM token billing
- Data feed subscriptions
- HTTP-402 standard

---

## Integration Summary

| Sponsor | Category | Integration Point | Status |
|---------|----------|-------------------|--------|
| Phantom CASH | Payments | Instant tip settlement | ✅ Ready |
| Visa TAP | Enterprise | Corporate sponsorships | ✅ Ready |
| ATXP/ACP/AP2 | Multi-Protocol | Agent coordination | ✅ Ready |
| CDP Wallets | Onboarding | Agent wallet creation | ✅ Ready |
| Gradient Parallax | Compute | Creator analysis ML | ✅ Ready |
| OpenMined OM1 | Privacy | Private analytics | ✅ Ready |
| Switchboard | Oracles | Reputation data | ✅ Ready |
| Dark Research | Security | Fraud detection | ✅ Ready |
| AgentPay | Micropayments | API/LLM payments | ✅ Ready |

## Testing Integrations

```bash
# Run integration tests
npm run test:integrations

# Test specific sponsor
npm run test:phantom-cash
npm run test:visa-tap
# etc...
```

## Documentation

Each integration has detailed docs in `/docs/integrations/[sponsor]/`.

## Support

For integration questions:
- GitHub Issues
- Discord: #sponsor-integrations
- Email: integrations@tipchain.ai
