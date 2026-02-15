import { useState } from 'react';
import { useChatStore } from '../store/chatStore';

export default function StickerPicker({ onSelect, onClose }) {
  const { stickerPacks } = useChatStore();
  const [activePack, setActivePack] = useState(stickerPacks[0]?.id || '');

  const currentPack = stickerPacks.find((p) => p.id === activePack);

  return (
    <div className="border-t border-dark-800 bg-dark-900 animate-slide-up">
      {/* Pack tabs */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-dark-800 overflow-x-auto no-select">
        {stickerPacks.map((pack) => (
          <button
            key={pack.id}
            onClick={() => setActivePack(pack.id)}
            className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl text-xl transition-all ${
              activePack === pack.id
                ? 'bg-primary-500/20 scale-110'
                : 'hover:bg-dark-800'
            }`}
            title={pack.name}
          >
            {pack.icon}
          </button>
        ))}
      </div>

      {/* Stickers grid */}
      <div className="grid grid-cols-4 gap-2 p-3 max-h-52 overflow-y-auto">
        {currentPack?.stickers.map((sticker) => (
          <button
            key={sticker.id}
            onClick={() => onSelect(sticker)}
            className="flex items-center justify-center h-16 rounded-xl hover:bg-dark-800 active:scale-90 transition-all text-4xl"
            title={sticker.name}
          >
            {sticker.emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
