const mongoose = require('mongoose');
const oneToOneMessage = require('../models/OnetoOneMessage');
const ObjectId = mongoose.Types.ObjectId;

const getDirectConversations = async (req, res) => {
    try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        // Fetch the existing conversations
        const existing_conversations = await oneToOneMessage.find({
            participants: { $all: [ObjectId.createFromHexString(id)] },
        }).populate("participants", "firstname lastname _id email status");

        console.log(existing_conversations);
        res.status(200).json(existing_conversations);
    } catch (error) {
        console.error("Error fetching direct conversations:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getDirectConversations,
};
