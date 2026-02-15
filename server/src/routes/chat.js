const express = require('express');
const Room = require('../models/Room');
const Message = require('../models/Message');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user's chat rooms
router.get('/rooms', auth, async (req, res) => {
  try {
    const rooms = await Room.find({ members: req.user._id })
      .populate('members', '-password')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });
    res.json({ rooms });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create or get private chat room
router.post('/rooms/private', auth, async (req, res) => {
  try {
    const { userId } = req.body;

    // Check if room already exists
    let room = await Room.findOne({
      type: 'private',
      members: { $all: [req.user._id, userId], $size: 2 },
    })
      .populate('members', '-password')
      .populate('lastMessage');

    if (room) {
      return res.json({ room });
    }

    // Create new room
    room = new Room({
      name: 'Private Chat',
      type: 'private',
      members: [req.user._id, userId],
    });
    await room.save();
    room = await room.populate('members', '-password');

    res.status(201).json({ room });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create group chat room
router.post('/rooms/group', auth, async (req, res) => {
  try {
    const { name, memberIds } = req.body;

    const room = new Room({
      name,
      type: 'group',
      members: [req.user._id, ...memberIds],
    });
    await room.save();
    const populated = await room.populate('members', '-password');

    res.status(201).json({ room: populated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get messages for a room
router.get('/rooms/:roomId/messages', auth, async (req, res) => {
  try {
    const { roomId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const messages = await Message.find({ room: roomId })
      .populate('sender', '-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({ messages: messages.reverse() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
