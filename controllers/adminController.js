import User from '../models/User.js';
import Confession from '../models/Confession.js';
import Reply from '../models/Reply.js';

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all confessions (including private)
// @route   GET /api/admin/confessions
// @access  Private/Admin
const getAllConfessions = async (req, res) => {
    try {
        const confessions = await Confession.find({})
            .populate('author', 'email currentAlias')
            .sort({ createdAt: -1 });
        res.json(confessions);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalConfessions = await Confession.countDocuments();
        const totalReplies = await Reply.countDocuments();
        const publicConfessions = await Confession.countDocuments({ visibility: 'public' });
        const privateConfessions = await Confession.countDocuments({ visibility: 'private' });
        const archivedConfessions = await Confession.countDocuments({ isArchived: true });

        res.json({
            totalUsers,
            totalConfessions,
            totalReplies,
            publicConfessions,
            privateConfessions,
            archivedConfessions,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // Don't allow deleting yourself
        if (user._id.toString() === req.user._id.toString()) {
            res.status(400).json({ message: 'Cannot delete your own account' });
            return;
        }

        // Delete user's confessions and replies
        await Confession.deleteMany({ author: user._id });
        await Reply.deleteMany({ author: user._id });
        await user.deleteOne();

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete confession (admin)
// @route   DELETE /api/admin/confessions/:id
// @access  Private/Admin
const deleteConfessionAdmin = async (req, res) => {
    try {
        const confession = await Confession.findById(req.params.id);

        if (!confession) {
            res.status(404).json({ message: 'Confession not found' });
            return;
        }

        // Delete associated replies
        await Reply.deleteMany({ confession: confession._id });
        await confession.deleteOne();

        res.json({ message: 'Confession deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create new admin
// @route   POST /api/admin/create-admin
// @access  Private/Admin
const createAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const user = await User.create({
            email,
            password,
            isVerified: true,
            role: 'admin',
            publicAliases: ['Admin'],
            currentAlias: 'Admin',
            gender: 'other',
            dateOfBirth: new Date(),
        });

        res.status(201).json({
            _id: user._id,
            email: user.email,
            role: user.role,
            message: 'Admin created successfully',
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export {
    getAllUsers,
    getAllConfessions,
    getStats,
    deleteUser,
    deleteConfessionAdmin,
    createAdmin,
};
