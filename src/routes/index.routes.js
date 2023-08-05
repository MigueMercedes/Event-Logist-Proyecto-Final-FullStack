import { Router } from 'express';
import { renderIndex } from '../controllers/index.controllers.js';

const router = Router();

router.get('/', renderIndex);

export default router;
