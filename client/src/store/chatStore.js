import { create } from 'zustand';
import api from '../lib/api';

export const useChatStore = create((set, get) => ({
  rooms: [],
  activeRoom: null,
  messages: [],
  users: [],
  onlineUsers: {},
  typingUsers: {},
  stickerPacks: [],
  loadingRooms: false,
  loadingMessages: false,

  // Fetch chat rooms
  fetchRooms: async () => {
    set({ loadingRooms: true });
    try {
      const { data } = await api.get('/chat/rooms');
      set({ rooms: data.rooms, loadingRooms: false });
    } catch (error) {
      set({ loadingRooms: false });
      console.error('Failed to fetch rooms:', error);
    }
  },

  // Set active room
  setActiveRoom: (room) => {
    set({ activeRoom: room, messages: [] });
  },

  // Fetch messages for a room
  fetchMessages: async (roomId) => {
    set({ loadingMessages: true });
    try {
      const { data } = await api.get(`/chat/rooms/${roomId}/messages`);
      set({ messages: data.messages, loadingMessages: false });
    } catch (error) {
      set({ loadingMessages: false });
      console.error('Failed to fetch messages:', error);
    }
  },

  // Add a new message
  addMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  // Fetch all users
  fetchUsers: async () => {
    try {
      const { data } = await api.get('/auth/users');
      set({ users: data.users });
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  },

  // Create a private room
  createPrivateRoom: async (userId) => {
    try {
      const { data } = await api.post('/chat/rooms/private', { userId });
      const { rooms } = get();
      const exists = rooms.find((r) => r._id === data.room._id);
      if (!exists) {
        set({ rooms: [data.room, ...rooms] });
      }
      set({ activeRoom: data.room });
      return data.room;
    } catch (error) {
      console.error('Failed to create room:', error);
    }
  },

  // Create a group room
  createGroupRoom: async (name, memberIds) => {
    try {
      const { data } = await api.post('/chat/rooms/group', {
        name,
        memberIds,
      });
      set((state) => ({ rooms: [data.room, ...state.rooms] }));
      return data.room;
    } catch (error) {
      console.error('Failed to create group:', error);
    }
  },

  // Update online status
  setUserOnline: (userId, isOnline) => {
    set((state) => ({
      onlineUsers: { ...state.onlineUsers, [userId]: isOnline },
    }));
  },

  // Update typing status
  setTypingUser: (roomId, userId, username, isTyping) => {
    set((state) => {
      const roomTyping = { ...(state.typingUsers[roomId] || {}) };
      if (isTyping) {
        roomTyping[userId] = username;
      } else {
        delete roomTyping[userId];
      }
      return { typingUsers: { ...state.typingUsers, [roomId]: roomTyping } };
    });
  },

  // Fetch sticker packs
  fetchStickerPacks: async () => {
    try {
      const { data } = await api.get('/stickers/packs');
      set({ stickerPacks: data.packs });
    } catch (error) {
      console.error('Failed to fetch stickers:', error);
    }
  },

  // Update room's last message in the list
  updateRoomLastMessage: (roomId, message) => {
    set((state) => ({
      rooms: state.rooms
        .map((r) => (r._id === roomId ? { ...r, lastMessage: message, updatedAt: new Date().toISOString() } : r))
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)),
    }));
  },
}));
