# Platform Architecture & UML Diagrams

This document contains the structural blueprints of the VoltExchange platform, satisfying the requirement for UML, ER, and Architecture diagrams.

## 🏗️ 1. High-Level System Architecture

The platform uses a hybrid on-chain/off-chain model to maximize efficiency.

```mermaid
graph TD
    subgraph Frontend [Next.js Client App]
        UI[User Interface]
        Web3[Ethers.js / Wallet Connect]
        Auth[JWT State]
    end

    subgraph Backend [Node.js Express Server]
        API[REST APIs]
        Middlewares[Auth & Rate Limiting]
        Prisma[Prisma ORM]
    end
    
    subgraph Database [PostgreSQL]
        DB[(Relational Data)]
    end

    subgraph Blockchain [Ethereum/Hardhat Network]
        SC1[EnergyMarketplace.sol]
        SC2[EnergyToken.sol]
        SC3[EnergyCertificate.sol]
    end

    UI <-->|HTTP/REST| API
    API <-->|SQL| Prisma
    Prisma <--> DB
    Web3 <-->|RPC Calls| Blockchain
    UI <-->|Sign Nonce| Web3
    API <-->|Verify Signature| Web3
```

## 🗄️ 2. Entity Relationship (ER) Diagram

This represents the `schema.prisma` database structure.

```mermaid
erDiagram
    USER ||--o{ LISTING : "creates"
    USER ||--o{ TRANSACTION : "buys/sells"
    USER ||--o{ NOTIFICATION : "receives"
    LISTING ||--o{ TRANSACTION : "has"

    USER {
        string id PK
        string walletAddress UK
        string role "PRODUCER/CONSUMER"
        string nonce
    }

    LISTING {
        string id PK
        int blockchainId UK
        string sellerId FK
        string energySource
        float capacity
        float pricePerUnit
        boolean isActive
    }

    TRANSACTION {
        string id PK
        string listingId FK
        string buyerId FK
        string sellerId FK
        float amount
        float totalCost
        string txHash UK
    }
```

## 🔄 3. Purchase Sequence Flow

The flow of a consumer buying energy from a producer.

```mermaid
sequenceDiagram
    participant C as Consumer (Frontend)
    participant B as Backend API
    participant SC as Smart Contract
    participant P as Producer

    P->>SC: listEnergy(amount, price)
    SC-->>P: returns listingId
    P->>B: POST /api/marketplace (saves off-chain data)
    B-->>C: GET /api/marketplace (browsing)
    
    C->>SC: buyEnergy(listingId) [payable]
    SC->>SC: Verify Escrow & Escrow Tokens
    SC->>P: Transfer ETH
    SC->>C: Transfer EnergyTokens
    SC-->>C: returns txHash
    
    C->>B: POST /api/marketplace/purchase (logs txHash)
    B-->>C: Success!
```
