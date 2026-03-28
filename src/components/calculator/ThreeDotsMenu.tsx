import React, { useEffect, useRef } from 'react';
import { Trash2, Palette, Shield, MessageSquare, HelpCircle } from 'lucide-react';

interface ThreeDotsMenuProps {
  onClose: () => void;
  onClearHistory: () => void;
  onChooseTheme: () => void;
  onPrivacyPolicy: () => void;
  onSendFeedback: () => void;
  onHelp: () => void;
}

const ThreeDotsMenu: React.FC<ThreeDotsMenuProps> = ({
  onClose, onClearHistory, onChooseTheme, onPrivacyPolicy, onSendFeedback, onHelp
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const items = [
    { icon: <Trash2 size={18} />, label: 'Clear history', action: onClearHistory },
    { icon: <Palette size={18} />, label: 'Choose theme', action: onChooseTheme },
    { icon: <Shield size={18} />, label: 'Privacy policy', action: onPrivacyPolicy },
    { icon: <MessageSquare size={18} />, label: 'Send feedback', action: onSendFeedback },
    { icon: <HelpCircle size={18} />, label: 'Help', action: onHelp },
  ];

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-1 bg-muted rounded-2xl shadow-xl z-30 py-3 min-w-[220px] animate-fade-in"
    >
      {items.map((item, i) => (
        <button
          key={i}
          className="w-full flex items-center gap-3 px-5 py-3.5 text-foreground hover:bg-border transition-colors text-base"
          onClick={item.action}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default ThreeDotsMenu;
