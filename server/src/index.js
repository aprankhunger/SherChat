const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const stickerRoutes = require('./routes/stickers');
const { setupSocket } = require('./socket');

// Load .env from the server directory regardless of CWD
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Ensure JWT_SECRET always has a value
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'sherchat_default_secret_key';
}

const app = express();
const server = http.createServer(app);

// Allow multiple origins for dev and production
const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/stickers', stickerRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Socket.IO setup
setupSocket(io);

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    const mongoUri = process.env.MONGODB_URI;

    console.log('🔄 Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    console.log('✅ Connected to MongoDB Atlas');

    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
}

startServer();
