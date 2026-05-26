import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Delete, Hash, RotateCcw } from 'lucide-react';

export default function StandardCalculator() {
  const [display, setDisplay] = useState('0');
  const [currentValue, setCurrentValue] = useState('');
  const [operator, setOperator] = useState<string | null>(null);
  const [prevValue, setPrevValue] = useState<string | null>(null);
  const [waitingForNewNumber, setWaitingForNewNumber] = useState(false);
  const [history, setHistory] = useState<string>('');

  const handleDigitClick = (digit: string) => {
    if (waitingForNewNumber) {
      setDisplay(digit);
      setCurrentValue(digit);
      setWaitingForNewNumber(false);
    } else if (display === '0' && digit !== '.') {
      setDisplay(digit);
      setCurrentValue(digit);
    } else {
      // Prevent multiple decimals
      if (digit === '.' && display.includes('.')) return;
      setDisplay((prev) => prev + digit);
      setCurrentValue((prev) => prev + digit);
    }
  };

  const handleOperatorClick = (nextOperator: string) => {
    if (currentValue !== '') {
      if (prevValue !== null && operator !== null) {
        const result = calculate(parseFloat(prevValue), parseFloat(currentValue), operator);
        setPrevValue(result.toString());
        setDisplay(result.toString());
        setHistory(`${prevValue} ${operator} ${currentValue} =`);
      } else {
        setPrevValue(currentValue);
        setHistory(`${currentValue} ${nextOperator}`);
      }
      setCurrentValue('');
    } else if (prevValue !== null) {
      setHistory(`${prevValue} ${nextOperator}`);
    } else {
      return; 
    }

    setOperator(nextOperator);
    setWaitingForNewNumber(true);
  };

  const handleEqualsClick = () => {
    if (prevValue === null || operator === null) return;

    let secondOperand = currentValue;
    if (currentValue === '') {
      secondOperand = prevValue;
    }

    const result = calculate(parseFloat(prevValue), parseFloat(secondOperand), operator);
    setHistory(`${prevValue} ${operator} ${secondOperand} =`);
    setDisplay(result.toString());
    setCurrentValue(result.toString());
    setPrevValue(null);
    setOperator(null);
    setWaitingForNewNumber(true);
  };

  const handleClearClick = () => {
    setDisplay('0');
    setCurrentValue('');
    setOperator(null);
    setPrevValue(null);
    setWaitingForNewNumber(false);
    setHistory('');
  };

  const handleBackspace = () => {
    if (waitingForNewNumber) return;
    if (display.length <= 1) {
      setDisplay('0');
      setCurrentValue('0');
    } else {
      const sliced = display.slice(0, -1);
      setDisplay(sliced);
      setCurrentValue(sliced);
    }
  };

  const handleToggleSignClick = () => {
    if (display === '0') return;
    const toggled = (parseFloat(display) * -1).toString();
    setDisplay(toggled);
    setCurrentValue(toggled);
  };

  const handlePercentageClick = () => {
    const value = parseFloat(display);
    if (!isNaN(value)) {
      const percentage = (value / 100).toString();
      setDisplay(percentage);
      setCurrentValue(percentage);
    }
  };

  const calculate = (num1: number, num2: number, op: string): number => {
    switch (op) {
      case '+':
        return num1 + num2;
      case '-':
        return num1 - num2;
      case '*':
        return num1 * num2;
      case '/':
        return num2 !== 0 ? num1 / num2 : 0;
      default:
        return num2;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-1">
      {/* Playful standard physical calculator framing with a unique modern yellow/blue twist */}
      <div className="relative bg-[#0051ba] border-[12px] border-[#ffd700] rounded-[38px] shadow-2xl p-6 w-full max-w-[370px] select-none overflow-hidden">
        {/* Playful brand name marker */}
        <div className="flex justify-between items-center mb-4 px-2">
          <span className="text-xxs font-extrabold text-[#ffd700] tracking-widest uppercase">TACTILE SUPER-CALC</span>
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
          </div>
        </div>

        {/* Display screen */}
        <div className="bg-[#121c2c] border-4 border-[#ffd700] rounded-2xl p-4 mb-5 text-right font-mono flex flex-col justify-between shadow-inner h-[96px] relative overflow-hidden">
          {/* Subtle grid background to look like ancient digital screens */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none"></div>
          
          <div className="text-[#ffd700] text-xs font-bold uppercase tracking-wider h-4 overflow-hidden truncate">
            {history || '0.00'}
          </div>

          <div className="text-emerald-400 text-3.5xl font-bold tracking-tight overflow-x-auto whitespace-nowrap scrollbar-none scroll-smooth">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={display}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.1 }}
                className="inline-block"
              >
                {display}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        {/* Buttons grid layout */}
        <div className="grid grid-cols-4 gap-3 bg-[#0d346b] p-3 rounded-2xl">
          {/* Function buttons: Bright golden yellow keys */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9, rotate: -2 }}
            onClick={handleClearClick}
            className="h-14 rounded-xl font-display font-extrabold text-sm shadow-md flex items-center justify-center cursor-pointer uppercase tracking-tight bg-[#ffd700] text-slate-900 border-b-4 border-amber-600 transition-all duration-75"
          >
            AC
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleSignClick}
            className="h-14 rounded-xl font-display font-extrabold text-lg shadow-md flex items-center justify-center cursor-pointer bg-[#ffd801] text-slate-900 border-b-4 border-amber-600 transition-all duration-75"
          >
            +/-
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePercentageClick}
            className="h-14 rounded-xl font-display font-extrabold text-lg shadow-md flex items-center justify-center cursor-pointer bg-[#ffd801] text-slate-900 border-b-4 border-amber-600 transition-all duration-75"
          >
            %
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9, rotate: 2 }}
            onClick={() => handleOperatorClick('/')}
            className="h-14 rounded-xl font-display font-extrabold text-xl shadow-md flex items-center justify-center cursor-pointer bg-sky-400 text-white border-b-4 border-sky-600 transition-all duration-75"
          >
            ÷
          </motion.button>

          {/* Row 2 */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleDigitClick('7')}
            className="h-14 rounded-xl font-display font-extrabold text-xl shadow-md flex items-center justify-center cursor-pointer bg-slate-100 text-[#0051ba] border-b-4 border-slate-350 hover:bg-white transition-all duration-75"
          >
            7
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleDigitClick('8')}
            className="h-14 rounded-xl font-display font-extrabold text-xl shadow-md flex items-center justify-center cursor-pointer bg-slate-100 text-[#0051ba] border-b-4 border-slate-350 hover:bg-white transition-all duration-75"
          >
            8
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleDigitClick('9')}
            className="h-14 rounded-xl font-display font-extrabold text-xl shadow-md flex items-center justify-center cursor-pointer bg-slate-100 text-[#0051ba] border-b-4 border-slate-350 hover:bg-white transition-all duration-75"
          >
            9
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9, rotate: 2 }}
            onClick={() => handleOperatorClick('*')}
            className="h-14 rounded-xl font-display font-extrabold text-xl shadow-md flex items-center justify-center cursor-pointer bg-sky-400 text-white border-b-4 border-sky-600 transition-all duration-75"
          >
            ×
          </motion.button>

          {/* Row 3 */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleDigitClick('4')}
            className="h-14 rounded-xl font-display font-extrabold text-xl shadow-md flex items-center justify-center cursor-pointer bg-slate-100 text-[#0051ba] border-b-4 border-slate-350 hover:bg-white transition-all duration-75"
          >
            4
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleDigitClick('5')}
            className="h-14 rounded-xl font-display font-extrabold text-xl shadow-md flex items-center justify-center cursor-pointer bg-slate-100 text-[#0051ba] border-b-4 border-slate-350 hover:bg-white transition-all duration-75"
          >
            5
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleDigitClick('6')}
            className="h-14 rounded-xl font-display font-extrabold text-xl shadow-md flex items-center justify-center cursor-pointer bg-slate-100 text-[#0051ba] border-b-4 border-slate-350 hover:bg-white transition-all duration-75"
          >
            6
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9, rotate: 2 }}
            onClick={() => handleOperatorClick('-')}
            className="h-14 rounded-xl font-display font-extrabold text-xl shadow-md flex items-center justify-center cursor-pointer bg-sky-400 text-white border-b-4 border-sky-600 transition-all duration-75"
          >
            -
          </motion.button>

          {/* Row 4 */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleDigitClick('1')}
            className="h-14 rounded-xl font-display font-extrabold text-xl shadow-md flex items-center justify-center cursor-pointer bg-slate-100 text-[#0051ba] border-b-4 border-slate-350 hover:bg-white transition-all duration-75"
          >
            1
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleDigitClick('2')}
            className="h-14 rounded-xl font-display font-extrabold text-xl shadow-md flex items-center justify-center cursor-pointer bg-slate-100 text-[#0051ba] border-b-4 border-slate-350 hover:bg-white transition-all duration-75"
          >
            2
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleDigitClick('3')}
            className="h-14 rounded-xl font-display font-extrabold text-xl shadow-md flex items-center justify-center cursor-pointer bg-slate-100 text-[#0051ba] border-b-4 border-slate-350 hover:bg-white transition-all duration-75"
          >
            3
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9, rotate: 2 }}
            onClick={() => handleOperatorClick('+')}
            className="h-14 rounded-xl font-display font-extrabold text-xl shadow-md flex items-center justify-center cursor-pointer bg-sky-400 text-white border-b-4 border-sky-600 transition-all duration-75"
          >
            +
          </motion.button>

          {/* Row 5 */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleDigitClick('0')}
            className="h-14 rounded-xl font-display font-extrabold text-xl shadow-md flex items-center justify-center cursor-pointer bg-slate-100 text-[#0051ba] border-b-4 border-slate-350 hover:bg-white transition-all duration-75"
          >
            0
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleDigitClick('.')}
            className="h-14 rounded-xl font-display font-extrabold text-xl shadow-md flex items-center justify-center cursor-pointer bg-slate-100 text-[#0051ba] border-b-4 border-slate-350 hover:bg-white transition-all duration-75"
          >
            .
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleBackspace}
            className="h-14 rounded-xl font-display font-extrabold text-xl shadow-md flex items-center justify-center cursor-pointer bg-[#ffd801] text-slate-900 border-b-4 border-amber-600 transition-all duration-75"
          >
            <Delete className="w-5 h-5 text-slate-950" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9, rotate: -2 }}
            onClick={handleEqualsClick}
            className="h-14 rounded-xl font-display font-extrabold text-2xl shadow-md flex items-center justify-center cursor-pointer bg-[#ffd700] text-slate-900 border-b-4 border-amber-600 transition-all duration-75"
          >
            =
          </motion.button>
        </div>
      </div>
    </div>
  );
}
