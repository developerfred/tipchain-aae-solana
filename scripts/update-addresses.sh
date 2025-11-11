#!/bin/bash

# Update CONTRACT_ADDRESSES.md with deployed contract information

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "📝 Updating CONTRACT_ADDRESSES.md"
echo "================================="
echo ""

# Check if contract is deployed
if [ ! -f "target/deploy/tipchain_agent-keypair.json" ]; then
    echo -e "${RED}❌ Contract not deployed yet${NC}"
    echo "Run: ./scripts/deploy-complete.sh"
    exit 1
fi

# Get Program ID
PROGRAM_ID=$(solana address -k target/deploy/tipchain_agent-keypair.json)
echo -e "${GREEN}✅ Program ID: $PROGRAM_ID${NC}"

# Get Deployer Wallet
DEPLOYER=$(solana address)
echo -e "${GREEN}✅ Deployer: $DEPLOYER${NC}"

# Get current timestamp
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S UTC')
DATE=$(date '+%Y-%m-%d')

# Derive Platform Config PDA
# Using TypeScript to calculate PDA
PLATFORM_CONFIG_PDA=$(node -e "
const { PublicKey } = require('@solana/web3.js');
const programId = new PublicKey('$PROGRAM_ID');
const [pda] = PublicKey.findProgramAddressSync(
  [Buffer.from('platform_config')],
  programId
);
console.log(pda.toBase58());
")

echo -e "${GREEN}✅ Platform Config PDA: $PLATFORM_CONFIG_PDA${NC}"

# Get Frontend URL from Vercel (if deployed)
FRONTEND_URL=$(vercel ls --json 2>/dev/null | jq -r '.[0].url' 2>/dev/null || echo "_PENDING_VERCEL_DEPLOYMENT_")
if [ "$FRONTEND_URL" != "_PENDING_VERCEL_DEPLOYMENT_" ]; then
    FRONTEND_URL="https://$FRONTEND_URL"
    echo -e "${GREEN}✅ Frontend URL: $FRONTEND_URL${NC}"
fi

# Get network
NETWORK=$(solana config get | grep "RPC URL" | awk '{print $3}')
if [[ "$NETWORK" == *"devnet"* ]]; then
    NETWORK="devnet"
    CLUSTER="?cluster=devnet"
elif [[ "$NETWORK" == *"mainnet"* ]]; then
    NETWORK="mainnet-beta"
    CLUSTER=""
else
    NETWORK="unknown"
    CLUSTER=""
fi

echo ""
echo "📝 Updating CONTRACT_ADDRESSES.md..."

# Create backup
cp CONTRACT_ADDRESSES.md CONTRACT_ADDRESSES.md.bak

# Update file
if [ "$NETWORK" == "devnet" ]; then
    # Update Devnet section
    sed -i.tmp "s|^\| \*\*Program ID\*\* \| \`[^|]*\` \| \[View on Explorer\]([^)]*) \||| **Program ID** | \`$PROGRAM_ID\` | [View on Explorer](https://explorer.solana.com/address/$PROGRAM_ID?cluster=devnet) ||" CONTRACT_ADDRESSES.md

    sed -i.tmp "s|^\| \*\*Deployer Wallet\*\* \| \`_PENDING_DEPLOYMENT_\` \| \[View on Explorer\](#) \||| **Deployer Wallet** | \`$DEPLOYER\` | [View on Explorer](https://explorer.solana.com/address/$DEPLOYER?cluster=devnet) ||" CONTRACT_ADDRESSES.md

    sed -i.tmp "s|^\| \*\*Platform Config PDA\*\* \| \`_PENDING_DEPLOYMENT_\` \| \[View on Explorer\](#) \||| **Platform Config PDA** | \`$PLATFORM_CONFIG_PDA\` | [View on Explorer](https://explorer.solana.com/address/$PLATFORM_CONFIG_PDA?cluster=devnet) ||" CONTRACT_ADDRESSES.md

    sed -i.tmp "s|^\| \*\*Status\*\* \| 🟡 Not Deployed Yet \| - \||| **Status** | 🟢 Deployed | ✅ ||" CONTRACT_ADDRESSES.md

    sed -i.tmp "s|^\| \*\*Deployed At\*\* \| - \| - \||| **Deployed At** | $TIMESTAMP | ✅ ||" CONTRACT_ADDRESSES.md

    sed -i.tmp "s|^\| \*\*Last Updated\*\* \| - \| - \||| **Last Updated** | $TIMESTAMP | ✅ ||" CONTRACT_ADDRESSES.md

    sed -i.tmp "s|\*\*Frontend URL (Vercel):\*\* \`_PENDING_DEPLOYMENT_\`|**Frontend URL (Vercel):** \`$FRONTEND_URL\`|" CONTRACT_ADDRESSES.md

    # Update Platform Config
    sed -i.tmp "s|\"authority\": \"_PENDING_DEPLOYMENT_\"|\"authority\": \"$DEPLOYER\"|" CONTRACT_ADDRESSES.md

    # Update PDA addresses
    sed -i.tmp "s|\*\*Address (Devnet):\*\* \`_PENDING_DEPLOYMENT_\`|**Address (Devnet):** \`$PLATFORM_CONFIG_PDA\`|" CONTRACT_ADDRESSES.md

    # Update deployment history
    sed -i.tmp "s|^| _Pending_ | \`Fg6PaFp...\` | - | - | Initial deployment ||" CONTRACT_ADDRESSES.md

    # Update last updated timestamp at bottom
    sed -i.tmp "s|\*\*Last Updated:\*\* Never (Pending Deployment)|**Last Updated:** $TIMESTAMP|" CONTRACT_ADDRESSES.md

    sed -i.tmp "s|\*\*Network Status:\*\* ✅ Devnet Ready | ⏳ Mainnet Pending|**Network Status:** ✅ Devnet Deployed | ⏳ Mainnet Pending|" CONTRACT_ADDRESSES.md
fi

# Clean up temp files
rm -f CONTRACT_ADDRESSES.md.tmp CONTRACT_ADDRESSES.md.bak

echo -e "${GREEN}✅ CONTRACT_ADDRESSES.md updated${NC}"
echo ""

# Show summary
cat << EOF
📊 Deployment Summary:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Network: $NETWORK
Program ID: $PROGRAM_ID
Deployer: $DEPLOYER
Platform Config PDA: $PLATFORM_CONFIG_PDA
Frontend: $FRONTEND_URL
Updated: $TIMESTAMP

🔗 Quick Links:
• Explorer: https://explorer.solana.com/address/$PROGRAM_ID$CLUSTER
• Frontend: $FRONTEND_URL
• Docs: CONTRACT_ADDRESSES.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EOF

echo ""
echo "✅ Done! Review CONTRACT_ADDRESSES.md for all details."
