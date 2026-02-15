import { create } from 'zustand';
import api from '../lib/api';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('sherchat-user') || 'null'),
  token: localStorage.getItem('sherchat-token') || null,
  loading: false,

  login: async (email, password) => {
    set({ loading: true });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('sherchat-token', data.token);
      localStorage.setItem('sherchat-user', JSON.stringify(data.user));
      set({ user: data.user, token: data.token, loading: false });
      return { success: true };
    } catch (error) {
      set({ loading: false });
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed',
      };
    }
  },

  register: async (username, email, password) => {
    set({ loading: true });
    try {
      const { data } = await api.post('/auth/register', {
        username,
        email,
        password,
      });
      localStorage.setItem('sherchat-token', data.token);
      localStorage.setItem('sherchat-user', JSON.stringify(data.user));
      set({ user: data.user, token: data.token, loading: false });
      return { success: true };
    } catch (error) {
      set({ loading: false });
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed',
      };
    }
  },

  logout: () => {
    localStorage.removeItem('sherchat-token');
    localStorage.removeItem('sherchat-user');
    set({ user: null, token: null });
  },
}));
