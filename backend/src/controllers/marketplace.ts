import { Request, Response } from 'express';
import prisma from '../prisma';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getListings = async (req: Request, res: Response) => {
  try {
    const listings = await prisma.listing.findMany({
      where: { isActive: true },
      include: {
        seller: {
          select: { name: true, walletAddress: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createListing = async (req: AuthRequest, res: Response) => {
  try {
    const { blockchainId, energySource, location, capacity, pricePerUnit } = req.body;
    
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const newListing = await prisma.listing.create({
      data: {
        sellerId: req.user.id,
        blockchainId,
        energySource,
        location,
        capacity,
        availableAmount: capacity,
        pricePerUnit,
        isActive: true
      }
    });

    res.status(201).json(newListing);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const recordPurchase = async (req: AuthRequest, res: Response) => {
  try {
    const { listingId, amount, totalCost, txHash } = req.body;
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const listing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    if (listing.availableAmount < amount) {
      return res.status(400).json({ message: 'Not enough energy available in listing' });
    }

    const tx = await prisma.$transaction([
      prisma.listing.update({
        where: { id: listingId },
        data: {
          availableAmount: { decrement: amount },
          isActive: listing.availableAmount - amount > 0
        }
      }),
      prisma.transaction.create({
        data: {
          listingId,
          buyerId: req.user.id,
          sellerId: listing.sellerId,
          amount,
          totalCost,
          txHash
        }
      })
    ]);

    res.status(201).json(tx[1]);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};
