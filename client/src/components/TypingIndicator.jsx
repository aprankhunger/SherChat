export default function TypingIndicator({ names }) {
  const text =
    names.length === 1
      ? `${names[0]} is typing`
      : names.length === 2
      ? `${names[0]} and ${names[1]} are typing`
      : `${names[0]} and ${names.length - 1} others are typing`;

  return (
    <div className="flex items-center gap-2 py-1 animate-fade-in">
      <div className="flex items-center gap-2 px-3.5 py-2 bg-dark-800 rounded-2xl rounded-bl-md">
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 bg-dark-400 rounded-full typing-dot" />
          <div className="w-1.5 h-1.5 bg-dark-400 rounded-full typing-dot" />
          <div className="w-1.5 h-1.5 bg-dark-400 rounded-full typing-dot" />
        </div>
        <span className="text-xs text-dark-400">{text}</span>
      </div>
    </div>
  );
}
