export default function MessageBubble({ message, isOwn, showAvatar }) {
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isSticker = message.type === 'sticker';

  return (
    <div
      className={`flex items-end gap-2 message-enter ${
        isOwn ? 'flex-row-reverse' : 'flex-row'
      } ${showAvatar ? 'mt-3' : 'mt-0.5'}`}
    >
      {/* Avatar */}
      {!isOwn && showAvatar ? (
        <div className="w-7 h-7 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 mb-0.5">
          {message.sender?.username?.[0]?.toUpperCase()}
        </div>
      ) : (
        !isOwn && <div className="w-7 flex-shrink-0" />
      )}

      <div className={`max-w-[75%] ${isOwn ? 'items-end' : 'items-start'}`}>
        {/* Username for group chats */}
        {!isOwn && showAvatar && (
          <p className="text-xs text-primary-400 font-medium mb-0.5 px-1">
            {message.sender?.username}
          </p>
        )}

        {isSticker ? (
          /* Sticker message */
          <div className="sticker-pop">
            <span className="text-6xl leading-none block py-1">
              {message.content}
            </span>
            <p
              className={`text-[10px] text-dark-500 mt-1 ${
                isOwn ? 'text-right' : 'text-left'
              }`}
            >
              {formatTime(message.createdAt)}
            </p>
          </div>
        ) : (
          /* Text message */
          <div
            className={`px-3.5 py-2 rounded-2xl ${
              isOwn
                ? 'bg-primary-500 text-white rounded-br-md'
                : 'bg-dark-800 text-dark-100 rounded-bl-md'
            }`}
          >
            <p className="text-[15px] leading-relaxed break-words whitespace-pre-wrap">
              {message.content}
            </p>
            <p
              className={`text-[10px] mt-1 ${
                isOwn ? 'text-primary-200' : 'text-dark-500'
              } text-right`}
            >
              {formatTime(message.createdAt)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
