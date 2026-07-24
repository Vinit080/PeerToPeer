import { Router } from 'express';
import { getListings } from '../controllers/marketplace';

const router = Router();

// Public route to view listings
router.get('/', getListings);

export default router;
