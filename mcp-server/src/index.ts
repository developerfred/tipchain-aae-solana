#!/usr/bin/env node

/**
 * TipChain MCP Server
 *
 * Model Context Protocol server that allows AI assistants (Claude, GPT, etc.)
 * to interact with the TipChain platform autonomously.
 *
 * Capabilities:
 * - Discover creators
 * - Get creator profiles
 * - Send tips with x402
 * - Query platform statistics
 * - Manage agent reputation
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import TipChainSDK, { Creator } from "../../sdk/src/index.js";
import { z } from "zod";
import * as fs from "fs";
import * as path from "path";

// Tool schemas
const DiscoverCreatorsSchema = z.object({
  minReputation: z.number().min(0).max(100).optional(),
  limit: z.number().min(1).max(50).optional(),
  sortBy: z.enum(["reputation", "tips", "volume"]).optional(),
});

const GetCreatorSchema = z.object({
  basename: z.string().min(1).max(20),
});

const TipCreatorSchema = z.object({
  basename: z.string().min(1).max(20),
  amount: z.number().min(0.001).max(100),
  message: z.string().max(280).optional(),
});

const GetPlatformStatsSchema = z.object({});

const RegisterAgentSchema = z.object({
  agentName: z.string().min(1).max(30),
  agentType: z.string().min(1).max(20),
});

class TipChainMCPServer {
  private server: Server;
  private sdk: TipChainSDK;
  private connection: Connection;
  private wallet?: Keypair;

  constructor() {
    this.server = new Server(
      {
        name: "tipchain-mcp-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Initialize Solana connection
    const rpcUrl = process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com";
    this.connection = new Connection(rpcUrl, "confirmed");
    this.sdk = new TipChainSDK(this.connection);

    // Load wallet if provided
    const walletPath = process.env.WALLET_PATH;
    if (walletPath && fs.existsSync(walletPath)) {
      const walletData = JSON.parse(fs.readFileSync(walletPath, "utf-8"));
      this.wallet = Keypair.fromSecretKey(new Uint8Array(walletData));
      console.error(`Loaded wallet: ${this.wallet.publicKey.toBase58()}`);
    }

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  private setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error("[MCP Error]", error);
    };

    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: this.getTools(),
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case "discover_creators":
            return await this.discoverCreators(args);
          case "get_creator":
            return await this.getCreator(args);
          case "tip_creator":
            return await this.tipCreator(args);
          case "get_platform_stats":
            return await this.getPlatformStats(args);
          case "register_agent":
            return await this.registerAgent(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  private getTools(): Tool[] {
    return [
      {
        name: "discover_creators",
        description:
          "Discover creators on TipChain based on criteria like reputation, tips, etc. " +
          "Use this to find creators to support or analyze the creator ecosystem.",
        inputSchema: {
          type: "object",
          properties: {
            minReputation: {
              type: "number",
              description: "Minimum reputation score (0-100)",
              minimum: 0,
              maximum: 100,
            },
            limit: {
              type: "number",
              description: "Maximum number of creators to return (1-50)",
              minimum: 1,
              maximum: 50,
              default: 10,
            },
            sortBy: {
              type: "string",
              enum: ["reputation", "tips", "volume"],
              description: "Sort creators by this field",
              default: "reputation",
            },
          },
        },
      },
      {
        name: "get_creator",
        description:
          "Get detailed information about a specific creator by their basename. " +
          "Returns profile, stats, reputation, and earning information.",
        inputSchema: {
          type: "object",
          properties: {
            basename: {
              type: "string",
              description: "Creator's unique basename (e.g., 'alice')",
              minLength: 1,
              maxLength: 20,
            },
          },
          required: ["basename"],
        },
      },
      {
        name: "tip_creator",
        description:
          "Send a tip to a creator using x402 micropayments. " +
          "Requires wallet to be configured. Automatically calculates fees.",
        inputSchema: {
          type: "object",
          properties: {
            basename: {
              type: "string",
              description: "Creator's basename to tip",
              minLength: 1,
              maxLength: 20,
            },
            amount: {
              type: "number",
              description: "Amount in SOL to tip (min 0.001, max 100)",
              minimum: 0.001,
              maximum: 100,
            },
            message: {
              type: "string",
              description: "Optional message to include with the tip",
              maxLength: 280,
            },
          },
          required: ["basename", "amount"],
        },
      },
      {
        name: "get_platform_stats",
        description:
          "Get overall TipChain platform statistics including total creators, " +
          "tips sent, volume, and top tippers.",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "register_agent",
        description:
          "Register this AI as an autonomous agent on TipChain. " +
          "Enables reputation tracking and agent-specific features.",
        inputSchema: {
          type: "object",
          properties: {
            agentName: {
              type: "string",
              description: "Name for this agent (e.g., 'ClaudeBot')",
              minLength: 1,
              maxLength: 30,
            },
            agentType: {
              type: "string",
              description: "Type of agent (discovery, curator, analyst, tipper)",
              minLength: 1,
              maxLength: 20,
            },
          },
          required: ["agentName", "agentType"],
        },
      },
    ];
  }

  private async discoverCreators(args: unknown) {
    const params = DiscoverCreatorsSchema.parse(args);

    const allCreators = await this.sdk.getAllCreators(params.limit || 10);

    // Filter by reputation if specified
    let filteredCreators = allCreators;
    if (params.minReputation !== undefined) {
      filteredCreators = allCreators.filter(
        (c) => c.reputationScore >= params.minReputation!
      );
    }

    // Sort creators
    const sortBy = params.sortBy || "reputation";
    filteredCreators.sort((a, b) => {
      switch (sortBy) {
        case "reputation":
          return b.reputationScore - a.reputationScore;
        case "tips":
          return b.tipCount - a.tipCount;
        case "volume":
          return (
            b.totalTipsReceived.toNumber() - a.totalTipsReceived.toNumber()
          );
        default:
          return 0;
      }
    });

    const result = filteredCreators.map((creator) => ({
      basename: creator.basename,
      displayName: creator.displayName,
      reputation: creator.reputationScore,
      tipCount: creator.tipCount,
      totalReceived: `${creator.totalTipsReceived.toNumber() / 1e9} SOL`,
      streak: creator.streak,
    }));

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              count: result.length,
              creators: result,
            },
            null,
            2
          ),
        },
      ],
    };
  }

  private async getCreator(args: unknown) {
    const params = GetCreatorSchema.parse(args);

    const creator = await this.sdk.getCreator(params.basename);

    if (!creator) {
      throw new Error(`Creator @${params.basename} not found`);
    }

    const result = {
      basename: creator.basename,
      displayName: creator.displayName,
      avatarUrl: creator.avatarUrl,
      authority: creator.authority.toBase58(),
      stats: {
        totalTipsReceived: `${creator.totalTipsReceived.toNumber() / 1e9} SOL`,
        tipCount: creator.tipCount,
        reputation: creator.reputationScore,
        streak: creator.streak,
        lastTipTime: new Date(
          creator.lastTipTime.toNumber() * 1000
        ).toISOString(),
      },
    };

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async tipCreator(args: unknown) {
    const params = TipCreatorSchema.parse(args);

    if (!this.wallet) {
      throw new Error(
        "Wallet not configured. Set WALLET_PATH environment variable."
      );
    }

    const creator = await this.sdk.getCreator(params.basename);
    if (!creator) {
      throw new Error(`Creator @${params.basename} not found`);
    }

    // Convert SOL to lamports
    const lamports = Math.floor(params.amount * 1e9);

    // Generate x402 payment proof
    const paymentProof = this.generateX402Proof(
      creator.authority,
      lamports,
      params.message || ""
    );

    // In production, this would actually send the transaction
    // For demo purposes, we'll simulate
    const signature = "SIMULATED_" + Date.now();

    // Calculate fees
    const platformFee = lamports * 0.02;
    const creatorReceives = lamports - platformFee;

    const result = {
      success: true,
      transaction: signature,
      details: {
        to: {
          basename: creator.basename,
          displayName: creator.displayName,
        },
        amount: `${params.amount} SOL`,
        platformFee: `${platformFee / 1e9} SOL (2%)`,
        creatorReceives: `${creatorReceives / 1e9} SOL`,
        message: params.message || "",
        paymentProof,
      },
    };

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async getPlatformStats(args: unknown) {
    GetPlatformStatsSchema.parse(args);

    const stats = await this.sdk.getPlatformStats();

    const result = {
      platform: "TipChain Agent Economy",
      statistics: {
        totalCreators: stats.totalCreators,
        totalTips: stats.totalTips,
        totalVolume: `${stats.totalVolume / 1e9} SOL`,
        topTipper: stats.topTipper?.toBase58() || "None",
        topTipAmount: `${stats.topTipAmount / 1e9} SOL`,
      },
      timestamp: new Date().toISOString(),
    };

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async registerAgent(args: unknown) {
    const params = RegisterAgentSchema.parse(args);

    if (!this.wallet) {
      throw new Error(
        "Wallet not configured. Set WALLET_PATH environment variable."
      );
    }

    // In production, this would call the actual contract
    // For demo, we simulate
    const agentPubkey = this.wallet.publicKey.toBase58();

    const result = {
      success: true,
      agent: {
        name: params.agentName,
        type: params.agentType,
        publicKey: agentPubkey,
        registered: new Date().toISOString(),
        reputation: 100,
        status: "active",
      },
    };

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private generateX402Proof(
    recipient: PublicKey,
    amount: number,
    message: string
  ): string {
    const timestamp = Date.now();
    const nonce = Math.random().toString(36).substring(7);
    const sender = this.wallet?.publicKey.toBase58() || "unknown";

    return `x402_${timestamp}_${sender}_${recipient.toBase58()}_${amount}_${nonce}_${Buffer.from(
      message
    ).toString("base64")}`;
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("TipChain MCP Server running on stdio");
  }
}

// Start server
const server = new TipChainMCPServer();
server.start().catch(console.error);
