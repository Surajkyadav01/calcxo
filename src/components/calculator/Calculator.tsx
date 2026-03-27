import React, { useState, useCallback, useEffect } from 'react';
import { History, MoreVertical, ChevronUp, ChevronDown, Delete } from 'lucide-react';
import HistoryPanel from '@/components/calculator/HistoryPanel';
import ScientificPanel from '@/components/calculator/ScientificPanel';
import ThreeDotsMenu from '@/components/calculator/ThreeDotsMenu';
import PrivacyPolicyDialog from '@/components/calculator/PrivacyPolicyDialog';
import ThemeDialog from '@/components/calculator/ThemeDialog';

interface HistoryEntry {
  expression: string;
  result: string;
}

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showScientific, setShowScientific] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTheme, setShowTheme] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [lastResult, setLastResult] = useState('');

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleNumber = useCallback((num: string) => {
    if (display === '0' && num !== '.') {
      setDisplay(num);
    } else if (num === '.' && display.includes('.')) {
      return;
    } else {
      setDisplay(prev => prev + num);
    }
  }, [display]);

  const handleOperator = useCallback((op: string) => {
    setExpression(prev => {
      const expr = prev + display + ' ' + op + ' ';
      return expr;
    });
    setDisplay('0');
  }, [display]);

  const factorial = (n: number): number => {
    if (n < 0) return NaN;
    if (n <= 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
  };

  const evaluateExpression = useCallback((expr: string): string => {
    try {
      // Replace display symbols with JS operators
      let evalExpr = expr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/−/g, '-');
      
      // Evaluate using Function constructor (safe for calculator)
      const result = new Function('return ' + evalExpr)();
      if (typeof result === 'number' && isFinite(result)) {
        return result % 1 !== 0 ? parseFloat(result.toFixed(10)).toString() : result.toString();
      }
      return 'Error';
    } catch {
      return 'Error';
    }
  }, []);

  const handleEquals = useCallback(() => {
    const fullExpr = expression + display;
    const result = evaluateExpression(fullExpr);
    
    const displayExpr = fullExpr.replace(/\*/g, '×').replace(/\//g, '÷').replace(/-/g, '−');
    
    setHistory(prev => [{ expression: displayExpr, result }, ...prev]);
    setLastResult(result);
    setDisplay(result);
    setExpression('');
  }, [expression, display, evaluateExpression]);

  const handleClear = useCallback(() => {
    setDisplay('0');
    setExpression('');
  }, []);

  const handleBackspace = useCallback(() => {
    setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
  }, []);

  const handlePercent = useCallback(() => {
    const num = parseFloat(display);
    setDisplay((num / 100).toString());
  }, [display]);

  const handleParenthesis = useCallback(() => {
    const openCount = (expression + display).split('(').length - 1;
    const closeCount = (expression + display).split(')').length - 1;
    
    if (display === '0' || /[+\-×÷(]$/.test(expression.trim())) {
      setExpression(prev => prev + '(');
    } else if (openCount > closeCount) {
      setDisplay(prev => prev + ')');
    } else {
      setExpression(prev => prev + display + '×(');
      setDisplay('0');
    }
  }, [display, expression]);

  const handleScientific = useCallback((func: string) => {
    const num = parseFloat(display);
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
    
    setDisplay(isFinite(result) ? parseFloat(result.toFixed(10)).toString() : 'Error');
  }, [display, handleOperator]);

  const handleGST = useCallback((rate: number) => {
    const num = parseFloat(display);
    const gst = num * rate / 100;
    const total = num + gst;
    const expr = `${num} + ${rate}% GST`;
    setHistory(prev => [{ expression: expr, result: total.toFixed(2) }, ...prev]);
    setDisplay(total.toFixed(2));
    setExpression('');
  }, [display]);

  const handleDiscount = useCallback((rate: number) => {
    const num = parseFloat(display);
    const discount = num * rate / 100;
    const total = num - discount;
    const expr = `${num} - ${rate}% Discount`;
    setHistory(prev => [{ expression: expr, result: total.toFixed(2) }, ...prev]);
    setDisplay(total.toFixed(2));
    setExpression('');
  }, [display]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    setShowMenu(false);
  }, []);

  const formatDisplay = (val: string) => {
    if (val === 'Error') return val;
    const num = parseFloat(val);
    if (isNaN(num)) return val;
    if (val.includes('.') && val.endsWith('0')) return val;
    if (val.endsWith('.')) return val;
    return num.toLocaleString('en-IN');
  };

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
            setDisplay(entry.result);
            setExpression('');
            setShowHistory(false);
          }}
        />
      )}

      {/* Display */}
      <div className="flex-1 flex flex-col justify-end px-6 pb-2">
        {expression && (
          <div className="text-right text-muted-foreground text-lg truncate">
            {expression}
          </div>
        )}
        {lastResult && !expression && display !== '0' && (
          <div className="text-right text-muted-foreground text-lg">
            {/* show previous expression */}
          </div>
        )}
        <div className="text-right text-foreground text-5xl font-light tracking-tight truncate leading-tight pb-2">
          {formatDisplay(display)}
        </div>
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
        {/* Row 1 */}
        <CalcButton label="AC" type="primary" onClick={handleClear} />
        <CalcButton label="( )" type="function" onClick={handleParenthesis} />
        <CalcButton label="%" type="function" onClick={handlePercent} />
        <CalcButton label="÷" type="operator" onClick={() => handleOperator('/')} />

        {/* Row 2 */}
        <CalcButton label="7" type="number" onClick={() => handleNumber('7')} />
        <CalcButton label="8" type="number" onClick={() => handleNumber('8')} />
        <CalcButton label="9" type="number" onClick={() => handleNumber('9')} />
        <CalcButton label="×" type="operator" onClick={() => handleOperator('*')} />

        {/* Row 3 */}
        <CalcButton label="4" type="number" onClick={() => handleNumber('4')} />
        <CalcButton label="5" type="number" onClick={() => handleNumber('5')} />
        <CalcButton label="6" type="number" onClick={() => handleNumber('6')} />
        <CalcButton label="−" type="operator" onClick={() => handleOperator('-')} />

        {/* Row 4 */}
        <CalcButton label="1" type="number" onClick={() => handleNumber('1')} />
        <CalcButton label="2" type="number" onClick={() => handleNumber('2')} />
        <CalcButton label="3" type="number" onClick={() => handleNumber('3')} />
        <CalcButton label="+" type="operator" onClick={() => handleOperator('+')} />

        {/* Row 5 */}
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
  icon?: React.ReactNode;
}

const CalcButton: React.FC<CalcButtonProps> = ({ label, type, onClick, icon }) => {
  const baseClasses = "rounded-full flex items-center justify-center font-normal active:scale-95 transition-all duration-100 aspect-square text-2xl";
  
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
      onClick={onClick}
    >
      {icon || label}
    </button>
  );
};

export default Calculator;
