import { Router } from 'express';
import { isAuthenticated } from '../helpers/auth.js';
import { sendJson } from '../controllers/dataTypes.controllers.js';

const router = Router();

// Routes

router.get('/data/types', sendJson);

export default router;
