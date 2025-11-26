import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
    confession: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Confession',
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
    content: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['public', 'private'],
        default: 'public',
    },
    connectionStatus: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
    },
}, {
    timestamps: true,
});

const Reply = mongoose.model('Reply', replySchema);

export default Reply;
