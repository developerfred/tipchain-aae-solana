import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  Keypair,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import { Program, AnchorProvider, web3, BN, Idl } from '@coral-xyz/anchor';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';

// Program ID (should match Anchor.toml)
export const PROGRAM_ID = new PublicKey('HEWsDJuFvTpofnKG6xiVshokK9oKQfpwwEqurKHAFP8F');

// Types
export interface Creator {
  authority: PublicKey;
  basename: string;
  displayName: string;
  avatarUrl: string;
  totalTipsReceived: BN;
  tipCount: number;
  lastTipTime: BN;
  streak: number;
  reputationScore: number;
  agentCount: number;
  bump: number;
}

export interface Agent {
  authority: PublicKey;
  agentName: string;
  agentType: string;
  totalTipsSent: BN;
  tipCount: number;
  reputationScore: number;
  isActive: boolean;
  bump: number;
}

export interface PlatformConfig {
  authority: PublicKey;
  platformFee: number;
  feeDenominator: number;
  minTipAmount: BN;
  paused: boolean;
  totalCreators: BN;
  totalTips: BN;
  totalVolume: BN;
  topTipper: PublicKey;
  topTipAmount: BN;
}

/**
 * TipChain Agent Economy SDK
 */
export class TipChainSDK {
  connection: Connection;
  programId: PublicKey;

  constructor(connection: Connection, programId: PublicKey = PROGRAM_ID) {
    this.connection = connection;
    this.programId = programId;
  }

