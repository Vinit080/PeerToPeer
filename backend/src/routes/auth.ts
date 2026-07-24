import { Router } from 'express';
import { getNonce, verifySignature } from '../controllers/auth';

const router = Router();

router.get('/nonce/:walletAddress', getNonce);
router.post('/verify', verifySignature);

export default router;
