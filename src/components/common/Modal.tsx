import { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-2xl',
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />

      <div
        className={`relative glass rounded-2xl ${maxWidth} w-full mx-4 animate-scale-in shadow-card-glow`}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-border-neon">
            <h2 className="font-display text-xl text-white">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-neon-pink hover:bg-neon-pink/10 hover:shadow-neon-pink transition-all duration-300"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {!title && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:text-neon-pink hover:bg-neon-pink/10 hover:shadow-neon-pink transition-all duration-300 z-10"
          >
            <X size={20} />
          </button>
        )}

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
