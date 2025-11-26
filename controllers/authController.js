import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';
import crypto from 'crypto';

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const registerUser = async (req, res) => {
    const { email, password, gender, dateOfBirth, publicAliases } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }

    // Create verification token
    const verificationToken = crypto.randomBytes(20).toString('hex');

    const user = await User.create({
        email,
        password,
        gender,
        dateOfBirth,
        publicAliases,
        currentAlias: publicAliases[0], // Default to first alias
        verificationToken,
    });

    if (user) {
        // Send verification email
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
        const message = `Please verify your email by clicking the link: ${verificationUrl}`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'HeartDrop Email Verification',
                message,
            });

            res.status(201).json({
                _id: user._id,
                email: user.email,
                message: 'Registration successful. Please check your email to verify your account.',
            });
        } catch (error) {
            console.error(error);
            // If email fails, we might want to delete the user or allow resend. 
            // For now, we'll just return success but log error.
            res.status(201).json({
                _id: user._id,
                email: user.email,
                message: 'Registration successful, but email failed to send. Please contact support.',
            });
        }
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        if (!user.isVerified) {
            res.status(401).json({ message: 'Please verify your email first.' });
            return;
        }

        res.json({
            _id: user._id,
            email: user.email,
            publicAliases: user.publicAliases,
            currentAlias: user.currentAlias,
            role: user.role,
            token: generateToken(res, user._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

// @desc    Verify email
// @route   POST /api/auth/verify-email
// @access  Public
const verifyEmail = async (req, res) => {
    const { token } = req.body;

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
        res.status(400).json({ message: 'Invalid verification token' });
        return;
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({
        message: 'Email verified successfully',
        token: generateToken(res, user._id),
        user: {
            _id: user._id,
            email: user.email,
            publicAliases: user.publicAliases,
            currentAlias: user.currentAlias,
            role: user.role,
        }
    });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            email: user.email,
            gender: user.gender,
            dateOfBirth: user.dateOfBirth,
            publicAliases: user.publicAliases,
            currentAlias: user.currentAlias,
            role: user.role,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.email = req.body.email || user.email;
        if (req.body.password) {
            user.password = req.body.password;
        }
        user.publicAliases = req.body.publicAliases || user.publicAliases;
        user.currentAlias = req.body.currentAlias || user.currentAlias;
        user.gender = req.body.gender || user.gender;
        user.dateOfBirth = req.body.dateOfBirth || user.dateOfBirth;

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            email: updatedUser.email,
            publicAliases: updatedUser.publicAliases,
            currentAlias: updatedUser.currentAlias,
            role: updatedUser.role,
            token: generateToken(res, updatedUser._id),
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

export {
    registerUser,
    authUser,
    verifyEmail,
    getUserProfile,
    updateUserProfile,
};
