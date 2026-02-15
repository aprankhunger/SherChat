const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

// Built-in sticker packs
const stickerPacks = [
  {
    id: 'emoji-faces',
    name: 'Emoji Faces',
    icon: '😀',
    stickers: [
      { id: 'ef-1', emoji: '😀', name: 'Grinning' },
      { id: 'ef-2', emoji: '😂', name: 'Joy' },
      { id: 'ef-3', emoji: '🥰', name: 'Love' },
      { id: 'ef-4', emoji: '😎', name: 'Cool' },
      { id: 'ef-5', emoji: '🤔', name: 'Thinking' },
      { id: 'ef-6', emoji: '😴', name: 'Sleeping' },
      { id: 'ef-7', emoji: '🤣', name: 'ROFL' },
      { id: 'ef-8', emoji: '😍', name: 'Heart Eyes' },
      { id: 'ef-9', emoji: '🥺', name: 'Pleading' },
      { id: 'ef-10', emoji: '😤', name: 'Angry' },
      { id: 'ef-11', emoji: '😱', name: 'Shocked' },
      { id: 'ef-12', emoji: '🤗', name: 'Hugging' },
    ],
  },
  {
    id: 'hand-gestures',
    name: 'Hand Gestures',
    icon: '👋',
    stickers: [
      { id: 'hg-1', emoji: '👋', name: 'Wave' },
      { id: 'hg-2', emoji: '👍', name: 'Thumbs Up' },
      { id: 'hg-3', emoji: '👎', name: 'Thumbs Down' },
      { id: 'hg-4', emoji: '✌️', name: 'Peace' },
      { id: 'hg-5', emoji: '🤞', name: 'Fingers Crossed' },
      { id: 'hg-6', emoji: '👏', name: 'Clap' },
      { id: 'hg-7', emoji: '🙌', name: 'Celebration' },
      { id: 'hg-8', emoji: '💪', name: 'Strong' },
      { id: 'hg-9', emoji: '🤝', name: 'Handshake' },
      { id: 'hg-10', emoji: '🫶', name: 'Heart Hands' },
      { id: 'hg-11', emoji: '👊', name: 'Fist Bump' },
      { id: 'hg-12', emoji: '🤙', name: 'Call Me' },
    ],
  },
  {
    id: 'animals',
    name: 'Animals',
    icon: '🐱',
    stickers: [
      { id: 'an-1', emoji: '🐱', name: 'Cat' },
      { id: 'an-2', emoji: '🐶', name: 'Dog' },
      { id: 'an-3', emoji: '🦊', name: 'Fox' },
      { id: 'an-4', emoji: '🐻', name: 'Bear' },
      { id: 'an-5', emoji: '🐼', name: 'Panda' },
      { id: 'an-6', emoji: '🦁', name: 'Lion' },
      { id: 'an-7', emoji: '🐸', name: 'Frog' },
      { id: 'an-8', emoji: '🐙', name: 'Octopus' },
      { id: 'an-9', emoji: '🦋', name: 'Butterfly' },
      { id: 'an-10', emoji: '🐢', name: 'Turtle' },
      { id: 'an-11', emoji: '🦄', name: 'Unicorn' },
      { id: 'an-12', emoji: '🐧', name: 'Penguin' },
    ],
  },
  {
    id: 'hearts-love',
    name: 'Hearts & Love',
    icon: '❤️',
    stickers: [
      { id: 'hl-1', emoji: '❤️', name: 'Red Heart' },
      { id: 'hl-2', emoji: '💖', name: 'Sparkling Heart' },
      { id: 'hl-3', emoji: '💕', name: 'Two Hearts' },
      { id: 'hl-4', emoji: '💘', name: 'Cupid' },
      { id: 'hl-5', emoji: '💝', name: 'Gift Heart' },
      { id: 'hl-6', emoji: '🔥', name: 'Fire' },
      { id: 'hl-7', emoji: '✨', name: 'Sparkles' },
      { id: 'hl-8', emoji: '🌟', name: 'Star' },
      { id: 'hl-9', emoji: '💫', name: 'Dizzy' },
      { id: 'hl-10', emoji: '🫂', name: 'Hug' },
      { id: 'hl-11', emoji: '💋', name: 'Kiss' },
      { id: 'hl-12', emoji: '🥂', name: 'Cheers' },
    ],
  },
  {
    id: 'food-drinks',
    name: 'Food & Drinks',
    icon: '🍕',
    stickers: [
      { id: 'fd-1', emoji: '🍕', name: 'Pizza' },
      { id: 'fd-2', emoji: '🍔', name: 'Burger' },
      { id: 'fd-3', emoji: '☕', name: 'Coffee' },
      { id: 'fd-4', emoji: '🍰', name: 'Cake' },
      { id: 'fd-5', emoji: '🍦', name: 'Ice Cream' },
      { id: 'fd-6', emoji: '🧋', name: 'Boba' },
      { id: 'fd-7', emoji: '🍩', name: 'Donut' },
      { id: 'fd-8', emoji: '🌮', name: 'Taco' },
      { id: 'fd-9', emoji: '🍣', name: 'Sushi' },
      { id: 'fd-10', emoji: '🥤', name: 'Drink' },
      { id: 'fd-11', emoji: '🍪', name: 'Cookie' },
      { id: 'fd-12', emoji: '🧁', name: 'Cupcake' },
    ],
  },
];

// Get all sticker packs
router.get('/packs', auth, (req, res) => {
  res.json({ packs: stickerPacks });
});

// Get stickers from a specific pack
router.get('/packs/:packId', auth, (req, res) => {
  const pack = stickerPacks.find((p) => p.id === req.params.packId);
  if (!pack) {
    return res.status(404).json({ error: 'Sticker pack not found' });
  }
  res.json({ pack });
});

module.exports = router;
