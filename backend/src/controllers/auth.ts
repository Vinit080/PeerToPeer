import { Request, Response } from 'express';
import prisma from '../prisma';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { ethers } from 'ethers';

// 1. Get nonce for wallet address
export const getNonce = async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.params;
    if (!walletAddress) {
      return res.status(400).json({ message: 'Wallet address required' });
    }

    const address = walletAddress.toLowerCase();
    let user = await prisma.user.findUnique({ where: { walletAddress: address } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          walletAddress: address,
          nonce: uuidv4(),
          role: 'CONSUMER' // default role
        }
      });
    } else {
      // Rotate nonce
      user = await prisma.user.update({
        where: { walletAddress: address },
        data: { nonce: uuidv4() }
      });
    }

    res.status(200).json({ nonce: user.nonce });
  } catch (error) {
    console.error('Error fetching nonce', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 2. Verify signature and issue JWT
export const verifySignature = async (req: Request, res: Response) => {
  try {
    const { walletAddress, signature } = req.body;
    if (!walletAddress || !signature) {
      return res.status(400).json({ message: 'Wallet address and signature required' });
    }

    const address = walletAddress.toLowerCase();
    const user = await prisma.user.findUnique({ where: { walletAddress: address } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const message = `Sign this message to authenticate with P2P Energy Trading App.\nNonce: ${user.nonce}`;
    const recoveredAddress = ethers.verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() !== address) {
      return res.status(401).json({ message: 'Signature verification failed' });
    }

    // Rotate nonce after successful login
    await prisma.user.update({
      where: { walletAddress: address },
      data: { nonce: uuidv4() }
    });

    const token = jwt.sign(
      { id: user.id, walletAddress: user.walletAddress, role: user.role },
      process.env.JWT_SECRET || 'super-secret-key-for-development',
      { expiresIn: '24h' }
    );

    res.status(200).json({ token, user: { id: user.id, walletAddress: user.walletAddress, role: user.role, name: user.name } });
  } catch (error) {
    console.error('Error verifying signature', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
