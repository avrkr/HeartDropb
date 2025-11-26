import Confession from '../models/Confession.js';

// @desc    Create a new confession
// @route   POST /api/confessions
// @access  Private
const createConfession = async (req, res) => {
    const { title, content, visibility, recipient, tags } = req.body;

    const confession = new Confession({
        title,
        content,
        author: req.user._id,
        alias: req.user.currentAlias,
        visibility,
        recipient,
        tags,
    });

    const createdConfession = await confession.save();
    res.status(201).json(createdConfession);
};

// @desc    Get all public confessions
// @route   GET /api/confessions/public
// @access  Public
const getPublicConfessions = async (req, res) => {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const count = await Confession.countDocuments({ visibility: 'public', isArchived: false });
    const confessions = await Confession.find({ visibility: 'public', isArchived: false })
        .sort({ createdAt: -1 })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ confessions, page, pages: Math.ceil(count / pageSize) });
};

// @desc    Get user's confessions (My Confessions)
// @route   GET /api/confessions/my
// @access  Private
const getMyConfessions = async (req, res) => {
    const confessions = await Confession.find({ author: req.user._id }).sort({ createdAt: -1 });
    res.json(confessions);
};

// @desc    Get single confession
// @route   GET /api/confessions/:id
// @access  Public (if public) / Private (if private)
const getConfessionById = async (req, res) => {
    const confession = await Confession.findById(req.params.id);

    if (confession) {
        if (confession.visibility === 'private' &&
            (!req.user || (confession.author.toString() !== req.user._id.toString() && confession.recipient.toString() !== req.user._id.toString()))) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }
        res.json(confession);
    } else {
        res.status(404).json({ message: 'Confession not found' });
    }
};

// @desc    Delete confession
// @route   DELETE /api/confessions/:id
// @access  Private
const deleteConfession = async (req, res) => {
    const confession = await Confession.findById(req.params.id);

    if (confession) {
        if (confession.author.toString() !== req.user._id.toString()) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }
        await confession.deleteOne();
        res.json({ message: 'Confession removed' });
    } else {
        res.status(404).json({ message: 'Confession not found' });
    }
};

// @desc    Archive confession
// @route   PUT /api/confessions/:id/archive
// @access  Private
const archiveConfession = async (req, res) => {
    const confession = await Confession.findById(req.params.id);

    if (confession) {
        if (confession.author.toString() !== req.user._id.toString()) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }
        confession.isArchived = !confession.isArchived;
        const updatedConfession = await confession.save();
        res.json(updatedConfession);
    } else {
        res.status(404).json({ message: 'Confession not found' });
    }
};

export {
    createConfession,
    getPublicConfessions,
    getMyConfessions,
    getConfessionById,
    deleteConfession,
    archiveConfession,
};
