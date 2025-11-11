# 📝 TipChain Contract Addresses

This file contains all deployed contract addresses and important links for the TipChain Agent Economy project.

---

## 🌐 Networks

### Solana Devnet (Development)

| Item | Address | Explorer Link |
|------|---------|---------------|
| **Program ID** | `Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS` | [View on Explorer](https://explorer.solana.com/address/Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS?cluster=devnet) |
| **Deployer Wallet** | `_PENDING_DEPLOYMENT_` | [View on Explorer](#) |
| **Platform Config PDA** | `_PENDING_DEPLOYMENT_` | [View on Explorer](#) |
| **Status** | 🟡 Not Deployed Yet | - |
| **Deployed At** | - | - |
| **Last Updated** | - | - |

**Frontend URL (Vercel):** `_PENDING_DEPLOYMENT_`

---

### Solana Mainnet-Beta (Production)

| Item | Address | Explorer Link |
|------|---------|---------------|
| **Program ID** | `_NOT_DEPLOYED_` | - |
| **Deployer Wallet** | `_NOT_DEPLOYED_` | - |
| **Platform Config PDA** | `_NOT_DEPLOYED_` | - |
| **Status** | ⚪ Not Deployed | - |
| **Deployed At** | - | - |
| **Last Updated** | - | - |

**Frontend URL:** `_NOT_DEPLOYED_`

---

## 📊 Platform Configuration

### Devnet

```json
{
  "authority": "_PENDING_DEPLOYMENT_",
  "platformFee": 200,
  "feeDenominator": 10000,
  "minTipAmount": 1000000,
  "paused": false,
  "totalCreators": 0,
  "totalTips": 0,
  "totalVolume": 0
}
```

### Mainnet

```json
{
  "authority": "_NOT_DEPLOYED_",
  "platformFee": 200,
  "feeDenominator": 10000,
  "minTipAmount": 1000000,
  "paused": false,
  "totalCreators": 0,
  "totalTips": 0,
  "totalVolume": 0
}
```

---

## 🔑 Important PDAs

### Platform Config PDA

**Seeds:** `["platform_config"]`

**Derivation:**
```typescript
const [platformConfigPDA] = PublicKey.findProgramAddressSync(
  [Buffer.from('platform_config')],
  programId
);
```

**Address (Devnet):** `_PENDING_DEPLOYMENT_`

**Address (Mainnet):** `_NOT_DEPLOYED_`

---

### Creator PDA

**Seeds:** `["creator", basename]`

**Derivation:**
```typescript
const [creatorPDA] = PublicKey.findProgramAddressSync(
  [Buffer.from('creator'), Buffer.from(basename)],
  programId
);
```

**Example (alice):** `_PENDING_DEPLOYMENT_`

---

### Agent PDA

**Seeds:** `["agent", authority]`

**Derivation:**
```typescript
const [agentPDA] = PublicKey.findProgramAddressSync(
  [Buffer.from('agent'), authority.toBuffer()],
  programId
);
```

**Example:** `_PENDING_DEPLOYMENT_`

---

## 🚀 Deployment History

### Devnet Deployments

| Date | Program ID | Deployer | Transaction | Notes |
|------|------------|----------|-------------|-------|
| _Pending_ | `Fg6PaFp...` | - | - | Initial deployment |

---

### Mainnet Deployments

| Date | Program ID | Deployer | Transaction | Notes |
|------|------------|----------|-------------|-------|
| - | - | - | - | Not deployed yet |

---

## 🔗 Quick Links

### Devnet

- **Program Explorer:** [View Program](https://explorer.solana.com/address/Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS?cluster=devnet)
- **Frontend:** `_PENDING_DEPLOYMENT_`
- **Solana FM:** [View on Solana FM](https://solana.fm/address/Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS?cluster=devnet-solana)
- **Solscan:** [View on Solscan](https://solscan.io/account/Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS?cluster=devnet)

### Mainnet

- **Program Explorer:** -
- **Frontend:** -
- **Solana FM:** -
- **Solscan:** -

---

## 📦 Verified Builds

### Devnet

**Build Hash:** `_PENDING_DEPLOYMENT_`

**Verification Command:**
```bash
solana program dump Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS dump.so
sha256sum dump.so
```

**Expected Hash:** `_PENDING_DEPLOYMENT_`

---

### Mainnet

**Build Hash:** `_NOT_DEPLOYED_`

**Verification Command:**
```bash
# Will be available after mainnet deployment
```

---

## 🔐 Security

### Upgrade Authority

**Devnet:** `_PENDING_DEPLOYMENT_`

**Mainnet:** `_NOT_DEPLOYED_`

### Multisig (if applicable)

**Not configured yet**

---

## 📝 Integration Examples

### SDK Usage (Devnet)

```typescript
import { Connection, PublicKey } from '@solana/web3.js';
import TipChainSDK from '@tipchain/sdk';

// Initialize SDK
const connection = new Connection('https://api.devnet.solana.com');
const programId = new PublicKey('Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS');
const sdk = new TipChainSDK(connection, programId);

// Get platform stats
const stats = await sdk.getPlatformStats();
console.log(stats);
```

### Frontend Integration

```typescript
// Next.js Environment Variables
NEXT_PUBLIC_PROGRAM_ID=Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
```

---

## 🛠️ How to Update This File

### After Deployment

1. Run deployment script:
   ```bash
   ./scripts/deploy-complete.sh
   ```

2. The script will output:
   - Program ID
   - Deployer wallet address
   - Transaction signature
   - Frontend URL

3. Update this file manually or run:
   ```bash
   ./scripts/update-addresses.sh
   ```

### Manual Update

Replace `_PENDING_DEPLOYMENT_` placeholders with actual values:

1. **Program ID**: From `solana address -k target/deploy/tipchain_agent-keypair.json`
2. **Deployer Wallet**: From `solana address`
3. **Platform Config PDA**: Derive using SDK or script
4. **Frontend URL**: From Vercel deployment output
5. **Transaction**: From deployment logs

---

## 📊 Network Information

### Devnet

- **RPC Endpoint:** `https://api.devnet.solana.com`
- **WebSocket:** `wss://api.devnet.solana.com`
- **Explorer:** `https://explorer.solana.com/?cluster=devnet`
- **Faucet:** `https://faucet.solana.com`

### Mainnet-Beta

- **RPC Endpoint:** `https://api.mainnet-beta.solana.com`
- **WebSocket:** `wss://api.mainnet-beta.solana.com`
- **Explorer:** `https://explorer.solana.com`
- **Docs:** `https://docs.solana.com`

---

## 📈 Statistics (Auto-updated)

### Devnet

Last checked: `_NEVER_`

```
Total Creators: 0
Total Tips: 0
Total Volume: 0 SOL
Top Tipper: None
Active Agents: 0
```

### Mainnet

```
Not deployed yet
```

---

## 🔄 Update Log

| Date | Network | Change | Updated By |
|------|---------|--------|------------|
| 2025-01-XX | Devnet | Initial deployment | Script |
| - | - | - | - |

---

## 📞 Support

For questions about contract addresses or deployment:

- **GitHub Issues:** [Create Issue](https://github.com/developerfred/solana-x402/issues)
- **Documentation:** [README.md](./README.md)
- **Deployment Guide:** [DEPLOYMENT.md](./DEPLOYMENT.md)

---

**Last Updated:** Never (Pending Deployment)
**Network Status:** ✅ Devnet Ready | ⏳ Mainnet Pending
**Version:** 1.0.0
**Anchor Version:** 0.32.1
**Solana Version:** 1.18.17
