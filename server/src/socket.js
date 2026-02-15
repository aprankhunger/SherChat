const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Message = require('./models/Message');
const Room = require('./models/Room');

const onlineUsers = new Map();

function setupSocket(io) {
  // Auth middleware for socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication required'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', async (socket) => {
    const userId = socket.user._id.toString();
    console.log(`✅ User connected: ${socket.user.username}`);

    // Mark user online
    onlineUsers.set(userId, socket.id);
    await User.findByIdAndUpdate(userId, { isOnline: true });
    io.emit('user:online', { userId, isOnline: true });

    // Join user's rooms
    const rooms = await Room.find({ members: userId });
    rooms.forEach((room) => {
      socket.join(room._id.toString());
    });

    // Handle joining a room
    socket.on('room:join', (roomId) => {
      socket.join(roomId);
    });

    // Handle sending a message
    socket.on('message:send', async (data) => {
      try {
        const { roomId, content, type = 'text', stickerUrl = '' } = data;

        const message = new Message({
          sender: userId,
          room: roomId,
          content,
          type,
          stickerUrl,
          readBy: [userId],
        });
        await message.save();

        // Update room's last message
        await Room.findByIdAndUpdate(roomId, {
          lastMessage: message._id,
          updatedAt: new Date(),
        });

        const populated = await message.populate('sender', '-password');

        // Broadcast to room
        io.to(roomId).emit('message:received', populated);
      } catch (error) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicator
    socket.on('typing:start', (roomId) => {
      socket.to(roomId).emit('typing:update', {
        userId,
        username: socket.user.username,
        isTyping: true,
      });
    });

    socket.on('typing:stop', (roomId) => {
      socket.to(roomId).emit('typing:update', {
        userId,
        username: socket.user.username,
        isTyping: false,
      });
    });

    // Handle message read
    socket.on('message:read', async ({ messageId, roomId }) => {
      try {
        await Message.findByIdAndUpdate(messageId, {
          $addToSet: { readBy: userId },
        });
        io.to(roomId).emit('message:read', { messageId, userId });
      } catch (error) {
        console.error('Read receipt error:', error);
      }
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      console.log(`❌ User disconnected: ${socket.user.username}`);
      onlineUsers.delete(userId);
      await User.findByIdAndUpdate(userId, {
        isOnline: false,
        lastSeen: new Date(),
      });
      io.emit('user:online', { userId, isOnline: false });
    });
  });
}

module.exports = { setupSocket };
