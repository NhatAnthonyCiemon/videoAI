import express from 'express';
const router = express.Router();
import animController from './controller.js';

router.get('/', animController.loadAllAnim);
export default router;