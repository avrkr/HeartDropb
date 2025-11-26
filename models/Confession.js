import mongoose from 'mongoose';

const confessionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    alias: {
        type: String,
        required: true,
    },
    visibility: {
        type: String,
        enum: ['public', 'private'],
        default: 'public',
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    isArchived: {
        type: Boolean,
        default: false,
    },
    tags: [{
        type: String,
    }],
}, {
    timestamps: true,
});

const Confession = mongoose.model('Confession', confessionSchema);

export default Confession;
