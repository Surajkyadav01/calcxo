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
    <div className="absolute inset-0 z-20 bg-calc-history-bg animate-fade-in flex flex-col">
      <div className="flex justify-between items-center px-4 py-3">
        <h2 className="text-lg font-medium text-foreground">History</h2>
        <button onClick={onClose} className="w-10 h-10 flex items-center justify-center text-foreground">
          <X size={20} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4">
        {history.length === 0 ? (
          <p className="text-muted-foreground text-center mt-10">No history yet</p>
        ) : (
          history.map((entry, i) => (
            <button
              key={i}
              onClick={() => onSelect(entry)}
              className="w-full text-right py-3 border-b border-border"
            >
              <div className="text-muted-foreground text-sm">{entry.expression}</div>
              <div className="text-foreground text-2xl font-light">{parseFloat(entry.result).toLocaleString('en-IN')}</div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryPanel;
