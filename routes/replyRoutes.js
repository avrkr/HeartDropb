import express from 'express';
import {
    createReply,
    getReplies,
    updateConnectionStatus,
} from '../controllers/replyController.js';
import { protect, optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, createReply);

router.get('/:confessionId', optionalProtect, getReplies);

router.put('/:id/status', protect, updateConnectionStatus);

export default router;
