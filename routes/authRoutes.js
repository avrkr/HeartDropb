import express from 'express';
import {
    registerUser,
    authUser,
    verifyEmail,
    getUserProfile,
    updateUserProfile,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', authUser);
router.post('/verify-email', verifyEmail);
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

export default router;
