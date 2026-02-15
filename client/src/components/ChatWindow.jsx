import { useEffect, useRef, useState, useCallback } from 'react';
import { useChatStore } from '../store/chatStore';
import { getSocket } from '../lib/socket';
import MessageBubble from './MessageBubble';
import StickerPicker from './StickerPicker';
import TypingIndicator from './TypingIndicator';

export default function ChatWindow({ room, onBack, user }) {
  const { messages, fetchMessages, loadingMessages, typingUsers } = useChatStore();
  const [text, setText] = useState('');
  const [showStickers, setShowStickers] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (room?._id) {
      fetchMessages(room._id);
    }
  }, [room?._id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getRoomName = () => {
    if (room.type === 'group') return room.name;
    const other = room.members?.find((m) => m._id !== user?._id);
    return other?.username || 'Unknown';
  };

  const getRoomStatus = () => {
    if (room.type === 'group') return `${room.members?.length || 0} members`;
    const other = room.members?.find((m) => m._id !== user?._id);
    return other?.isOnline ? 'Online' : 'Offline';
  };

  const handleSend = useCallback(() => {
    if (!text.trim()) return;

    const socket = getSocket();
    if (socket) {
      socket.emit('message:send', {
        roomId: room._id,
        content: text.trim(),
        type: 'text',
      });
      socket.emit('typing:stop', room._id);
    }
    setText('');
    setShowStickers(false);
    inputRef.current?.focus();
  }, [text, room._id]);

  const handleSendSticker = (sticker) => {
    const socket = getSocket();
    if (socket) {
      socket.emit('message:send', {
        roomId: room._id,
        content: sticker.emoji,
        type: 'sticker',
        stickerUrl: sticker.emoji,
      });
    }
    setShowStickers(false);
  };

  const handleTyping = (e) => {
    setText(e.target.value);
    const socket = getSocket();
    if (!socket) return;

    socket.emit('typing:start', room._id);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing:stop', room._id);
    }, 2000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const roomTyping = typingUsers[room._id] || {};
  const typingNames = Object.values(roomTyping).filter(
    (name) => name !== user?.username
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-dark-800 bg-dark-900/80 backdrop-blur-lg safe-top">
        <button
          onClick={onBack}
          className="md:hidden w-8 h-8 flex items-center justify-center rounded-full hover:bg-dark-800 transition-colors"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
          {getRoomName()[0]?.toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-white truncate">{getRoomName()}</h2>
          <p className="text-xs text-dark-400">{getRoomStatus()}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
        {loadingMessages ? (
          <div className="flex items-center justify-center h-full">
            <svg className="animate-spin h-8 w-8 text-primary-500" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-dark-400">No messages yet</p>
              <p className="text-dark-500 text-sm mt-1">Say hello! 👋</p>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <MessageBubble
              key={msg._id || idx}
              message={msg}
              isOwn={msg.sender?._id === user?._id}
              showAvatar={
                idx === 0 ||
                messages[idx - 1]?.sender?._id !== msg.sender?._id
              }
            />
          ))
        )}

        {typingNames.length > 0 && <TypingIndicator names={typingNames} />}
        <div ref={messagesEndRef} />
      </div>

      {/* Sticker Picker */}
      {showStickers && (
        <StickerPicker
          onSelect={handleSendSticker}
          onClose={() => setShowStickers(false)}
        />
      )}

      {/* Input Area */}
      <div className="border-t border-dark-800 bg-dark-900/80 backdrop-blur-lg px-3 py-3 safe-bottom">
        <div className="flex items-end gap-2">
          <button
            onClick={() => setShowStickers(!showStickers)}
            className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full transition-colors ${
              showStickers
                ? 'bg-primary-500 text-white'
                : 'hover:bg-dark-800 text-dark-400'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={text}
              onChange={handleTyping}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              rows={1}
              className="w-full px-4 py-2.5 bg-dark-800 border border-dark-700 rounded-2xl text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 resize-none text-[15px] max-h-32"
              style={{ minHeight: '42px' }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!text.trim()}
            className="w-10 h-10 flex-shrink-0 bg-primary-500 rounded-full flex items-center justify-center text-white hover:bg-primary-600 active:scale-95 transition-all disabled:opacity-40 disabled:hover:bg-primary-500"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
