import { useState } from 'react';
import { useChatStore } from '../store/chatStore';

export default function UserSearch({ onClose, onSelectUser }) {
  const { users, createPrivateRoom } = useChatStore();
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = async (userId) => {
    setLoading(true);
    const room = await createPrivateRoom(userId);
    setLoading(false);
    if (room) {
      onSelectUser(room);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-dark-950/80 backdrop-blur-sm flex items-end md:items-center justify-center">
      <div className="w-full max-w-md bg-dark-900 rounded-t-3xl md:rounded-3xl max-h-[80vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h2 className="text-lg font-bold text-white">New Chat</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-dark-800 transition-colors"
          >
            <svg className="w-5 h-5 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="px-5 pb-3">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
            className="w-full px-4 py-2.5 bg-dark-800 border border-dark-700 rounded-xl text-sm text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 transition-colors"
          />
        </div>

        {/* User list */}
        <div className="flex-1 overflow-y-auto px-2 pb-5">
          {filteredUsers.length === 0 ? (
            <p className="text-center text-dark-400 text-sm py-8">
              {search ? 'No users found' : 'No users available'}
            </p>
          ) : (
            filteredUsers.map((u) => (
              <button
                key={u._id}
                onClick={() => handleSelect(u._id)}
                disabled={loading}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-dark-800 transition-colors disabled:opacity-50"
              >
                <div className="w-11 h-11 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {u.username[0].toUpperCase()}
                </div>
                <div className="text-left">
                  <p className="font-medium text-white">{u.username}</p>
                  <p className="text-xs text-dark-400">{u.email}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
