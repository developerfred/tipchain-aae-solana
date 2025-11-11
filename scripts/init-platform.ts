/**
 * Initialize TipChain Platform
 *
 * This script initializes the platform with default configuration
 */

import { Connection, Keypair } from '@solana/web3.js';
import TipChainSDK from '../sdk/src';
import * as fs from 'fs';

async function main() {
  console.log('🚀 Initializing TipChain Platform...\n');

  // Connect to devnet
  const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
  console.log('✅ Connected to Solana devnet\n');

  // Load wallet
  const walletPath = process.env.WALLET_PATH || `${process.env.HOME}/.config/solana/id.json`;
  const walletData = JSON.parse(fs.readFileSync(walletPath, 'utf-8'));
  const wallet = Keypair.fromSecretKey(new Uint8Array(walletData));

  console.log(`📝 Using wallet: ${wallet.publicKey.toBase58()}`);

  // Check balance
  const balance = await connection.getBalance(wallet.publicKey);
  console.log(`💰 Balance: ${balance / 1e9} SOL\n`);

  if (balance < 0.1 * 1e9) {
    console.error('❌ Insufficient balance. Need at least 0.1 SOL');
    console.log('Run: solana airdrop 2');
    process.exit(1);
  }

  // Initialize SDK
  const sdk = new TipChainSDK(connection);

  try {
    console.log('📤 Initializing platform...');

    // Platform configuration
    const platformFee = 200; // 2% (200/10000)
    const minTipAmount = 1_000_000; // 0.001 SOL

    // Initialize (this will fail if already initialized - that's okay)
    try {
      await sdk.initialize(wallet, platformFee, minTipAmount);
      console.log('✅ Platform initialized successfully!\n');
    } catch (error: any) {
      if (error.message.includes('already in use')) {
        console.log('ℹ️  Platform already initialized\n');
      } else {
        throw error;
      }
    }

    // Get platform config
    const config = await sdk.getPlatformConfig();

    if (config) {
      console.log('📊 Platform Configuration:');
      console.log(`   Owner: ${config.authority.toBase58()}`);
      console.log(`   Platform Fee: ${config.platformFee / 100}%`);
      console.log(`   Min Tip: ${config.minTipAmount.toNumber() / 1e9} SOL`);
      console.log(`   Paused: ${config.paused}`);
      console.log(`   Total Creators: ${config.totalCreators.toNumber()}`);
      console.log(`   Total Tips: ${config.totalTips.toNumber()}`);
      console.log(`   Total Volume: ${config.totalVolume.toNumber() / 1e9} SOL\n`);
    }

    // Create demo creators (optional)
    const createDemoCreators = process.argv.includes('--demo');

    if (createDemoCreators) {
      console.log('🎨 Creating demo creators...\n');

      const demoCreators = [
        { basename: 'alice', displayName: 'Alice Smith', avatarUrl: 'https://i.pravatar.cc/150?u=alice' },
        { basename: 'bob', displayName: 'Bob Johnson', avatarUrl: 'https://i.pravatar.cc/150?u=bob' },
        { basename: 'carol', displayName: 'Carol Williams', avatarUrl: 'https://i.pravatar.cc/150?u=carol' },
      ];

      for (const creator of demoCreators) {
        try {
          await sdk.registerCreator(wallet, creator.basename, creator.displayName, creator.avatarUrl);
          console.log(`✅ Registered: @${creator.basename}`);
        } catch (error: any) {
          if (error.message.includes('already in use')) {
            console.log(`ℹ️  @${creator.basename} already registered`);
          } else {
            console.error(`❌ Failed to register @${creator.basename}:`, error.message);
          }
        }
      }
      console.log('');
    }

    console.log('================================');
    console.log('✅ Platform ready!');
    console.log('================================\n');

    console.log('Next steps:');
    console.log('  1. Start frontend: npm run app:dev');
    console.log('  2. Visit: http://localhost:3000');
    console.log('  3. Connect wallet and register');
    console.log('');

  } catch (error) {
    console.error('❌ Error initializing platform:', error);
    process.exit(1);
  }
}

main().catch(console.error);
