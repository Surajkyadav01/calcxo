import React from 'react';
import { X } from 'lucide-react';
import type { HistoryEntry } from './Calculator';

interface HistoryPanelProps {
  history: HistoryEntry[];
  onClose: () => void;
  onSelect: (entry: HistoryEntry) => void;
}

const getDateLabel = (timestamp: number): string => {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  if (isSameDay(date, today)) return 'Today';
  if (isSameDay(date, yesterday)) return 'Yesterday';
  
  return date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });
};

const groupByDate = (entries: HistoryEntry[]): Record<string, HistoryEntry[]> => {
  const groups: Record<string, HistoryEntry[]> = {};
  entries.forEach(entry => {
    const label = getDateLabel(entry.timestamp);
    if (!groups[label]) groups[label] = [];
    groups[label].push(entry);
  });
  return groups;
};

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onClose, onSelect }) => {
  const grouped = groupByDate(history);

  return (
    <div className="absolute left-0 right-0 top-16 z-20 mx-2 bg-calc-history-bg rounded-2xl shadow-lg animate-fade-in max-h-[40vh] flex flex-col overflow-hidden">
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
          Object.entries(grouped).map(([dateLabel, entries]) => (
            <div key={dateLabel}>
              <p className="text-muted-foreground text-xs font-medium pt-3 pb-1">{dateLabel}</p>
              {entries.map((entry, i) => (
                <button
                  key={i}
                  onClick={() => onSelect(entry)}
                  className="w-full text-right py-2 border-b border-border last:border-b-0"
                >
                  <div className="text-muted-foreground text-xs">{entry.expression}</div>
                  <div className="text-foreground text-lg font-light">
                    {parseFloat(entry.result).toLocaleString('en-IN')}
                  </div>
                </button>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryPanel;
