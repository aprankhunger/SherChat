import { useChatStore } from '../store/chatStore';

export default function ChatSidebar({ onSelectRoom, onNewChat, onLogout, user }) {
  const { rooms, activeRoom, onlineUsers, loadingRooms } = useChatStore();

  const getRoomName = (room) => {
    if (room.type === 'group') return room.name;
    const otherMember = room.members?.find((m) => m._id !== user?._id);
    return otherMember?.username || 'Unknown';
  };

  const getRoomAvatar = (room) => {
    if (room.type === 'group') return room.name[0]?.toUpperCase();
    const otherMember = room.members?.find((m) => m._id !== user?._id);
    return otherMember?.username?.[0]?.toUpperCase() || '?';
  };

  const isOnline = (room) => {
    if (room.type === 'group') return false;
    const otherMember = room.members?.find((m) => m._id !== user?._id);
    return otherMember ? onlineUsers[otherMember._id] : false;
  };

  const getLastMessagePreview = (room) => {
    if (!room.lastMessage) return 'No messages yet';
    if (room.lastMessage.type === 'sticker') return '🎭 Sticker';
    return room.lastMessage.content?.slice(0, 40) || '';
  };

  const formatTime = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    if (diff < 86400000) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    if (diff < 604800000) {
      return d.toLocaleDateString([], { weekday: 'short' });
    }
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex flex-col h-full safe-top">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-dark-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white font-bold">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">SherChat</h1>
            <p className="text-xs text-dark-400">@{user?.username}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onNewChat}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-dark-800 transition-colors"
          >
            <svg className="w-5 h-5 text-dark-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <button
            onClick={onLogout}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-dark-800 transition-colors"
          >
            <svg className="w-5 h-5 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-3">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search chats..."
            className="w-full pl-10 pr-4 py-2.5 bg-dark-800 border border-dark-700 rounded-xl text-sm text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 transition-colors"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {loadingRooms ? (
          <div className="flex items-center justify-center py-8">
            <svg className="animate-spin h-6 w-6 text-primary-500" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-dark-400 text-sm">No chats yet</p>
            <button
              onClick={onNewChat}
              className="mt-3 text-primary-400 text-sm font-medium hover:text-primary-300"
            >
              Start a new chat
            </button>
          </div>
        ) : (
          rooms.map((room) => (
            <button
              key={room._id}
              onClick={() => onSelectRoom(room)}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-dark-800/50 transition-colors ${
                activeRoom?._id === room._id ? 'bg-dark-800' : ''
              }`}
            >
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {getRoomAvatar(room)}
                </div>
                {isOnline(room) && (
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-dark-900" />
                )}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white text-[15px] truncate">
                    {getRoomName(room)}
                  </span>
                  <span className="text-xs text-dark-400 flex-shrink-0 ml-2">
                    {formatTime(room.updatedAt)}
                  </span>
                </div>
                <p className="text-sm text-dark-400 truncate mt-0.5">
                  {getLastMessagePreview(room)}
                </p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
