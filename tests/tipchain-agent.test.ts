import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TipchainAgent } from "../target/types/tipchain_agent";
import { assert } from "chai";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from "@solana/spl-token";

describe("tipchain-agent", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.TipchainAgent as Program<TipchainAgent>;
  const payer = provider.wallet as anchor.Wallet;

  let platformConfigPDA: PublicKey;
  let platformConfigBump: number;

  let tokenMint: PublicKey;
  let platformTokenAccount: PublicKey;

  before(async () => {
    // Derive platform config PDA
    [platformConfigPDA, platformConfigBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("platform_config")],
      program.programId
    );

    // Create token mint for testing
    tokenMint = await createMint(
      provider.connection,
      payer.payer,
      payer.publicKey,
      null,
      9
    );

    // Create platform token account
    const platformTokenAccountInfo = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      payer.payer,
      tokenMint,
      payer.publicKey
    );
    platformTokenAccount = platformTokenAccountInfo.address;
  });

  describe("Platform Initialization", () => {
    it("Initializes platform config", async () => {
      const platformFee = 200; // 2%
      const minTipAmount = new anchor.BN(1_000_000); // 0.001 SOL

      const tx = await program.methods
        .initialize(platformFee, minTipAmount)
        .accounts({
          platformConfig: platformConfigPDA,
          authority: payer.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      console.log("Initialize tx:", tx);

      // Fetch and verify platform config
      const config = await program.account.platformConfig.fetch(
        platformConfigPDA
      );

      assert.equal(config.authority.toString(), payer.publicKey.toString());
      assert.equal(config.platformFee, platformFee);
      assert.equal(config.feeDenominator, 10000);
      assert.equal(config.minTipAmount.toNumber(), minTipAmount.toNumber());
      assert.equal(config.paused, false);
      assert.equal(config.totalCreators.toNumber(), 0);
    });
  });

  describe("Creator Registration", () => {
    it("Registers a new creator", async () => {
      const basename = "alice";
      const displayName = "Alice Smith";
      const avatarUrl = "https://example.com/alice.jpg";

      const [creatorPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("creator"), Buffer.from(basename)],
        program.programId
      );

      const tx = await program.methods
        .registerCreator(basename, displayName, avatarUrl)
        .accounts({
          creator: creatorPDA,
          platformConfig: platformConfigPDA,
          authority: payer.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      console.log("Register creator tx:", tx);

      // Fetch and verify creator
      const creator = await program.account.creator.fetch(creatorPDA);

      assert.equal(creator.authority.toString(), payer.publicKey.toString());
      assert.equal(creator.basename, basename);
      assert.equal(creator.displayName, displayName);
      assert.equal(creator.avatarUrl, avatarUrl);
      assert.equal(creator.totalTipsReceived.toNumber(), 0);
      assert.equal(creator.tipCount, 0);
      assert.equal(creator.streak, 1);
    });

    it("Fails with invalid basename", async () => {
      const basename = "a".repeat(21); // Too long
      const displayName = "Test";
      const avatarUrl = "";

      const [creatorPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("creator"), Buffer.from(basename)],
        program.programId
      );

      try {
        await program.methods
          .registerCreator(basename, displayName, avatarUrl)
          .accounts({
            creator: creatorPDA,
            platformConfig: platformConfigPDA,
            authority: payer.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc();

        assert.fail("Should have failed with invalid basename");
      } catch (error) {
        assert.include(error.toString(), "InvalidBasename");
      }
    });
  });

  describe("Agent Registration", () => {
    it("Registers a new AI agent", async () => {
      const agentName = "DiscoveryBot";
      const agentType = "discovery";

      const [agentPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("agent"), payer.publicKey.toBuffer()],
        program.programId
      );

      const tx = await program.methods
        .registerAgent(agentName, agentType)
        .accounts({
          agent: agentPDA,
          authority: payer.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      console.log("Register agent tx:", tx);

      // Fetch and verify agent
      const agent = await program.account.agent.fetch(agentPDA);

      assert.equal(agent.authority.toString(), payer.publicKey.toString());
      assert.equal(agent.agentName, agentName);
      assert.equal(agent.agentType, agentType);
      assert.equal(agent.totalTipsSent.toNumber(), 0);
      assert.equal(agent.isActive, true);
    });
  });

  describe("Tipping", () => {
    let creatorKeypair: Keypair;
    let creatorPDA: PublicKey;
    let creatorTokenAccount: PublicKey;
    let tipperTokenAccount: PublicKey;

    before(async () => {
      // Create creator
      creatorKeypair = Keypair.generate();
      const basename = "bob";
      const displayName = "Bob";
      const avatarUrl = "";

      [creatorPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("creator"), Buffer.from(basename)],
        program.programId
      );

      // Airdrop to creator
      await provider.connection.confirmTransaction(
        await provider.connection.requestAirdrop(
          creatorKeypair.publicKey,
          2 * LAMPORTS_PER_SOL
        )
      );

      // Register creator
      await program.methods
        .registerCreator(basename, displayName, avatarUrl)
        .accounts({
          creator: creatorPDA,
          platformConfig: platformConfigPDA,
          authority: creatorKeypair.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([creatorKeypair])
        .rpc();

      // Create token accounts
      const creatorTokenAccountInfo = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        payer.payer,
        tokenMint,
        creatorKeypair.publicKey
      );
      creatorTokenAccount = creatorTokenAccountInfo.address;

      const tipperTokenAccountInfo = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        payer.payer,
        tokenMint,
        payer.publicKey
      );
      tipperTokenAccount = tipperTokenAccountInfo.address;

      // Mint tokens to tipper
      await mintTo(
        provider.connection,
        payer.payer,
        tokenMint,
        tipperTokenAccount,
        payer.publicKey,
        10 * LAMPORTS_PER_SOL
      );
    });

    it("Sends a tip to creator", async () => {
      const amount = new anchor.BN(5_000_000); // 0.005 SOL
      const message = "Great content!";
      const paymentProof = "x402_test_proof_123";

      const tx = await program.methods
        .tipCreator(amount, message, paymentProof)
        .accounts({
          creator: creatorPDA,
          platformConfig: platformConfigPDA,
          tipper: payer.publicKey,
          fromTokenAccount: tipperTokenAccount,
          creatorTokenAccount: creatorTokenAccount,
          platformTokenAccount: platformTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();

      console.log("Tip tx:", tx);

      // Fetch and verify creator update
      const creator = await program.account.creator.fetch(creatorPDA);
      assert.equal(creator.tipCount, 1);
      assert.ok(creator.totalTipsReceived.toNumber() > 0);
    });

    it("Fails when contract is paused", async () => {
      // Pause contract
      await program.methods
        .setPaused(true)
        .accounts({
          platformConfig: platformConfigPDA,
          authority: payer.publicKey,
        })
        .rpc();

      const amount = new anchor.BN(1_000_000);
      const message = "Test";
      const paymentProof = "test";

      try {
        await program.methods
          .tipCreator(amount, message, paymentProof)
          .accounts({
            creator: creatorPDA,
            platformConfig: platformConfigPDA,
            tipper: payer.publicKey,
            fromTokenAccount: tipperTokenAccount,
            creatorTokenAccount: creatorTokenAccount,
            platformTokenAccount: platformTokenAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
          })
          .rpc();

        assert.fail("Should have failed when paused");
      } catch (error) {
        assert.include(error.toString(), "ContractPaused");
      }

      // Unpause
      await program.methods
        .setPaused(false)
        .accounts({
          platformConfig: platformConfigPDA,
          authority: payer.publicKey,
        })
        .rpc();
    });

    it("Fails with amount below minimum", async () => {
      const amount = new anchor.BN(100); // Too small
      const message = "Test";
      const paymentProof = "test";

      try {
        await program.methods
          .tipCreator(amount, message, paymentProof)
          .accounts({
            creator: creatorPDA,
            platformConfig: platformConfigPDA,
            tipper: payer.publicKey,
            fromTokenAccount: tipperTokenAccount,
            creatorTokenAccount: creatorTokenAccount,
            platformTokenAccount: platformTokenAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
          })
          .rpc();

        assert.fail("Should have failed with amount too small");
      } catch (error) {
        assert.include(error.toString(), "AmountTooSmall");
      }
    });
  });

  describe("Admin Functions", () => {
    it("Updates minimum tip amount", async () => {
      const newMin = new anchor.BN(2_000_000);

      await program.methods
        .updateMinTip(newMin)
        .accounts({
          platformConfig: platformConfigPDA,
          authority: payer.publicKey,
        })
        .rpc();

      const config = await program.account.platformConfig.fetch(
        platformConfigPDA
      );
      assert.equal(config.minTipAmount.toNumber(), newMin.toNumber());
    });

    it("Updates platform fee", async () => {
      const newFee = 250; // 2.5%

      await program.methods
        .updatePlatformFee(newFee)
        .accounts({
          platformConfig: platformConfigPDA,
          authority: payer.publicKey,
        })
        .rpc();

      const config = await program.account.platformConfig.fetch(
        platformConfigPDA
      );
      assert.equal(config.platformFee, newFee);
    });

    it("Fails to update fee above maximum", async () => {
      const newFee = 1001; // 10.01% - too high

      try {
        await program.methods
          .updatePlatformFee(newFee)
          .accounts({
            platformConfig: platformConfigPDA,
            authority: payer.publicKey,
          })
          .rpc();

        assert.fail("Should have failed with fee too high");
      } catch (error) {
        assert.include(error.toString(), "FeeTooHigh");
      }
    });
  });
});
