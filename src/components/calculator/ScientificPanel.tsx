import React, { useState } from 'react';

interface ScientificPanelProps {
  onFunction: (func: string) => void;
  onGST: (rate: number) => void;
  onDiscount: (rate: number) => void;
}

const ScientificPanel: React.FC<ScientificPanelProps> = ({ onFunction, onGST, onDiscount }) => {
  const [showGSTOptions, setShowGSTOptions] = useState(false);
  const [showDiscountOptions, setShowDiscountOptions] = useState(false);
  const [isInverse, setIsInverse] = useState(false);

  const btnClass = "rounded-xl flex items-center justify-center bg-calc-function text-calc-function-foreground text-sm font-medium py-3 active:scale-95 transition-all";

  return (
    <div className="px-3 pb-2 animate-slide-up">
      <div className="grid grid-cols-4 gap-2 mb-2">
        <button className={btnClass} onClick={() => onFunction('√')}>√</button>
        <button className={btnClass} onClick={() => onFunction('π')}>π</button>
        <button className={btnClass} onClick={() => onFunction('^')}>^</button>
        <button className={btnClass} onClick={() => onFunction('!')}>!</button>
      </div>
      <div className="grid grid-cols-4 gap-2 mb-2">
        <button className={btnClass} onClick={() => setIsInverse(!isInverse)}>
          {isInverse ? 'Deg' : 'Deg'}
        </button>
        <button className={btnClass} onClick={() => onFunction(isInverse ? 'asin' : 'sin')}>
          {isInverse ? 'sin⁻¹' : 'sin'}
        </button>
        <button className={btnClass} onClick={() => onFunction(isInverse ? 'acos' : 'cos')}>
          {isInverse ? 'cos⁻¹' : 'cos'}
        </button>
        <button className={btnClass} onClick={() => onFunction(isInverse ? 'atan' : 'tan')}>
          {isInverse ? 'tan⁻¹' : 'tan'}
        </button>
      </div>
      <div className="grid grid-cols-4 gap-2 mb-2">
        <button className={btnClass} onClick={() => setIsInverse(!isInverse)}>Inv</button>
        <button className={btnClass} onClick={() => onFunction('e')}>e</button>
        <button className={btnClass} onClick={() => onFunction('ln')}>ln</button>
        <button className={btnClass} onClick={() => onFunction('log')}>log</button>
      </div>
      <div className="grid grid-cols-4 gap-2 mb-2">
        <button className={btnClass} onClick={() => onFunction('x²')}>x²</button>
        <div className="relative">
          <button className={`${btnClass} w-full`} onClick={() => setShowGSTOptions(!showGSTOptions)}>
            GST
          </button>
          {showGSTOptions && (
            <div className="absolute bottom-full left-0 mb-1 bg-popover rounded-lg shadow-lg p-2 z-30 min-w-[120px]">
              {[5, 12, 18, 28].map(rate => (
                <button
                  key={rate}
                  className="w-full text-left px-3 py-2 text-sm text-popover-foreground hover:bg-muted rounded"
                  onClick={() => { onGST(rate); setShowGSTOptions(false); }}
                >
                  +{rate}% GST
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="relative">
          <button className={`${btnClass} w-full`} onClick={() => setShowDiscountOptions(!showDiscountOptions)}>
            Disc
          </button>
          {showDiscountOptions && (
            <div className="absolute bottom-full left-0 mb-1 bg-popover rounded-lg shadow-lg p-2 z-30 min-w-[120px]">
              {[5, 10, 15, 20, 25, 50].map(rate => (
                <button
                  key={rate}
                  className="w-full text-left px-3 py-2 text-sm text-popover-foreground hover:bg-muted rounded"
                  onClick={() => { onDiscount(rate); setShowDiscountOptions(false); }}
                >
                  -{rate}% Off
                </button>
              ))}
            </div>
          )}
        </div>
        <button className={btnClass} onClick={() => onFunction('√')}>∛</button>
      </div>
    </div>
  );
};

export default ScientificPanel;
