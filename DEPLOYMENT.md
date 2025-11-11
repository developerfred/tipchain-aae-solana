# 🚀 TipChain Deployment Guide

Complete guide for deploying TipChain to Solana Devnet and Vercel.

---

## Prerequisites

Before deploying, make sure you have:

- ✅ Node.js 18+ installed
- ✅ Rust and Cargo installed
- ✅ Solana CLI 1.18+ installed
- ✅ Anchor CLI 0.32.1 installed
- ✅ Your BIP39 seed phrase (12 or 24 words)
- ✅ Vercel account (free at [vercel.com](https://vercel.com))

---

## Quick Deploy (One Command)

### 1. Set your BIP39 passphrase

```bash
export BIP39_PASSPHRASE="your twelve or twenty four word seed phrase here"
```

**⚠️ IMPORTANT**: Keep this secure! Never commit it to git.

### 2. Run the deployment script

```bash
chmod +x scripts/deploy-complete.sh
./scripts/deploy-complete.sh
```

This single script will:
1. ✅ Setup wallet from BIP39 passphrase
2. ✅ Configure Solana CLI for devnet
3. ✅ Request airdrop if needed
4. ✅ Build the Solana program
5. ✅ Deploy to devnet
6. ✅ Update Program ID in all files
7. ✅ Rebuild with correct Program ID
8. ✅ Initialize platform
9. ✅ Deploy frontend to Vercel

**That's it!** ☕ Grab a coffee, it takes ~5 minutes.

---

## Step-by-Step Deployment

If you prefer manual control, follow these steps:

### Step 1: Setup Wallet

```bash
# Set your BIP39 passphrase
export BIP39_PASSPHRASE="your seed phrase here"

# Create wallet directory
mkdir -p ~/.config/solana

# Recover wallet from seed phrase
echo "$BIP39_PASSPHRASE" | solana-keygen recover -o ~/.config/solana/id.json

# Verify wallet
solana-keygen pubkey ~/.config/solana/id.json
```

### Step 2: Configure Solana

```bash
# Set to devnet
solana config set --url devnet

# Set wallet
solana config set --keypair ~/.config/solana/id.json

# Check balance
solana balance

# Request airdrop if needed (max 2 SOL per request)
solana airdrop 2
```

### Step 3: Build & Deploy Contract

```bash
# Build program
anchor build

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Get Program ID
solana address -k target/deploy/tipchain_agent-keypair.json
```

### Step 4: Update Program ID

After deployment, update the Program ID in these files:

1. **programs/tipchain-agent/src/lib.rs**
   ```rust
   declare_id!("YourNewProgramIDHere");
   ```

2. **Anchor.toml**
   ```toml
   [programs.devnet]
   tipchain_agent = "YourNewProgramIDHere"
   ```

3. **sdk/src/index.ts**
   ```typescript
   export const PROGRAM_ID = new PublicKey('YourNewProgramIDHere');
   ```

4. **app/.env.local** (create if doesn't exist)
   ```bash
   NEXT_PUBLIC_PROGRAM_ID=YourNewProgramIDHere
   NEXT_PUBLIC_SOLANA_NETWORK=devnet
   NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
   ```

### Step 5: Rebuild & Redeploy

```bash
# Rebuild with correct Program ID
anchor build

# Deploy again
anchor deploy --provider.cluster devnet
```

### Step 6: Initialize Platform

```bash
# Run initialization script
npx ts-node scripts/init-platform.ts

# This creates:
# - Platform configuration
# - Default settings (2% fee, min tip amount)
# - Optionally demo creators
```

### Step 7: Deploy Frontend to Vercel

```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Login to Vercel
vercel login

# Navigate to app directory
cd app

# Deploy to production
vercel --prod

# The CLI will guide you through:
# - Linking to Vercel account
# - Creating new project
# - Setting environment variables
```

---

## Environment Variables

### For Solana Deploy

```bash
# Required
export BIP39_PASSPHRASE="your seed phrase"

# Optional (defaults shown)
export SOLANA_NETWORK="devnet"
export SOLANA_RPC_URL="https://api.devnet.solana.com"
```

### For Vercel Deploy

Set these in Vercel dashboard or CLI:

```bash
NEXT_PUBLIC_PROGRAM_ID=<your-program-id>
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
```

**To set via CLI:**

```bash
cd app
vercel env add NEXT_PUBLIC_PROGRAM_ID
# Paste your Program ID

vercel env add NEXT_PUBLIC_SOLANA_NETWORK
# Enter: devnet

vercel env add NEXT_PUBLIC_SOLANA_RPC_URL
# Enter: https://api.devnet.solana.com
```

---

## Troubleshooting

### Build Errors

If `anchor build` fails, see **BUILD_TROUBLESHOOTING.md**.

Common issues:
- `cargo-build-sbf not found` → Add Solana to PATH
- Version mismatch → Already fixed in Anchor.toml

### Airdrop Fails

Devnet airdrops can be rate-limited. Solutions:

1. **Wait and retry** (usually works after 5-10 minutes)

2. **Use web faucet**:
   ```bash
   # Get your wallet address
   solana address

   # Visit https://faucet.solana.com
   # Paste address and request SOL
   ```

3. **Use multiple faucets**:
   - https://solfaucet.com
   - https://faucet.quicknode.com/solana/devnet

### Vercel Deploy Fails

If Vercel deployment fails:

1. **Check build locally**:
   ```bash
   cd app
   npm run build
   ```

2. **Check environment variables** are set in Vercel dashboard

3. **Redeploy**:
   ```bash
   vercel --prod --force
   ```

4. **Check logs**:
   ```bash
   vercel logs
   ```

### Program Not Showing on Explorer

Wait 1-2 minutes for Solana Explorer to index. Then check:

```
https://explorer.solana.com/address/YOUR_PROGRAM_ID?cluster=devnet
```

---

## Verification

After successful deployment, verify everything works:

### 1. Check Contract on Solana Explorer

```bash
# Get your Program ID
PROGRAM_ID=$(solana address -k target/deploy/tipchain_agent-keypair.json)

# Open in browser
echo "https://explorer.solana.com/address/$PROGRAM_ID?cluster=devnet"
```

### 2. Check Frontend

Visit your Vercel URL and:
- ✅ Website loads
- ✅ Can connect Phantom wallet (set to devnet)
- ✅ Can see platform stats
- ✅ Can register as creator/agent
- ✅ Can send tips

### 3. Test Transaction

```bash
# Check recent transactions on your wallet
solana transaction-history $(solana address)
```

---

## Cost Breakdown

### Solana Devnet (FREE)
- ✅ Program deployment: FREE (devnet)
- ✅ Transactions: FREE (devnet)
- ✅ SOL via airdrop: FREE

### Vercel (FREE Tier)
- ✅ Hosting: FREE
- ✅ Custom domain: FREE
- ✅ SSL: FREE
- ✅ Bandwidth: 100GB/month FREE
- ✅ Builds: Unlimited FREE

**Total Cost: $0** 🎉

---

## Updating After Changes

### Update Contract

```bash
# Make changes to programs/tipchain-agent/src/lib.rs

# Rebuild
anchor build

# Upgrade (keeps same Program ID)
anchor upgrade target/deploy/tipchain_agent.so --program-id YOUR_PROGRAM_ID

# Or full redeploy (new Program ID)
anchor deploy --provider.cluster devnet
```

### Update Frontend

```bash
# Make changes to app/

# Test locally
cd app && npm run dev

# Deploy to Vercel
vercel --prod

# Or use git integration (automatic deploys on push)
```

---

## Production Deployment (Mainnet)

**⚠️ Only after thorough testing on devnet!**

### 1. Change Network

```bash
solana config set --url mainnet-beta
```

### 2. Fund Wallet

You'll need real SOL for mainnet deployment (~5-10 SOL).

### 3. Deploy

```bash
anchor deploy --provider.cluster mainnet
```

### 4. Update Frontend

```bash
cd app

# Update .env.local
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_PROGRAM_ID=<your-mainnet-program-id>

# Deploy to Vercel
vercel --prod
```

---

## Security Best Practices

### 🔐 Wallet Security

- ✅ **NEVER** commit your seed phrase to git
- ✅ **NEVER** share your private key
- ✅ Use `.gitignore` for wallet files
- ✅ Use environment variables for sensitive data
- ✅ Backup your seed phrase securely offline

### 🔒 Program Security

- ✅ Test thoroughly on devnet first
- ✅ Audit smart contract code
- ✅ Use proper access controls
- ✅ Implement pause functionality
- ✅ Monitor transactions

### 🛡️ Frontend Security

- ✅ Use environment variables for config
- ✅ Validate all user inputs
- ✅ Use HTTPS only
- ✅ Implement rate limiting
- ✅ Add CORS headers

---

## Monitoring & Maintenance

### Check Program Status

```bash
# Get program account info
solana program show YOUR_PROGRAM_ID

# Check if upgradeable
solana program show YOUR_PROGRAM_ID | grep "Upgradeable"
```

### Monitor Transactions

```bash
# Watch recent transactions
solana transaction-history $(solana address) --limit 10

# Or use Solana Explorer
# https://explorer.solana.com
```

### Vercel Analytics

Enable analytics in Vercel dashboard to track:
- Page views
- Unique visitors
- Performance metrics
- Error rates

---

## CI/CD Setup (Optional)

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./app
```

---

## Support

If you encounter issues:

1. **Check documentation**:
   - BUILD_TROUBLESHOOTING.md
   - README.md
   - This file

2. **Community**:
   - GitHub Issues
   - Discord (if available)

3. **Logs**:
   ```bash
   # Solana logs
   solana logs

   # Vercel logs
   vercel logs
   ```

---

## Quick Reference

### Useful Commands

```bash
# Check config
solana config get

# Check balance
solana balance

# Get Program ID
solana address -k target/deploy/tipchain_agent-keypair.json

# Get wallet address
solana address

# View recent transactions
solana transaction-history $(solana address)

# Deploy to Vercel
cd app && vercel --prod

# Check Vercel deployments
vercel ls

# View Vercel logs
vercel logs
```

### Important URLs

- Devnet Explorer: https://explorer.solana.com/?cluster=devnet
- Solana Faucet: https://faucet.solana.com
- Vercel Dashboard: https://vercel.com/dashboard
- Anchor Docs: https://www.anchor-lang.com

---

**Happy Deploying! 🚀**
