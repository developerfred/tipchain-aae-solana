#!/bin/bash

# Deploy TipChain Frontend to Vercel
# Use this if contract is already deployed

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "☁️  TipChain Vercel Deployment"
echo "============================="
echo ""

# Check if Program ID is set
if [ -z "$PROGRAM_ID" ]; then
    echo -e "${YELLOW}⚠️  PROGRAM_ID not set${NC}"

    # Try to get from deployed contract
    if [ -f "target/deploy/tipchain_agent-keypair.json" ]; then
        PROGRAM_ID=$(solana address -k target/deploy/tipchain_agent-keypair.json)
        echo "Found Program ID from deployed contract: $PROGRAM_ID"
    else
        echo -e "${RED}❌ Error: Cannot find Program ID${NC}"
        echo "Please set it manually:"
        echo "  export PROGRAM_ID='your-program-id-here'"
        exit 1
    fi
fi

echo -e "${GREEN}✅ Program ID: $PROGRAM_ID${NC}"
echo ""

# Check if vercel is installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

cd app

# Create .env.local with Program ID
cat > .env.local <<EOF
NEXT_PUBLIC_PROGRAM_ID=$PROGRAM_ID
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
EOF

echo -e "${GREEN}✅ Environment variables configured${NC}"
echo ""

# Test build locally first
echo "🔨 Testing build locally..."
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Local build failed${NC}"
    echo "Fix build errors before deploying"
    exit 1
fi

echo -e "${GREEN}✅ Local build successful${NC}"
echo ""

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
echo ""

vercel --prod --yes \
  --env NEXT_PUBLIC_PROGRAM_ID="$PROGRAM_ID" \
  --env NEXT_PUBLIC_SOLANA_NETWORK="devnet" \
  --env NEXT_PUBLIC_SOLANA_RPC_URL="https://api.devnet.solana.com"

VERCEL_URL=$(vercel ls --json | jq -r '.[0].url' 2>/dev/null || echo "Check Vercel dashboard")

cd ..

echo ""
echo "================================"
echo -e "${GREEN}🎉 DEPLOYMENT COMPLETE!${NC}"
echo "================================"
echo ""
echo "🌐 Frontend URL: https://$VERCEL_URL"
echo ""
echo "📝 Next Steps:"
echo "  1. Visit: https://$VERCEL_URL"
echo "  2. Connect Phantom wallet (set to devnet)"
echo "  3. Start using TipChain!"
echo ""