  /**
   * Get PDA for platform config
   */
  getPlatformConfigPDA(): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from('platform_config')],
      this.programId
    );
  }

  /**
   * Get PDA for creator account
   */
  getCreatorPDA(basename: string): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from('creator'), Buffer.from(basename)],
      this.programId
    );
  }

  /**
   * Get PDA for agent account
   */
  getAgentPDA(authority: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from('agent'), authority.toBuffer()],
      this.programId
    );
  }

  /**
   * Initialize the platform
   */
  async initialize(
    authority: Keypair,
    platformFee: number = 200,
    minTipAmount: number = 1000000
  ): Promise<string> {
    const [platformConfigPDA] = this.getPlatformConfigPDA();

    const instruction = await this.createInitializeInstruction(
      authority.publicKey,
      platformConfigPDA,
      platformFee,
      minTipAmount
    );

    const transaction = new Transaction().add(instruction);
    const signature = await this.connection.sendTransaction(transaction, [authority]);
    await this.connection.confirmTransaction(signature);

    return signature;
  }

  /**
   * Register a new creator
   */
  async registerCreator(
    authority: Keypair,
    basename: string,
    displayName: string,
    avatarUrl: string
  ): Promise<string> {
    const [creatorPDA] = this.getCreatorPDA(basename);
    const [platformConfigPDA] = this.getPlatformConfigPDA();

    const instruction = await this.createRegisterCreatorInstruction(
      authority.publicKey,
      creatorPDA,
      platformConfigPDA,
      basename,
      displayName,
      avatarUrl
    );

    const transaction = new Transaction().add(instruction);
    const signature = await this.connection.sendTransaction(transaction, [authority]);
    await this.connection.confirmTransaction(signature);

    return signature;
  }

  /**
   * Register a new AI agent
   */
  async registerAgent(
    authority: Keypair,
    agentName: string,
    agentType: string
  ): Promise<string> {
    const [agentPDA] = this.getAgentPDA(authority.publicKey);

    const instruction = await this.createRegisterAgentInstruction(
      authority.publicKey,
      agentPDA,
      agentName,
      agentType
    );

    const transaction = new Transaction().add(instruction);
    const signature = await this.connection.sendTransaction(transaction, [authority]);
    await this.connection.confirmTransaction(signature);

    return signature;
  }

  /**
   * Send a tip to a creator
   */
  async tipCreator(
    tipper: Keypair,
    creatorBasename: string,
    amount: number,
    message: string,
    paymentProof: string = '',
    tokenMint?: PublicKey
  ): Promise<string> {
    const [creatorPDA] = this.getCreatorPDA(creatorBasename);
    const [platformConfigPDA] = this.getPlatformConfigPDA();

    const creator = await this.getCreator(creatorBasename);
    if (!creator) {
      throw new Error('Creator not found');
    }

    // Get token accounts
    const mint = tokenMint || new PublicKey('So11111111111111111111111111111111111111112'); // Native SOL
    const fromTokenAccount = await getAssociatedTokenAddress(mint, tipper.publicKey);
    const creatorTokenAccount = await getAssociatedTokenAddress(mint, creator.authority);
    const platformConfig = await this.getPlatformConfig();
    const platformTokenAccount = await getAssociatedTokenAddress(mint, platformConfig!.authority);

    const instruction = await this.createTipCreatorInstruction(
      tipper.publicKey,
      creatorPDA,
      platformConfigPDA,
      fromTokenAccount,
      creatorTokenAccount,
      platformTokenAccount,
      amount,
      message,
      paymentProof
    );

    const transaction = new Transaction().add(instruction);
    const signature = await this.connection.sendTransaction(transaction, [tipper]);
    await this.connection.confirmTransaction(signature);

    return signature;
  }

  /**
   * Get creator account
   */
  async getCreator(basename: string): Promise<Creator | null> {
    const [creatorPDA] = this.getCreatorPDA(basename);

    try {
      const accountInfo = await this.connection.getAccountInfo(creatorPDA);
      if (!accountInfo) return null;

      // Parse account data (simplified - in production use Anchor deserialization)
      return this.parseCreatorAccount(accountInfo.data);
    } catch (error) {
      console.error('Error fetching creator:', error);
      return null;
    }
  }

  /**
   * Get agent account
   */
  async getAgent(authority: PublicKey): Promise<Agent | null> {
    const [agentPDA] = this.getAgentPDA(authority);

    try {
      const accountInfo = await this.connection.getAccountInfo(agentPDA);
      if (!accountInfo) return null;

      return this.parseAgentAccount(accountInfo.data);
    } catch (error) {
      console.error('Error fetching agent:', error);
      return null;
    }
  }

  /**
   * Get platform config
   */
  async getPlatformConfig(): Promise<PlatformConfig | null> {
    const [platformConfigPDA] = this.getPlatformConfigPDA();

    try {
      const accountInfo = await this.connection.getAccountInfo(platformConfigPDA);
      if (!accountInfo) return null;

      return this.parsePlatformConfigAccount(accountInfo.data);
    } catch (error) {
      console.error('Error fetching platform config:', error);
      return null;
    }
  }

  /**
   * Get all creators (paginated)
   */
  async getAllCreators(limit: number = 50): Promise<Creator[]> {
    const accounts = await this.connection.getProgramAccounts(this.programId, {
      filters: [
        {
          memcmp: {
            offset: 0,
            bytes: Buffer.from([0x01]).toString('base64'), // Creator discriminator
          },
        },
      ],
    });

    return accounts
      .map((account) => this.parseCreatorAccount(account.account.data))
      .slice(0, limit);
  }

  /**
   * Get platform statistics
   */
  async getPlatformStats(): Promise<{
    totalCreators: number;
    totalTips: number;
    totalVolume: number;
    topTipper: PublicKey | null;
    topTipAmount: number;
  }> {
    const config = await this.getPlatformConfig();

    if (!config) {
      return {
        totalCreators: 0,
        totalTips: 0,
        totalVolume: 0,
        topTipper: null,
        topTipAmount: 0,
      };
    }

    return {
      totalCreators: config.totalCreators.toNumber(),
      totalTips: config.totalTips.toNumber(),
      totalVolume: config.totalVolume.toNumber(),
      topTipper: config.topTipper,
      topTipAmount: config.topTipAmount.toNumber(),
    };
  }

  // Helper methods to create instructions (simplified)
  private async createInitializeInstruction(
    authority: PublicKey,
    platformConfig: PublicKey,
    platformFee: number,
    minTipAmount: number
  ): Promise<TransactionInstruction> {
    // This is a simplified version - in production, use Anchor IDL
    const keys = [
      { pubkey: platformConfig, isSigner: false, isWritable: true },
      { pubkey: authority, isSigner: true, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ];

    const data = Buffer.from([
      0, // initialize instruction discriminator
      ...new BN(platformFee).toArray('le', 2),
      ...new BN(minTipAmount).toArray('le', 8),
    ]);

    return new TransactionInstruction({
      keys,
      programId: this.programId,
      data,
    });
  }

  private async createRegisterCreatorInstruction(
    authority: PublicKey,
    creator: PublicKey,
    platformConfig: PublicKey,
    basename: string,
    displayName: string,
    avatarUrl: string
  ): Promise<TransactionInstruction> {
    const keys = [
      { pubkey: creator, isSigner: false, isWritable: true },
      { pubkey: platformConfig, isSigner: false, isWritable: true },
      { pubkey: authority, isSigner: true, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ];

    // Simplified instruction data
    const basenameBytes = Buffer.from(basename);
    const displayNameBytes = Buffer.from(displayName);
    const avatarUrlBytes = Buffer.from(avatarUrl);

    const data = Buffer.concat([
      Buffer.from([1]), // register_creator discriminator
      Buffer.from([basenameBytes.length]),
      basenameBytes,
      Buffer.from([displayNameBytes.length]),
      displayNameBytes,
      Buffer.from([avatarUrlBytes.length]),
      avatarUrlBytes,
    ]);

    return new TransactionInstruction({
      keys,
      programId: this.programId,
      data,
    });
  }

  private async createRegisterAgentInstruction(
    authority: PublicKey,
    agent: PublicKey,
    agentName: string,
    agentType: string
  ): Promise<TransactionInstruction> {
    const keys = [
      { pubkey: agent, isSigner: false, isWritable: true },
      { pubkey: authority, isSigner: true, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ];

    const agentNameBytes = Buffer.from(agentName);
    const agentTypeBytes = Buffer.from(agentType);

    const data = Buffer.concat([
      Buffer.from([2]), // register_agent discriminator
      Buffer.from([agentNameBytes.length]),
      agentNameBytes,
      Buffer.from([agentTypeBytes.length]),
      agentTypeBytes,
    ]);

    return new TransactionInstruction({
      keys,
      programId: this.programId,
      data,
    });
  }

  private async createTipCreatorInstruction(
    tipper: PublicKey,
    creator: PublicKey,
    platformConfig: PublicKey,
    fromTokenAccount: PublicKey,
    creatorTokenAccount: PublicKey,
    platformTokenAccount: PublicKey,
    amount: number,
    message: string,
    paymentProof: string
  ): Promise<TransactionInstruction> {
    const keys = [
      { pubkey: creator, isSigner: false, isWritable: true },
      { pubkey: platformConfig, isSigner: false, isWritable: true },
      { pubkey: tipper, isSigner: true, isWritable: true },
      { pubkey: fromTokenAccount, isSigner: false, isWritable: true },
      { pubkey: creatorTokenAccount, isSigner: false, isWritable: true },
      { pubkey: platformTokenAccount, isSigner: false, isWritable: true },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    ];

    const messageBytes = Buffer.from(message);
    const proofBytes = Buffer.from(paymentProof);

    const data = Buffer.concat([
      Buffer.from([3]), // tip_creator discriminator
      new BN(amount).toArrayLike(Buffer, 'le', 8),
      Buffer.from([messageBytes.length]),
      messageBytes,
      Buffer.from([proofBytes.length]),
      proofBytes,
    ]);

    return new TransactionInstruction({
      keys,
      programId: this.programId,
      data,
    });
  }

  // Parsing methods (simplified - in production use Anchor borsh deserialization)
  private parseCreatorAccount(data: Buffer): Creator {
    // Simplified parsing - implement proper borsh deserialization
    return {
      authority: new PublicKey(data.slice(8, 40)),
      basename: '',
      displayName: '',
      avatarUrl: '',
      totalTipsReceived: new BN(0),
      tipCount: 0,
      lastTipTime: new BN(0),
      streak: 0,
      reputationScore: 0,
      agentCount: 0,
      bump: 0,
    };
  }

  private parseAgentAccount(data: Buffer): Agent {
    return {
      authority: new PublicKey(data.slice(8, 40)),
      agentName: '',
      agentType: '',
      totalTipsSent: new BN(0),
      tipCount: 0,
      reputationScore: 0,
      isActive: false,
      bump: 0,
    };
  }

  private parsePlatformConfigAccount(data: Buffer): PlatformConfig {
    return {
      authority: new PublicKey(data.slice(8, 40)),
      platformFee: 0,
      feeDenominator: 0,
      minTipAmount: new BN(0),
      paused: false,
      totalCreators: new BN(0),
      totalTips: new BN(0),
      totalVolume: new BN(0),
      topTipper: new PublicKey(data.slice(100, 132)),
      topTipAmount: new BN(0),
    };
  }
}

// Export utility functions
export const formatSOL = (lamports: number): string => {
  return (lamports / LAMPORTS_PER_SOL).toFixed(4);
};

export const parseSOL = (sol: number): number => {
  return Math.floor(sol * LAMPORTS_PER_SOL);
};

// Export x402 protocol
export { X402Protocol, X402API } from './x402';
export type {
  X402PaymentProof,
  X402PaymentRequest,
  X402PaymentResponse,
} from './x402';

export default TipChainSDK;
