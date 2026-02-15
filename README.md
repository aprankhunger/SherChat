# 💬 SherChat

A mobile-first, real-time web chat application with stickers, built with React + Vite + Tailwind CSS + Node.js + Socket.IO + MongoDB.

## 🚀 Features

- **Real-time Messaging** — Instant messaging powered by Socket.IO
- **Sticker Packs** — 5 built-in sticker packs (Emoji, Gestures, Animals, Hearts, Food)
- **Mobile-First Design** — Optimized for mobile with responsive layout
- **PWA Support** — Installable on mobile devices
- **Typing Indicators** — See when someone is typing
- **Online Status** — Know who's online in real-time
- **Private & Group Chats** — One-on-one or group conversations
- **JWT Authentication** — Secure login and registration

## 📋 Prerequisites

- **Node.js** v18+
- **MongoDB** running locally on `mongodb://localhost:27017`

## 🛠️ Setup

### 1. Install all dependencies

```bash
# From root directory
cd server && npm install
cd ../client && npm install
```

### 2. Configure environment variables

Edit `server/.env` if needed:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sherchat
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

### 3. Start the application

**Terminal 1 — Start the backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Start the frontend:**
```bash
cd client
npm run dev
```

### 4. Open in browser

Visit **http://localhost:5173** (use mobile device or Chrome DevTools mobile view for the best experience).

## 📁 Project Structure

```
SherChat/
├── server/                 # Backend
│   ├── src/
│   │   ├── index.js        # Express + Socket.IO server
│   │   ├── socket.js       # Socket event handlers
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   └── middleware/     # Auth middleware
│   └── .env
├── client/                 # Frontend
│   ├── src/
│   │   ├── App.jsx         # Main app with routing
│   │   ├── pages/          # Login, Register, Chat pages
│   │   ├── components/     # UI components
│   │   ├── store/          # Zustand state stores
│   │   └── lib/            # API & Socket utilities
│   └── vite.config.js
└── README.md
```

## 📱 Mobile Tips

- Open Chrome DevTools → Toggle Device Toolbar (Ctrl+Shift+M) for mobile view
- The app is a PWA — on mobile Chrome, tap "Add to Home Screen" to install
- Designed for portrait mode on phones
