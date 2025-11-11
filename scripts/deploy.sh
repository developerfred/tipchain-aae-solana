#!/bin/bash

# TipChain Agent Economy - Deploy Script

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "🚀 TipChain Agent Economy - Deploy to Devnet"
echo "============================================="
echo ""

# Check balance
BALANCE=$(solana balance | awk '{print $1}')
if (( $(echo "$BALANCE < 1" | bc -l) )); then
    echo -e "${RED}❌ Insufficient balance. Need at least 1 SOL${NC}"
    echo "Run: solana airdrop 2"
    exit 1
fi

echo -e "${GREEN}✅ Balance: $BALANCE SOL${NC}"
echo ""

# Build
echo "🏗️  Building program..."
anchor build

# Deploy
echo ""
echo "📤 Deploying to devnet..."
echo ""

anchor deploy --provider.cluster devnet

# Get program ID
PROGRAM_ID=$(solana address -k target/deploy/tipchain_agent-keypair.json)

echo ""
echo "=================================="
echo -e "${GREEN}✅ Deployment successful!${NC}"
echo "=================================="
echo ""
echo "📝 Program ID: $PROGRAM_ID"
echo ""
echo "⚠️  Update Program ID in:"
echo "   - programs/tipchain-agent/src/lib.rs"
echo "   - sdk/src/index.ts"
echo "   - Anchor.toml"
echo "   - app/.env.local"
echo ""
echo "🔗 View on Solana Explorer:"
echo "   https://explorer.solana.com/address/$PROGRAM_ID?cluster=devnet"
echo ""
