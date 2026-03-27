import React from 'react';
import { Sun, Moon, X } from 'lucide-react';

interface ThemeDialogProps {
  isDark: boolean;
  onToggle: (dark: boolean) => void;
  onClose: () => void;
}

const ThemeDialog: React.FC<ThemeDialogProps> = ({ isDark, onToggle, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-popover rounded-2xl max-w-xs w-full p-6 animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-popover-foreground">Choose Theme</h2>
          <button onClick={onClose} className="text-muted-foreground">
            <X size={20} />
          </button>
        </div>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => { onToggle(false); onClose(); }}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${!isDark ? 'bg-primary text-primary-foreground ring-2 ring-primary' : 'bg-muted text-muted-foreground'}`}
          >
            <Sun size={28} />
            <span className="text-sm font-medium">Light</span>
          </button>
          <button
            onClick={() => { onToggle(true); onClose(); }}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${isDark ? 'bg-primary text-primary-foreground ring-2 ring-primary' : 'bg-muted text-muted-foreground'}`}
          >
            <Moon size={28} />
            <span className="text-sm font-medium">Dark</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThemeDialog;
