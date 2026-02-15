import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useChatStore } from '../store/chatStore';
import { connectSocket, disconnectSocket, getSocket } from '../lib/socket';
import ChatSidebar from '../components/ChatSidebar';
import ChatWindow from '../components/ChatWindow';
import UserSearch from '../components/UserSearch';

export default function Chat() {
  const { token, user, logout } = useAuthStore();
  const {
    activeRoom,
    setActiveRoom,
    fetchRooms,
    fetchUsers,
    fetchStickerPacks,
    addMessage,
    setUserOnline,
    setTypingUser,
    updateRoomLastMessage,
  } = useChatStore();

  const [showSidebar, setShowSidebar] = useState(true);
  const [showUserSearch, setShowUserSearch] = useState(false);

  useEffect(() => {
    // Fetch initial data
    fetchRooms();
    fetchUsers();
    fetchStickerPacks();

    // Connect socket
    const socket = connectSocket(token);

    // Listen for new messages
    socket.on('message:received', (message) => {
      const currentRoom = useChatStore.getState().activeRoom;
      if (currentRoom && message.room === currentRoom._id) {
        addMessage(message);
      }
      updateRoomLastMessage(message.room, message);
    });

    // Listen for online status changes
    socket.on('user:online', ({ userId, isOnline }) => {
      setUserOnline(userId, isOnline);
    });

    // Listen for typing indicators
    socket.on('typing:update', ({ userId, username, isTyping }) => {
      const currentRoom = useChatStore.getState().activeRoom;
      if (currentRoom) {
        setTypingUser(currentRoom._id, userId, username, isTyping);
      }
    });

    return () => {
      disconnectSocket();
    };
  }, [token]);

  const handleSelectRoom = (room) => {
    setActiveRoom(room);
    setShowSidebar(false);

    const socket = getSocket();
    if (socket) {
      socket.emit('room:join', room._id);
    }
  };

  const handleBack = () => {
    setActiveRoom(null);
    setShowSidebar(true);
  };

  return (
    <div className="h-full flex bg-dark-900 overflow-hidden">
      {/* Sidebar - full screen on mobile when visible */}
      <div
        className={`${
          showSidebar ? 'flex' : 'hidden'
        } md:flex flex-col w-full md:w-80 lg:w-96 border-r border-dark-800 bg-dark-900`}
      >
        <ChatSidebar
          onSelectRoom={handleSelectRoom}
          onNewChat={() => setShowUserSearch(true)}
          onLogout={logout}
          user={user}
        />
      </div>

      {/* Chat Window - full screen on mobile */}
      <div
        className={`${
          !showSidebar ? 'flex' : 'hidden'
        } md:flex flex-col flex-1 bg-dark-950`}
      >
        {activeRoom ? (
          <ChatWindow room={activeRoom} onBack={handleBack} user={user} />
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-dark-400 text-lg font-medium">Select a chat</h3>
              <p className="text-dark-500 text-sm mt-1">Choose a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* User Search Modal */}
      {showUserSearch && (
        <UserSearch
          onClose={() => setShowUserSearch(false)}
          onSelectUser={(room) => {
            setShowUserSearch(false);
            handleSelectRoom(room);
          }}
        />
      )}
    </div>
  );
}
