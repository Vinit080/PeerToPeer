import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import prisma from './prisma';

import authRoutes from './routes/auth';
import marketplaceRoutes from './routes/marketplace';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

// Security & Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, 
  legacyHeaders: false, 
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use('/api/', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/marketplace', marketplaceRoutes);

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Blockchain Event Listener Setup
const setupBlockchainListener = async () => {
  try {
    const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
    
    // Load ABI & Address
    const addressPath = path.join(__dirname, '../../backend/contract-addresses.json');
    if (!fs.existsSync(addressPath)) return console.log("Contracts not deployed yet. Waiting...");
    
    const addresses = JSON.parse(fs.readFileSync(addressPath, 'utf-8'));
    const abiPath = path.join(__dirname, '../../frontend/src/abi/EnergyMarketplace.json');
    const abi = JSON.parse(fs.readFileSync(abiPath, 'utf-8'));

    const marketplace = new ethers.Contract(addresses.EnergyMarketplace, abi, provider);

    console.log(`Listening for Smart Contract Events on ${addresses.EnergyMarketplace}...`);

    marketplace.on("EnergyListed", async (listingId: bigint, seller: string, amount: bigint, pricePerUnit: bigint, event: any) => {
      console.log(`[Event: EnergyListed] ID: ${listingId}, Seller: ${seller}`);
      
      const capacity = Number(ethers.formatUnits(amount, 18));
      const price = Number(ethers.formatEther(pricePerUnit));

      // Create dummy user if not exists to satisfy foreign key (since users might not register before testing)
      let user = await prisma.user.findUnique({ where: { walletAddress: seller.toLowerCase() } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            walletAddress: seller.toLowerCase(),
            role: 'PRODUCER',
            email: `${seller.slice(0,8)}@example.com`,
            name: 'Anonymous Producer',
            nonce: Math.floor(Math.random() * 1000000).toString()
          }
        });
      }

      await prisma.listing.create({
        data: {
          blockchainId: Number(listingId),
          energySource: 'Global Network',
          location: 'Global Grid',
          capacity: capacity,
          availableAmount: capacity,
          pricePerUnit: price,
          isActive: true,
          sellerId: user.id
        }
      });
      console.log(`Successfully synced Listing #${listingId} to Database.`);
    });

    marketplace.on("EnergyPurchased", async (listingId: bigint, buyer: string, seller: string, amount: bigint, totalCost: bigint, event: any) => {
      console.log(`[Event: EnergyPurchased] Listing: ${listingId}, Buyer: ${buyer}`);
      
      const listing = await prisma.listing.findFirst({
        where: { blockchainId: Number(listingId) }
      });

      if (!listing) return console.error(`Listing ${listingId} not found in DB!`);

      // Deactivate if full amount was bought
      await prisma.listing.update({
        where: { id: listing.id },
        data: { isActive: false }
      });
      console.log(`Successfully marked Listing #${listingId} as inactive due to purchase.`);
    });

  } catch (err) {
    console.error("Failed to setup blockchain listeners:", err);
  }
};

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  setupBlockchainListener();
});
