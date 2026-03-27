import React from 'react';
import { X } from 'lucide-react';

interface HistoryEntry {
  expression: string;
  result: string;
}

interface HistoryPanelProps {
  history: HistoryEntry[];
  onClose: () => void;
  onSelect: (entry: HistoryEntry) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onClose, onSelect }) => {
  return (
    <div className="absolute left-0 right-0 top-16 z-20 mx-2 bg-calc-history-bg rounded-2xl shadow-lg animate-fade-in max-h-[45vh] flex flex-col overflow-hidden">
      <div className="flex justify-between items-center px-4 py-2 border-b border-border">
        <h2 className="text-sm font-medium text-foreground">History</h2>
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-foreground">
          <X size={16} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4">
        {history.length === 0 ? (
          <p className="text-muted-foreground text-center text-sm py-6">No history yet</p>
        ) : (
          history.map((entry, i) => (
            <button
              key={i}
              onClick={() => onSelect(entry)}
              className="w-full text-right py-2 border-b border-border last:border-b-0"
            >
              <div className="text-muted-foreground text-xs">{entry.expression}</div>
              <div className="text-foreground text-lg font-light">{parseFloat(entry.result).toLocaleString('en-IN')}</div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryPanel;
