import { Router } from 'express';
import { search } from '../controllers/searchController.js';

const router = Router();

// GET /api/search?q=texto
router.get('/search', search);

export default router;
