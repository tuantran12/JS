# SENKAI Solana Smart Contracts

This directory contains the Solana smart contracts (programs) for the SENKAI platform.

## Contracts Overview

### 1. SENKAI Token (SPL Token)
- **Purpose**: Platform utility token
- **Symbol**: SKI
- **Decimals**: 9
- **Total Supply**: 1,000,000,000 SKI
- **Features**:
  - Standard SPL token implementation
  - Transfer functionality
  - Staking mechanism
  - Governance rights

### 2. Copy Trading Program
- **Purpose**: Automated trade copying functionality
- **Features**:
  - Trustless trade replication
  - Configurable position sizing
  - Stop-loss and take-profit automation
  - Commission distribution to signal providers

### 3. Subscription Management Program
- **Purpose**: On-chain subscription validation
- **Features**:
  - Subscription tier verification
  - SKI token payment handling
  - Discount calculation for token holders
  - Automatic renewal handling

### 4. Referral Program
- **Purpose**: Decentralized referral tracking
- **Features**:
  - Referral code validation
  - Commission distribution
  - Multi-level rewards (if applicable)

## Development Setup

### Prerequisites
- Rust 1.70+
- Solana CLI 1.16+
- Anchor Framework 0.30+
- Node.js 18+

### Installation

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/v1.16.0/install)"

# Install Anchor
cargo install --git https://github.com/coral-xyz/anchor --tag v0.30.0 anchor-cli

# Install dependencies
npm install
```

### Build Contracts

```bash
# Build all programs
anchor build

# Build specific program
anchor build --program senkai_token
```

### Test Contracts

```bash
# Run all tests
anchor test

# Run specific test
anchor test --file tests/copy_trading.ts
```

### Deploy to Devnet

```bash
# Set Solana config to devnet
solana config set --url https://api.devnet.solana.com

# Airdrop SOL for deployment
solana airdrop 2

# Deploy programs
anchor deploy

# Verify deployment
solana program show <PROGRAM_ID>
```

### Deploy to Mainnet

```bash
# Set Solana config to mainnet-beta
solana config set --url https://api.mainnet-beta.solana.com

# Deploy programs (requires SOL for rent)
anchor deploy --provider.cluster mainnet

# Verify deployment
solana program show <PROGRAM_ID>
```

## Program IDs

### Devnet
- SENKAI Token: `TBD`
- Copy Trading: `TBD`
- Subscription: `TBD`
- Referral: `TBD`

### Mainnet
- SENKAI Token: `TBD`
- Copy Trading: `TBD`
- Subscription: `TBD`
- Referral: `TBD`

## Security

### Audits
- [ ] Internal security review
- [ ] External audit by reputable firm
- [ ] Bug bounty program launch

### Best Practices
- All programs use Anchor framework for security
- Comprehensive input validation
- Access control with PDA (Program Derived Addresses)
- Emergency pause functionality
- Upgrade authority management

## Integration

### JavaScript/TypeScript

```typescript
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import idl from "./target/idl/senkai_token.json";

const connection = new Connection("https://api.mainnet-beta.solana.com");
const programId = new PublicKey("YOUR_PROGRAM_ID");
const program = new Program(idl, programId, provider);

// Call program methods
const tx = await program.methods
  .subscribePro()
  .accounts({
    user: wallet.publicKey,
    // ... other accounts
  })
  .rpc();
```

## License

Proprietary - SENKAI Platform

## Contact

For security vulnerabilities, please email: security@senkai.xyz
