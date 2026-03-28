import React, { useState, useCallback, useEffect } from 'react';
import { History, MoreVertical, ChevronUp, ChevronDown, Delete } from 'lucide-react';
import HistoryPanel from '@/components/calculator/HistoryPanel';
import ScientificPanel from '@/components/calculator/ScientificPanel';
import ThreeDotsMenu from '@/components/calculator/ThreeDotsMenu';
import PrivacyPolicyDialog from '@/components/calculator/PrivacyPolicyDialog';
import ThemeDialog from '@/components/calculator/ThemeDialog';

export interface HistoryEntry {
  expression: string;
  result: string;
  timestamp: number;
}

const Calculator: React.FC = () => {
  const [currentInput, setCurrentInput] = useState('');
  const [fullExpression, setFullExpression] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showScientific, setShowScientific] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTheme, setShowTheme] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [justEvaluated, setJustEvaluated] = useState(false);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const handleNumber = useCallback((num: string) => {
    if (justEvaluated) {
      setCurrentInput(num === '.' ? '0.' : num);
      setFullExpression('');
      setJustEvaluated(false);
      setWaitingForOperand(false);
      return;
    }

    if (waitingForOperand) {
      setCurrentInput(num === '.' ? '0.' : num);
      setWaitingForOperand(false);
      return;
    }

    if (currentInput === '0' && num !== '.') {
      setCurrentInput(num);
    } else if (num === '.' && currentInput.includes('.')) {
      return;
    } else {
      setCurrentInput(prev => prev + num);
    }
  }, [currentInput, justEvaluated, waitingForOperand]);

  const handleOperator = useCallback((op: string) => {
    const opSymbol = op === '*' ? '×' : op === '/' ? '÷' : op === '-' ? '−' : op;

    if (justEvaluated) {
      setFullExpression(currentInput + ' ' + opSymbol + ' ');
      setJustEvaluated(false);
      setWaitingForOperand(true);
      return;
    }

    if (waitingForOperand) {
      setFullExpression(prev => prev.replace(/[+−×÷^]\s*$/, '').trim() + ' ' + opSymbol + ' ');
      return;
    }

    const inputVal = currentInput || '0';
    setFullExpression(prev => prev + inputVal + ' ' + opSymbol + ' ');
    setWaitingForOperand(true);
  }, [currentInput, justEvaluated, waitingForOperand]);

  const factorial = (n: number): number => {
    if (n < 0) return NaN;
    if (n <= 1) return 1;
    let r = 1;
    for (let i = 2; i <= n; i++) r *= i;
    return r;
  };

  const safeEvaluate = useCallback((expr: string): string => {
    try {
      let evalExpr = expr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/−/g, '-')
        .replace(/\^/g, '**');
      evalExpr = evalExpr.replace(/[\s+\-*/]+$/, '').trim();
      if (!evalExpr) return '0';
      const result = new Function('return (' + evalExpr + ')')();
      if (typeof result === 'number' && isFinite(result)) {
        return parseFloat(result.toFixed(10)).toString();
      }
      return 'Error';
    } catch {
      return 'Error';
    }
  }, []);

  const handleEquals = useCallback(() => {
    const inputVal = currentInput || '0';
    const fullExpr = fullExpression + inputVal;
    if (!fullExpression.trim()) return;

    const result = safeEvaluate(fullExpr);
    setHistory(prev => [{ expression: fullExpr, result, timestamp: Date.now() }, ...prev]);
    setCurrentInput(result);
    setFullExpression('');
    setJustEvaluated(true);
    setWaitingForOperand(false);
  }, [fullExpression, currentInput, safeEvaluate]);

  const handleClear = useCallback(() => {
    setCurrentInput('');
    setFullExpression('');
    setJustEvaluated(false);
    setWaitingForOperand(false);
  }, []);

  const handleBackspace = useCallback(() => {
    if (justEvaluated) {
      // Delete from result
      if (currentInput.length > 1) {
        setCurrentInput(prev => prev.slice(0, -1));
      } else {
        setCurrentInput('');
      }
      setJustEvaluated(false);
      return;
    }

    if (waitingForOperand) {
      // Remove last operator from fullExpression
      const trimmed = fullExpression.trimEnd();
      if (trimmed.length > 0) {
        // Remove the last operator and space
        const newExpr = trimmed.replace(/\s*[+−×÷^]\s*$/, '');
        if (newExpr === '') {
          // Nothing left in expression, restore the number
          setFullExpression('');
          setWaitingForOperand(false);
          // The number before operator is in the expression, extract it
          const parts = trimmed.split(/\s+/);
          if (parts.length >= 1) {
            setCurrentInput(parts[parts.length - 2] || parts[0] || '');
          }
        } else {
          // There's still expression left, extract last number
          const parts = newExpr.split(/\s+/);
          const lastNum = parts.pop() || '';
          const remainingExpr = parts.join(' ');
          setFullExpression(remainingExpr ? remainingExpr + ' ' : '');
          setCurrentInput(lastNum);
          setWaitingForOperand(false);
        }
      }
      return;
    }

    // Normal: delete from currentInput
    if (currentInput.length > 1) {
      setCurrentInput(prev => prev.slice(0, -1));
    } else if (currentInput.length === 1) {
      setCurrentInput('');
      // If there's expression, try to go back
      if (fullExpression.trim()) {
        const trimmed = fullExpression.trimEnd();
        const parts = trimmed.split(/\s+/);
        if (parts.length >= 2) {
          // Remove last operator and get the number before it
          parts.pop(); // remove operator
          const lastNum = parts.pop() || '';
          setFullExpression(parts.length > 0 ? parts.join(' ') + ' ' : '');
          setCurrentInput(lastNum);
          setWaitingForOperand(false);
        } else if (parts.length === 1) {
          setCurrentInput(parts[0]);
          setFullExpression('');
        }
      }
    }
  }, [currentInput, fullExpression, justEvaluated, waitingForOperand]);

  const handlePercent = useCallback(() => {
    const num = parseFloat(currentInput || '0');
    if (!isNaN(num)) {
      setCurrentInput((num / 100).toString());
      setJustEvaluated(false);
    }
  }, [currentInput]);

  const handleParenthesis = useCallback(() => {
    if (justEvaluated) {
      setFullExpression('(');
      setCurrentInput('');
      setJustEvaluated(false);
      setWaitingForOperand(true);
      return;
    }

    const combined = fullExpression + currentInput;
    const openCount = (combined.match(/\(/g) || []).length;
    const closeCount = (combined.match(/\)/g) || []).length;

    if (waitingForOperand || !currentInput) {
      setFullExpression(prev => prev + '(');
    } else if (openCount > closeCount) {
      setCurrentInput(prev => prev + ')');
    } else {
      setFullExpression(prev => prev + currentInput + ' × (');
      setCurrentInput('');
      setWaitingForOperand(true);
    }
  }, [currentInput, fullExpression, justEvaluated, waitingForOperand]);

  const handleScientific = useCallback((func: string) => {
    const num = parseFloat(currentInput || '0');
    let result: number;
    switch (func) {
      case 'sin': result = Math.sin(num * Math.PI / 180); break;
      case 'cos': result = Math.cos(num * Math.PI / 180); break;
      case 'tan': result = Math.tan(num * Math.PI / 180); break;
      case 'asin': result = Math.asin(num) * 180 / Math.PI; break;
      case 'acos': result = Math.acos(num) * 180 / Math.PI; break;
      case 'atan': result = Math.atan(num) * 180 / Math.PI; break;
      case 'ln': result = Math.log(num); break;
      case 'log': result = Math.log10(num); break;
      case '√': result = Math.sqrt(num); break;
      case 'π': result = Math.PI; break;
      case 'e': result = Math.E; break;
      case '!': result = factorial(num); break;
      case '^': handleOperator('^'); return;
      case 'x²': result = num * num; break;
      default: return;
    }
    setCurrentInput(isFinite(result) ? parseFloat(result.toFixed(10)).toString() : 'Error');
    setJustEvaluated(false);
    setWaitingForOperand(false);
  }, [currentInput, handleOperator]);

  const handleGST = useCallback((rate: number) => {
    const num = parseFloat(currentInput || '0');
    if (isNaN(num)) return;
    const total = num + (num * rate / 100);
    const expr = `${num} + ${rate}% GST`;
    setHistory(prev => [{ expression: expr, result: total.toFixed(2), timestamp: Date.now() }, ...prev]);
    setCurrentInput(total.toFixed(2));
    setFullExpression('');
    setJustEvaluated(true);
    setWaitingForOperand(false);
  }, [currentInput]);

  const handleDiscount = useCallback((rate: number) => {
    const num = parseFloat(currentInput || '0');
    if (isNaN(num)) return;
    const total = num - (num * rate / 100);
    const expr = `${num} - ${rate}% Discount`;
    setHistory(prev => [{ expression: expr, result: total.toFixed(2), timestamp: Date.now() }, ...prev]);
    setCurrentInput(total.toFixed(2));
    setFullExpression('');
    setJustEvaluated(true);
    setWaitingForOperand(false);
  }, [currentInput]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    setShowMenu(false);
  }, []);

  const formatDisplay = (val: string) => {
    if (!val) return '';
    if (val === 'Error') return val;
    if (val.endsWith('.')) return val;
    const num = parseFloat(val);
    if (isNaN(num)) return val;
    const parts = val.split('.');
    const formatted = parseInt(parts[0], 10).toLocaleString('en-IN');
    return parts.length > 1 ? formatted + '.' + parts[1] : formatted;
  };

  const isEmpty = !currentInput && !fullExpression;

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-calc-display relative select-none">
      {/* Top Bar */}
      <div className="flex justify-between items-center px-4 pt-4 pb-2">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="w-12 h-12 rounded-full flex items-center justify-center bg-secondary text-secondary-foreground active:opacity-70 transition-opacity"
        >
          <History size={22} />
        </button>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-12 h-12 rounded-full flex items-center justify-center text-foreground active:opacity-70 transition-opacity"
          >
            <MoreVertical size={22} />
          </button>
          {showMenu && (
            <ThreeDotsMenu
              onClose={() => setShowMenu(false)}
              onClearHistory={clearHistory}
              onChooseTheme={() => { setShowTheme(true); setShowMenu(false); }}
              onPrivacyPolicy={() => { setShowPrivacy(true); setShowMenu(false); }}
              onSendFeedback={() => {
                window.open('https://wa.me/916393869405?text=I%20want%20to%20send%20feedback%20about%20the%20calculator', '_blank');
                setShowMenu(false);
              }}
              onHelp={() => {
                window.open('https://wa.me/916393869405?text=I%20want%20help', '_blank');
                setShowMenu(false);
              }}
            />
          )}
        </div>
      </div>

      {/* History Panel */}
      {showHistory && (
        <HistoryPanel
          history={history}
          onClose={() => setShowHistory(false)}
          onSelect={(entry) => {
            setCurrentInput(entry.result);
            setFullExpression('');
            setJustEvaluated(true);
            setShowHistory(false);
          }}
        />
      )}

      {/* Display */}
      <div className="flex-1 flex flex-col justify-end px-6 pb-2">
        {fullExpression && (
          <div className="text-right text-foreground text-4xl font-normal tracking-tight truncate leading-tight">
            {fullExpression}{!waitingForOperand && formatDisplay(currentInput)}
          </div>
        )}
        {/* Result preview when typing formula */}
        {fullExpression && !justEvaluated && (
          <div className="text-right text-muted-foreground text-2xl truncate mt-1">
            {(() => {
              const inputVal = currentInput || '0';
              const preview = safeEvaluate(fullExpression + inputVal);
              return preview !== 'Error' ? formatDisplay(preview) : '';
            })()}
          </div>
        )}
        {/* Main display when no expression */}
        {!fullExpression && (
          <div className="text-right text-foreground text-6xl font-light tracking-tight truncate leading-tight pb-2">
            {isEmpty ? (
              <span className="inline-block w-[3px] h-16 bg-primary animate-blink align-middle" />
            ) : (
              formatDisplay(currentInput)
            )}
          </div>
        )}
      </div>

      {/* Scientific Toggle */}
      <div className="flex justify-start px-4 pb-1">
        <button
          onClick={() => setShowScientific(!showScientific)}
          className="w-10 h-10 flex items-center justify-center text-foreground active:opacity-70"
        >
          {showScientific ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        </button>
      </div>

      {/* Scientific Panel */}
      {showScientific && (
        <ScientificPanel
          onFunction={handleScientific}
          onGST={handleGST}
          onDiscount={handleDiscount}
        />
      )}

      {/* Button Grid */}
      <div className="grid grid-cols-4 gap-2 p-3 pb-6">
        <CalcButton label="AC" type="primary" onClick={handleClear} />
        <CalcButton label="( )" type="function" onClick={handleParenthesis} />
        <CalcButton label="%" type="function" onClick={handlePercent} />
        <CalcButton label="÷" type="operator" onClick={() => handleOperator('/')} />

        <CalcButton label="7" type="number" onClick={() => handleNumber('7')} />
        <CalcButton label="8" type="number" onClick={() => handleNumber('8')} />
        <CalcButton label="9" type="number" onClick={() => handleNumber('9')} />
        <CalcButton label="×" type="operator" onClick={() => handleOperator('*')} />

        <CalcButton label="4" type="number" onClick={() => handleNumber('4')} />
        <CalcButton label="5" type="number" onClick={() => handleNumber('5')} />
        <CalcButton label="6" type="number" onClick={() => handleNumber('6')} />
        <CalcButton label="−" type="operator" onClick={() => handleNumber('-')} isNegative onClick2={() => handleOperator('-')} />

        <CalcButton label="1" type="number" onClick={() => handleNumber('1')} />
        <CalcButton label="2" type="number" onClick={() => handleNumber('2')} />
        <CalcButton label="3" type="number" onClick={() => handleNumber('3')} />
        <CalcButton label="+" type="operator" onClick={() => handleOperator('+')} />

        <CalcButton label="0" type="number" onClick={() => handleNumber('0')} />
        <CalcButton label="." type="number" onClick={() => handleNumber('.')} />
        <CalcButton
          label="⌫"
          type="number"
          onClick={handleBackspace}
          icon={<Delete size={22} />}
        />
        <CalcButton label="=" type="equals" onClick={handleEquals} />
      </div>

      {/* Dialogs */}
      {showPrivacy && <PrivacyPolicyDialog onClose={() => setShowPrivacy(false)} />}
      {showTheme && (
        <ThemeDialog
          isDark={isDark}
          onToggle={setIsDark}
          onClose={() => setShowTheme(false)}
        />
      )}
    </div>
  );
};

interface CalcButtonProps {
  label: string;
  type: 'number' | 'operator' | 'function' | 'primary' | 'equals';
  onClick: () => void;
  onClick2?: () => void;
  icon?: React.ReactNode;
  isNegative?: boolean;
}

const CalcButton: React.FC<CalcButtonProps> = ({ label, type, onClick, onClick2, icon }) => {
  const baseClasses = "rounded-full flex items-center justify-center font-normal active:scale-95 transition-all duration-100 aspect-square text-3xl";
  
  const typeClasses = {
    number: "bg-calc-number text-calc-number-foreground",
    operator: "bg-calc-operator text-calc-operator-foreground",
    function: "bg-calc-function text-calc-function-foreground",
    primary: "bg-primary text-primary-foreground",
    equals: "bg-calc-equals text-calc-equals-foreground",
  };

  return (
    <button
      className={`${baseClasses} ${typeClasses[type]}`}
      onClick={onClick2 || onClick}
    >
      {icon || label}
    </button>
  );
};

export default Calculator;
