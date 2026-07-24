# ⚡ VoltExchange: Peer-to-Peer Energy Trading Platform

VoltExchange is an enterprise-grade, decentralized platform enabling direct peer-to-peer energy trading between producers (solar/wind farms) and consumers, completely eliminating the need for centralized intermediaries.

## 🌟 Key Features
- **Blockchain Integration**: Smart contracts written in Solidity handle escrow, settlement, and absolute proof of ownership without a central authority.
- **Green Certificates (NFT)**: Energy generation sources are tokenized via ERC721.
- **Secure Architecture**: Express.js REST API with wallet-based cryptographic authentication.
- **Beautiful UI/UX**: Next.js 14 frontend utilizing ShadCN UI, TailwindCSS, and glassmorphism.

## 🛠️ Technology Stack
- **Frontend**: Next.js, React, TailwindCSS, ShadCN UI, Framer Motion, Ethers.js
- **Backend**: Node.js, Express, TypeScript, Prisma ORM, PostgreSQL/SQLite
- **Blockchain**: Solidity, Hardhat, OpenZeppelin

## 🚀 Getting Started

### 1. Smart Contracts
```bash
cd contracts
npm install
npx hardhat compile
```

### 2. Backend Engine
```bash
cd backend
npm install
npx prisma db push
npm run dev
```

### 3. Frontend Application
```bash
cd frontend
npm install
npm run dev
```

## 🔒 Security
This platform implements strict Role-Based Access Control (RBAC), Reentrancy protection on smart contracts, Helmet for HTTP header security, and Ethers.js for secure cryptographic nonce signing.
