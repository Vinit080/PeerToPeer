import { Router } from 'express';
import { getListings, createListing, recordPurchase } from '../controllers/marketplace';
import { authenticate, requireRole } from '../middlewares/authMiddleware';

const router = Router();

// Public route to view listings
router.get('/', getListings);

// Protected route for producers to create listings
router.post('/', authenticate, requireRole(['PRODUCER', 'ADMIN']), createListing);

// Protected route for consumers to record a purchase
router.post('/purchase', authenticate, recordPurchase);

export default router;
