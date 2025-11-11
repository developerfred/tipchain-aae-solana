#!/bin/bash

# TipChain Complete Deployment Script
# Deploys contract to Solana devnet and frontend to Vercel

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "🚀 TipChain Complete Deployment"
echo "================================"
echo ""

# Check if BIP39 passphrase is set
if [ -z "$BIP39_PASSPHRASE" ]; then
    echo -e "${RED}❌ Error: BIP39_PASSPHRASE environment variable not set${NC}"
    echo "Set it with: export BIP39_PASSPHRASE='your twelve word phrase here'"
    exit 1
fi

echo -e "${GREEN}✅ BIP39 passphrase found${NC}"
echo ""

# ============================================================================
# Step 1: Setup Wallet
# ============================================================================
echo "📝 Step 1: Setting up wallet..."
echo ""

WALLET_DIR="$HOME/.config/solana"
WALLET_PATH="$WALLET_DIR/id.json"

mkdir -p "$WALLET_DIR"

# Create wallet from BIP39 passphrase
if [ ! -f "$WALLET_PATH" ]; then
    echo "Creating new wallet from BIP39 passphrase..."
    echo "$BIP39_PASSPHRASE" | solana-keygen recover -o "$WALLET_PATH" --force
else
    echo -e "${YELLOW}⚠️  Wallet already exists at $WALLET_PATH${NC}"
    read -p "Do you want to overwrite it? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "$BIP39_PASSPHRASE" | solana-keygen recover -o "$WALLET_PATH" --force
    fi
fi

WALLET_ADDRESS=$(solana-keygen pubkey "$WALLET_PATH")
echo -e "${GREEN}✅ Wallet address: $WALLET_ADDRESS${NC}"
echo ""

# ============================================================================
# Step 2: Configure Solana CLI
# ============================================================================
echo "⚙️  Step 2: Configuring Solana CLI..."
echo ""

solana config set --url devnet
solana config set --keypair "$WALLET_PATH"

echo -e "${GREEN}✅ Solana configured for devnet${NC}"
echo ""

# ============================================================================
# Step 3: Check/Request Balance
# ============================================================================
echo "💰 Step 3: Checking balance..."
echo ""

BALANCE=$(solana balance | awk '{print $1}')
echo "Current balance: $BALANCE SOL"

if (( $(echo "$BALANCE < 2" | bc -l) )); then
    echo "Balance too low. Requesting airdrop..."

    # Try airdrop multiple times (devnet can be flaky)
    MAX_ATTEMPTS=3
    ATTEMPT=1

    while [ $ATTEMPT -le $MAX_ATTEMPTS ]; do
        echo "Airdrop attempt $ATTEMPT/$MAX_ATTEMPTS..."

        if solana airdrop 2 2>/dev/null; then
            echo -e "${GREEN}✅ Airdrop successful${NC}"
            break
        else
            if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
                echo -e "${RED}❌ Airdrop failed after $MAX_ATTEMPTS attempts${NC}"
                echo "You may need to:"
                echo "  1. Wait a few minutes and try again"
                echo "  2. Use a faucet: https://faucet.solana.com"
                echo "  3. Transfer SOL manually to: $WALLET_ADDRESS"
                exit 1
            fi
            echo "Waiting 5 seconds before retry..."
            sleep 5
        fi

        ATTEMPT=$((ATTEMPT + 1))
    done

    BALANCE=$(solana balance | awk '{print $1}')
    echo "New balance: $BALANCE SOL"
fi

echo ""

# ============================================================================
# Step 4: Build Program
# ============================================================================
echo "🏗️  Step 4: Building Solana program..."
echo ""

anchor build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed${NC}"
    echo "Check BUILD_TROUBLESHOOTING.md for solutions"
    exit 1
fi

echo -e "${GREEN}✅ Build successful${NC}"
echo ""

# ============================================================================
# Step 5: Deploy to Devnet
# ============================================================================
echo "📤 Step 5: Deploying to devnet..."
echo ""

anchor deploy --provider.cluster devnet

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Deploy failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Deploy successful${NC}"
echo ""

# ============================================================================
# Step 6: Update Program ID
# ============================================================================
echo "🔄 Step 6: Updating Program ID in source files..."
echo ""

PROGRAM_ID=$(solana address -k target/deploy/tipchain_agent-keypair.json)
echo "New Program ID: $PROGRAM_ID"

# Update lib.rs
sed -i.bak "s/declare_id!(\"[^\"]*\")/declare_id!(\"$PROGRAM_ID\")/" programs/tipchain-agent/src/lib.rs

