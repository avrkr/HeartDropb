import Reply from '../models/Reply.js';
import Confession from '../models/Confession.js';

// @desc    Create a new reply
// @route   POST /api/replies
// @access  Private
const createReply = async (req, res) => {
    const { confessionId, content, type } = req.body;

    const confession = await Confession.findById(confessionId);

    if (!confession) {
        res.status(404).json({ message: 'Confession not found' });
        return;
    }

    const reply = new Reply({
        confession: confessionId,
        author: req.user._id,
        alias: req.user.currentAlias,
        content,
        type,
        connectionStatus: type === 'private' ? 'pending' : 'accepted',
    });

    const createdReply = await reply.save();
    res.status(201).json(createdReply);
};

// @desc    Get replies for a confession
// @route   GET /api/replies/:confessionId
// @access  Public/Private
const getReplies = async (req, res) => {
    const { confessionId } = req.params;
    const type = req.query.type || 'public';

    // If fetching private replies, ensure user is author of confession or author of reply
    // This logic is complex for a simple GET. 
    // Simplified: Public replies are visible to everyone.
    // Private replies are visible only to confession author and reply author.

    let query = { confession: confessionId, type: 'public' };

    if (type === 'private') {
        // This endpoint might need to be protected and filtered
        // For now, let's just return public replies here and handle private separately or filter
        // If we want to show private replies to the confession author:
        if (!req.user) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }

        const confession = await Confession.findById(confessionId);
        if (confession.author.toString() !== req.user._id.toString()) {
            // If not author of confession, can only see their own private replies
            query = { confession: confessionId, type: 'private', author: req.user._id };
        } else {
            // Author of confession can see all private replies
            query = { confession: confessionId, type: 'private' };
        }
    }

    const replies = await Reply.find(query).sort({ createdAt: 1 });
    res.json(replies);
};

// @desc    Accept/Reject connection
// @route   PUT /api/replies/:id/status
// @access  Private
const updateConnectionStatus = async (req, res) => {
    const { status } = req.body; // accepted, rejected
    const reply = await Reply.findById(req.params.id).populate('confession');

    if (!reply) {
        res.status(404).json({ message: 'Reply not found' });
        return;
    }

    // Only confession author can accept/reject
    if (reply.confession.author.toString() !== req.user._id.toString()) {
        res.status(401).json({ message: 'Not authorized' });
        return;
    }

    reply.connectionStatus = status;
    const updatedReply = await reply.save();
    res.json(updatedReply);
};

export {
    createReply,
    getReplies,
    updateConnectionStatus,
};
