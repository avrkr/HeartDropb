import express from 'express';
import {
    getAllUsers,
    getAllConfessions,
    getStats,
    deleteUser,
    deleteConfessionAdmin,
    createAdmin,
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected and require admin role
router.use(protect);
router.use(admin);

router.get('/users', getAllUsers);
router.get('/confessions', getAllConfessions);
router.get('/stats', getStats);
router.delete('/users/:id', deleteUser);
router.delete('/confessions/:id', deleteConfessionAdmin);
router.post('/create-admin', createAdmin);

export default router;
