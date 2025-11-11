#!/bin/bash

# TipChain Agent Economy - Setup Script
# This script sets up the entire development environment

set -e

echo "🚀 TipChain Agent Economy - Setup"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if commands exist
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "📋 Checking prerequisites..."
echo ""

if ! command_exists node; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js 18+${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js found:${NC} $(node --version)"

if ! command_exists npm; then
    echo -e "${RED}❌ npm not found. Please install npm${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm found:${NC} $(npm --version)"

if ! command_exists cargo; then
    echo -e "${RED}❌ Rust not found. Please install Rust 1.70+${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Rust found:${NC} $(cargo --version)"

if ! command_exists solana; then
    echo -e "${RED}❌ Solana CLI not found. Please install Solana CLI${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Solana CLI found:${NC} $(solana --version)"

if ! command_exists anchor; then
    echo -e "${YELLOW}⚠️  Anchor not found. Installing...${NC}"
    cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
    avm install latest
    avm use latest
fi
echo -e "${GREEN}✅ Anchor found:${NC} $(anchor --version)"

echo ""
echo "📦 Installing dependencies..."
echo ""

# Install root dependencies
echo "Installing root dependencies..."
npm install

# Install SDK dependencies
echo "Installing SDK dependencies..."
cd sdk && npm install && cd ..

# Install app dependencies
echo "Installing app dependencies..."
cd app && npm install && cd ..

echo ""
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Configure Solana
echo "⚙️  Configuring Solana..."
echo ""

# Check if config exists
if [ ! -f ~/.config/solana/id.json ]; then
    echo "No wallet found. Creating new wallet..."
    solana-keygen new --no-bip39-passphrase
else
    echo -e "${GREEN}✅ Wallet already exists${NC}"
fi

# Set to devnet
solana config set --url devnet
echo -e "${GREEN}✅ Solana configured for devnet${NC}"

# Get wallet address
WALLET=$(solana address)
echo ""
echo "📝 Your wallet address: $WALLET"
echo ""

# Check balance
BALANCE=$(solana balance)
echo "💰 Current balance: $BALANCE"

# Airdrop if needed
if [[ "$BALANCE" == "0 SOL" ]]; then
    echo "Requesting airdrop..."
    solana airdrop 2
    echo -e "${GREEN}✅ Airdropped 2 SOL${NC}"
fi

echo ""
echo "🏗️  Building smart contract..."
echo ""

# Build Anchor program
anchor build

echo ""
echo -e "${GREEN}✅ Smart contract built${NC}"
echo ""

# Get program ID
PROGRAM_ID=$(solana address -k target/deploy/tipchain_agent-keypair.json)
echo "📝 Program ID: $PROGRAM_ID"
echo ""

echo "⚠️  IMPORTANT: Update the Program ID in the following files:"
echo "   1. programs/tipchain-agent/src/lib.rs (declare_id!)"
echo "   2. sdk/src/index.ts (PROGRAM_ID)"
echo "   3. Anchor.toml ([programs.devnet])"
echo ""

# Create env files
echo "📄 Creating environment files..."
echo ""

cat > app/.env.local <<EOF
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_PROGRAM_ID=$PROGRAM_ID
EOF

echo -e "${GREEN}✅ Environment files created${NC}"
echo ""

echo "=================================="
echo -e "${GREEN}✅ Setup complete!${NC}"
echo "=================================="
echo ""
echo "Next steps:"
echo "  1. Update Program ID in source files (see above)"
echo "  2. Deploy: npm run deploy:devnet"
echo "  3. Initialize: npm run init-platform"
echo "  4. Start app: npm run app:dev"
echo ""
echo "📚 See README.md for more information"
echo ""