# Update Anchor.toml
sed -i.bak "s/tipchain_agent = \"[^\"]*\"/tipchain_agent = \"$PROGRAM_ID\"/" Anchor.toml

# Update SDK
sed -i.bak "s/PROGRAM_ID = new PublicKey('[^']*')/PROGRAM_ID = new PublicKey('$PROGRAM_ID')/" sdk/src/index.ts

# Update .env.example files
sed -i.bak "s/PROGRAM_ID=.*/PROGRAM_ID=$PROGRAM_ID/" .env.example
sed -i.bak "s/NEXT_PUBLIC_PROGRAM_ID=.*/NEXT_PUBLIC_PROGRAM_ID=$PROGRAM_ID/" app/.env.example

# Create actual .env files
echo "PROGRAM_ID=$PROGRAM_ID" > .env
echo "NEXT_PUBLIC_PROGRAM_ID=$PROGRAM_ID" > app/.env.local

echo -e "${GREEN}✅ Program ID updated in all files${NC}"
echo ""

# ============================================================================
# Step 7: Rebuild with correct Program ID
# ============================================================================
echo "🔨 Step 7: Rebuilding with correct Program ID..."
echo ""

anchor build

echo -e "${GREEN}✅ Rebuild successful${NC}"
echo ""

# ============================================================================
# Step 8: Redeploy with correct Program ID
# ============================================================================
echo "📤 Step 8: Redeploying with correct Program ID..."
echo ""

anchor deploy --provider.cluster devnet

echo -e "${GREEN}✅ Final deployment successful${NC}"
echo ""

# ============================================================================
# Step 9: Initialize Platform
# ============================================================================
echo "🎬 Step 9: Initializing platform..."
echo ""

cd scripts
npx ts-node init-platform.ts
cd ..

echo -e "${GREEN}✅ Platform initialized${NC}"
echo ""

# ============================================================================
# Step 10: Setup Vercel
# ============================================================================
echo "☁️  Step 10: Setting up Vercel deployment..."
echo ""

# Check if vercel is installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

cd app

# Create vercel.json
cat > vercel.json <<EOF
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_SOLANA_NETWORK": "devnet",
    "NEXT_PUBLIC_SOLANA_RPC_URL": "https://api.devnet.solana.com",
    "NEXT_PUBLIC_PROGRAM_ID": "$PROGRAM_ID"
  }
}
EOF

echo -e "${GREEN}✅ Vercel configuration created${NC}"
echo ""

# ============================================================================
# Step 11: Deploy to Vercel
# ============================================================================
echo "🚀 Step 11: Deploying to Vercel..."
echo ""

# Deploy to Vercel (this will prompt for login if needed)
vercel --prod --yes

VERCEL_URL=$(vercel ls --json | jq -r '.[0].url' 2>/dev/null || echo "Check Vercel dashboard")

cd ..

# ============================================================================
# Step 12: Update Contract Addresses Documentation
# ============================================================================
echo "📝 Step 12: Updating contract addresses documentation..."
echo ""

chmod +x scripts/update-addresses.sh
./scripts/update-addresses.sh

echo ""
echo "================================"
echo -e "${GREEN}🎉 DEPLOYMENT COMPLETE!${NC}"
echo "================================"
echo ""
echo "📊 Deployment Summary:"
echo "  Solana Network: Devnet"
echo "  Program ID: $PROGRAM_ID"
echo "  Wallet: $WALLET_ADDRESS"
echo "  Balance: $(solana balance)"
echo ""
echo "🔗 Explorer Links:"
echo "  Program: https://explorer.solana.com/address/$PROGRAM_ID?cluster=devnet"
echo "  Wallet: https://explorer.solana.com/address/$WALLET_ADDRESS?cluster=devnet"
echo ""
echo "🌐 Frontend:"
echo "  URL: https://$VERCEL_URL"
echo "  Or check: https://vercel.com/dashboard"
echo ""
echo "📝 Next Steps:"
echo "  1. Visit the frontend URL"
echo "  2. Connect your Phantom wallet (set to devnet)"
echo "  3. Register as a creator or agent"
echo "  4. Start tipping!"
echo ""
echo "💡 Tips:"
echo "  - Save your Program ID: $PROGRAM_ID"
echo "  - Keep your wallet backed up"
echo "  - Monitor transactions on Solana Explorer"
echo "  - All addresses saved in: CONTRACT_ADDRESSES.md"
echo ""
