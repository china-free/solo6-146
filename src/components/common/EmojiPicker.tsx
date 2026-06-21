import { useState } from 'react';
import { X } from 'lucide-react';

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

const EMOJI_CATEGORIES = {
  '😀': {
    label: '笑脸',
    emojis: [
      '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂',
      '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩',
      '😘', '😗', '😚', '😋', '😛', '😜', '🤪', '😝',
      '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑',
    ],
  },
  '👋': {
    label: '手势',
    emojis: [
      '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏',
      '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆',
      '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛',
      '🤜', '👏', '🙌', '👐', '🤲', '🙏', '💪', '🦾',
    ],
  },
  '🎉': {
    label: '活动',
    emojis: [
      '🎉', '🎊', '🎈', '🎁', '🎀', '🎂', '🍰', '🧁',
      '🎆', '🎇', '✨', '🌟', '⭐', '💫', '🔥', '💥',
      '💯', '🏆', '🥇', '🥈', '🥉', '🎯', '🎲', '🎮',
      '🎸', '🎹', '🎺', '🎻', '🎬', '🎤', '🎧', '🎨',
    ],
  },
  '🐶': {
    label: '动物',
    emojis: [
      '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
      '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🙈',
      '🙉', '🙊', '🐔', '🐧', '🐦', '🐤', '🦆', '🦅',
      '🦉', '🐺', '🐗', '🐴', '🦄', '🐝', '🦋', '🐌',
    ],
  },
  '🍔': {
    label: '食物',
    emojis: [
      '🍔', '🍟', '🍕', '🌭', '🥪', '🌮', '🌯', '🥙',
      '🍜', '🍝', '🍛', '🍣', '🍱', '🥟', '🍤', '🍙',
      '🍚', '🍘', '🥠', '🥮', '🍡', '🍧', '🍨', '🍦',
      '🥧', '🍩', '🍪', '🎂', '🍰', '🧁', '🍫', '🍬',
    ],
  },
  '🚗': {
    label: '出行',
    emojis: [
      '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑',
      '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🚲', '🛵',
      '🏍️', '🛺', '🚨', '🚔', '🚍', '🚘', '🚖', '🚡',
      '🚠', '🚟', '🚃', '🚋', '🚞', '🚝', '🚄', '🚅',
    ],
  },
  '💡': {
    label: '物品',
    emojis: [
      '💡', '🔦', '🕯️', '📱', '💻', '⌨️', '🖥️', '🖨️',
      '🖱️', '🖲️', '🕹️', '🗜️', '💽', '💾', '💿', '📀',
      '📷', '📸', '📹', '🎥', '📽️', '🎞️', '📞', '☎️',
      '📟', '📺', '📻', '🎙️', '🎚️', '🎛️', '🧭', '⏱️',
    ],
  },
  '🏆': {
    label: '符号',
    emojis: [
      '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍',
      '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘',
      '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️',
      '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉',
    ],
  },
};

type CategoryKey = keyof typeof EMOJI_CATEGORIES;

export default function EmojiPicker({ onSelect, onClose }: EmojiPickerProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('😀');

  return (
    <div className="glass rounded-2xl border border-border-neon shadow-card-glow z-50 max-w-md w-full max-h-80 flex flex-col animate-fade-in-up">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-neon">
        <h3 className="font-display text-lg text-white">选择表情</h3>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-gray-400 hover:text-neon-pink hover:bg-neon-pink/10 transition-all duration-200"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex gap-1 px-4 py-2 border-b border-border-neon overflow-x-auto">
        {Object.entries(EMOJI_CATEGORIES).map(([icon, { label }]) => (
          <button
            key={icon}
            onClick={() => setActiveCategory(icon as CategoryKey)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
              activeCategory === icon
                ? 'bg-gradient-neon text-white shadow-neon-pink'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
            title={label}
          >
            <span className="text-lg">{icon}</span>
            <span className="text-[10px]">{label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-8 gap-1">
          {EMOJI_CATEGORIES[activeCategory].emojis.map((emoji, index) => (
            <button
              key={`${emoji}-${index}`}
              onClick={() => onSelect(emoji)}
              className="text-2xl p-2 rounded-lg hover:bg-neon-pink/20 hover:scale-125 transition-all duration-200 aspect-square flex items-center justify-center"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
