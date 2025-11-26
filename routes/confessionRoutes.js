import express from 'express';
import {
    createConfession,
    getPublicConfessions,
    getMyConfessions,
    getConfessionById,
    deleteConfession,
    archiveConfession,
} from '../controllers/confessionController.js';
import { protect, optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, createConfession);

router.get('/public', getPublicConfessions);
router.get('/my', protect, getMyConfessions);

router.route('/:id')
    .get(optionalProtect, getConfessionById)
    .delete(protect, deleteConfession);

router.put('/:id/archive', protect, archiveConfession);

export default router;
