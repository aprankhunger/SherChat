import { useState, useRef, useEffect } from 'react';
import { useChatStore } from '../store/chatStore';
import toast from 'react-hot-toast';

export default function StickerPicker({ onSelect, onClose }) {
  const { 
    stickerPacks, 
    customStickers, 
    fetchCustomStickers, 
    uploadSticker, 
    deleteSticker,
    uploadingSticker 
  } = useChatStore();
  
  const [activePack, setActivePack] = useState('my-stickers');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchCustomStickers();
  }, []);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size must be less than 2MB');
      return;
    }

    const result = await uploadSticker(file, file.name.split('.')[0]);
    if (result.success) {
      toast.success('Sticker uploaded!');
    } else {
      toast.error(result.error);
    }
    
    e.target.value = '';
  };

  const handleDeleteSticker = async (stickerId) => {
    const result = await deleteSticker(stickerId);
    if (result.success) {
      toast.success('Sticker deleted');
    } else {
      toast.error(result.error);
    }
    setShowDeleteConfirm(null);
  };

  const currentPack = stickerPacks.find((p) => p.id === activePack);
  const isCustomTab = activePack === 'my-stickers';

  return (
    <div className="border-t border-dark-800 bg-dark-900 animate-slide-up">
      {/* Pack tabs */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-dark-800 overflow-x-auto no-select">
        {/* My Stickers tab */}
        <button
          onClick={() => setActivePack('my-stickers')}
          className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl text-xl transition-all ${
            activePack === 'my-stickers'
              ? 'bg-primary-500/20 scale-110'
              : 'hover:bg-dark-800'
          }`}
          title="My Stickers"
        >
          ⭐
        </button>
        
        {/* Divider */}
        <div className="w-px h-6 bg-dark-700 mx-1" />
        
        {/* Built-in packs */}
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
        {isCustomTab ? (
          <>
            {/* Upload button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingSticker}
              className="flex flex-col items-center justify-center h-16 rounded-xl border-2 border-dashed border-dark-600 hover:border-primary-500 hover:bg-dark-800 transition-all text-dark-400 hover:text-primary-400"
            >
              {uploadingSticker ? (
                <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-[10px] mt-1">Add</span>
                </>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Custom stickers */}
            {customStickers.map((sticker) => (
              <div key={sticker._id} className="relative group">
                <button
                  onClick={() => onSelect({ url: sticker.url, name: sticker.name })}
                  className="flex items-center justify-center h-16 w-full rounded-xl hover:bg-dark-800 active:scale-90 transition-all overflow-hidden"
                >
                  <img 
                    src={sticker.url} 
                    alt={sticker.name}
                    className="max-h-14 max-w-14 object-contain"
                  />
                </button>
                {/* Delete button */}
                <button
                  onClick={() => setShowDeleteConfirm(sticker._id)}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs"
                >
                  ×
                </button>
                
                {/* Delete confirmation */}
                {showDeleteConfirm === sticker._id && (
                  <div className="absolute inset-0 bg-dark-900/95 rounded-xl flex flex-col items-center justify-center gap-1 p-1">
                    <span className="text-[10px] text-dark-300">Delete?</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleDeleteSticker(sticker._id)}
                        className="px-2 py-0.5 bg-red-500 text-white text-[10px] rounded"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(null)}
                        className="px-2 py-0.5 bg-dark-700 text-white text-[10px] rounded"
                      >
                        No
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {customStickers.length === 0 && (
              <div className="col-span-3 flex items-center justify-center h-16 text-dark-500 text-sm">
                Upload your own stickers!
              </div>
            )}
          </>
        ) : (
          currentPack?.stickers.map((sticker) => (
            <button
              key={sticker.id}
              onClick={() => onSelect(sticker)}
              className="flex items-center justify-center h-16 rounded-xl hover:bg-dark-800 active:scale-90 transition-all text-4xl"
              title={sticker.name}
            >
              {sticker.emoji}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
