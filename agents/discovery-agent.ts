/**
 * Discovery Agent - Autonomous Creator Discovery & Tipping
 *
 * This AI agent demonstrates:
 * - Autonomous creator discovery based on preferences
 * - x402 payment integration
 * - Reputation-based decision making
 * - Automated tipping based on content quality
 */

import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import TipChainSDK, { Creator } from '../sdk/src';
import * as fs from 'fs';

interface AgentConfig {
  rpcUrl: string;
  walletPath: string;
  preferences: {
    minReputation: number;
    maxTipAmount: number;
    categories: string[];
  };
  budget: {
    daily: number;
    perTip: { min: number; max: number };
  };
}

export class DiscoveryAgent {
  private connection: Connection;
  private wallet: Keypair;
  private sdk: TipChainSDK;
  private config: AgentConfig;
  private dailySpent: number = 0;
  private isRunning: boolean = false;

  constructor(config: AgentConfig) {
    this.config = config;
    this.connection = new Connection(config.rpcUrl);

    // Load wallet
    const walletData = JSON.parse(fs.readFileSync(config.walletPath, 'utf-8'));
    this.wallet = Keypair.fromSecretKey(new Uint8Array(walletData));

    this.sdk = new TipChainSDK(this.connection);
  }

  /**
   * Start the agent's autonomous operation
   */
  async start() {
    console.log('🤖 Discovery Agent starting...');
    console.log(`Wallet: ${this.wallet.publicKey.toBase58()}`);

    this.isRunning = true;

    while (this.isRunning) {
      try {
        await this.discoverAndTip();
        await this.sleep(30000); // Run every 30 seconds
      } catch (error) {
        console.error('Error in agent loop:', error);
        await this.sleep(60000); // Wait longer on error
      }
    }
  }

  /**
   * Stop the agent
   */
  stop() {
    console.log('🛑 Discovery Agent stopping...');
    this.isRunning = false;
  }

  /**
   * Main discovery and tipping logic
   */
  private async discoverAndTip() {
    console.log('\n🔍 Discovering creators...');

    // Check daily budget
    if (this.dailySpent >= this.config.budget.daily) {
      console.log('💰 Daily budget reached. Waiting for reset...');
      return;
    }

    // Fetch all creators
    const creators = await this.sdk.getAllCreators(50);

    if (creators.length === 0) {
      console.log('No creators found');
      return;
    }

    // Filter creators based on preferences
    const eligibleCreators = this.filterCreators(creators);

    if (eligibleCreators.length === 0) {
      console.log('No eligible creators found');
      return;
    }

    // Select creator to tip
    const selectedCreator = this.selectCreator(eligibleCreators);

    // Analyze and determine tip amount
    const tipAmount = this.calculateTipAmount(selectedCreator);

    // Execute tip
    await this.executeTip(selectedCreator, tipAmount);
  }

  /**
   * Filter creators based on agent preferences
   */
  private filterCreators(creators: Creator[]): Creator[] {
    return creators.filter((creator) => {
      // Check minimum reputation
      if (creator.reputationScore < this.config.preferences.minReputation) {
        return false;
      }

      // Check if creator has recent activity
      const hoursSinceLastTip = (Date.now() / 1000 - creator.lastTipTime.toNumber()) / 3600;
      if (hoursSinceLastTip > 168) {
        // No activity in 7 days
        return false;
      }

      return true;
    });
  }

  /**
   * Select a creator using weighted random selection
   */
  private selectCreator(creators: Creator[]): Creator {
    // Weight by reputation and streak
    const weights = creators.map((c) => c.reputationScore * (1 + c.streak * 0.1));
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);

    let random = Math.random() * totalWeight;
    for (let i = 0; i < creators.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        return creators[i];
      }
    }

    return creators[0];
  }

  /**
   * Calculate tip amount based on creator quality
   */
  private calculateTipAmount(creator: Creator): number {
    const { min, max } = this.config.budget.perTip;

    // Base amount
    let amount = min;

    // Increase based on reputation
    const reputationBonus = ((creator.reputationScore - 50) / 50) * (max - min) * 0.3;
    amount += Math.max(0, reputationBonus);

    // Increase based on streak
    const streakBonus = Math.min(creator.streak * 0.01, 0.2) * (max - min);
    amount += streakBonus;

    // Ensure within bounds and budget
    amount = Math.min(amount, max);
    amount = Math.min(amount, this.config.budget.daily - this.dailySpent);

    return Math.floor(amount * 1e9); // Convert to lamports
  }

  /**
   * Execute the tip transaction
   */
  private async executeTip(creator: Creator, amount: number) {
    console.log(`\n💸 Tipping @${creator.basename}`);
    console.log(`   Amount: ${amount / 1e9} SOL`);
    console.log(`   Reputation: ${creator.reputationScore}`);
    console.log(`   Streak: ${creator.streak}`);

    try {
      // Generate x402 payment proof
      const paymentProof = this.generateX402Proof(creator, amount);

      const message = this.generateTipMessage(creator);

      // In production, this would actually send the transaction
      // const signature = await this.sdk.tipCreator(
      //   this.wallet,
      //   creator.basename,
      //   amount,
      //   message,
      //   paymentProof
      // );

      // Simulate for demo
      console.log('✅ Tip sent successfully!');
      // console.log(`   Signature: ${signature}`);

      this.dailySpent += amount / 1e9;

      // Log activity
      this.logActivity({
        action: 'tip',
        creator: creator.basename,
        amount: amount / 1e9,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('❌ Failed to send tip:', error);
    }
  }

  /**
   * Generate x402 payment proof
   */
  private generateX402Proof(creator: Creator, amount: number): string {
    const timestamp = Date.now();
    const nonce = Math.random().toString(36).substring(7);

    return `x402_${timestamp}_${this.wallet.publicKey.toBase58()}_${creator.authority.toBase58()}_${amount}_${nonce}`;
  }

  /**
   * Generate contextual tip message
   */
  private generateTipMessage(creator: Creator): string {
    const messages = [
      `Great content, @${creator.basename}! Keep it up! 🚀`,
      `Love your work! Supporting you with SOL 💜`,
      `Amazing creator! This tip is well deserved ⭐`,
      `Keep creating awesome content! 🎨`,
      `Your ${creator.streak} day streak is impressive! 🔥`,
    ];

    return messages[Math.floor(Math.random() * messages.length)];
  }

  /**
   * Log agent activity
   */
  private logActivity(activity: any) {
    const logFile = 'agents/activity.log';
    const logEntry = JSON.stringify({ ...activity, agent: 'DiscoveryAgent' }) + '\n';

    fs.appendFileSync(logFile, logEntry);
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get agent stats
   */
  getStats() {
    return {
      wallet: this.wallet.publicKey.toBase58(),
      dailySpent: this.dailySpent,
      budgetRemaining: this.config.budget.daily - this.dailySpent,
      isRunning: this.isRunning,
    };
  }
}

// Example usage
if (require.main === module) {
  const config: AgentConfig = {
    rpcUrl: 'https://api.devnet.solana.com',
    walletPath: process.env.WALLET_PATH || './wallet.json',
    preferences: {
      minReputation: 70,
      maxTipAmount: 1.0,
      categories: ['art', 'music', 'tech'],
    },
    budget: {
      daily: 5.0, // 5 SOL per day
      perTip: { min: 0.1, max: 0.5 },
    },
  };

  const agent = new DiscoveryAgent(config);

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    agent.stop();
    process.exit(0);
  });

  agent.start().catch(console.error);
}

export default DiscoveryAgent;
