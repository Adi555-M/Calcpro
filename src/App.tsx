import { useState } from 'react';
import { motion } from 'motion/react';

export default function App() {
  const [display, setDisplay] = useState('0');
  const [currentValue, setCurrentValue] = useState('');
  const [operator, setOperator] = useState<string | null>(null);
  const [prevValue, setPrevValue] = useState<string | null>(null);
  const [waitingForNewNumber, setWaitingForNewNumber] = useState(false);

  const handleDigitClick = (digit: string) => {
    if (waitingForNewNumber) {
      setDisplay(digit);
      setCurrentValue(digit);
      setWaitingForNewNumber(false);
    } else if (display === '0' && digit !== '.') {
      setDisplay(digit);
      setCurrentValue(digit);
    } else {
      setDisplay((prev) => prev + digit);
      setCurrentValue((prev) => prev + digit);
    }
  };

  const handleOperatorClick = (nextOperator: string) => {
    if (currentValue !== '') {
      if (prevValue !== null && operator !== null) {
        const result = calculate(parseFloat(prevValue), parseFloat(currentValue), operator);
        setPrevValue(result.toString());
        setDisplay(result.toString()); // Display the result of the chained operation
      } else {
        setPrevValue(currentValue);
        setDisplay(currentValue); // Display the first number before clearing for the next
      }
      setCurrentValue('');
    } else if (prevValue === null && operator === null) {
      return; // Ignore operator click if no numbers entered yet
    }

    setOperator(nextOperator);
    setWaitingForNewNumber(true); // Ready for a new number
  };

  const handleEqualsClick = () => {
    if (prevValue === null || operator === null) return;

    let secondOperand = currentValue;
    if (currentValue === '') {
      secondOperand = prevValue;
    }

    const result = calculate(parseFloat(prevValue), parseFloat(secondOperand), operator);
    setDisplay(result.toString());
    setCurrentValue(result.toString());
    setPrevValue(null);
    setOperator(null);
    setWaitingForNewNumber(true); // After equals, ready for a new number
  };

  const handleClearClick = () => {
    setDisplay('0');
    setCurrentValue('');
    setOperator(null);
    setPrevValue(null);
    setWaitingForNewNumber(false); // Reset this too
  };

  const handlePercentageClick = () => {
    if (currentValue === '') return;
    const percentage = parseFloat(currentValue) / 100;
    setDisplay(percentage.toString());
    setCurrentValue(percentage.toString());
  };

  const handleToggleSignClick = () => {
    if (currentValue === '') return;
    const toggled = parseFloat(currentValue) * -1;
    setDisplay(toggled.toString());
    setCurrentValue(toggled.toString());
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
        return num1 / num2;
      default:
        return num2;
    }
  };

  const buttonClasses = "flex items-center justify-center rounded-full text-xl font-display font-bold transition-all duration-200 ease-in-out shadow-md";
  const numberButtonClasses = `${buttonClasses} bg-[var(--color-button-bg)] text-[var(--color-button-text)] hover:bg-[var(--color-button-hover)] active:scale-95`;
  const operatorButtonClasses = `${buttonClasses} bg-[var(--color-blue-secondary)] text-[var(--color-light-text)] hover:bg-blue-600 active:scale-95`;
  const functionButtonClasses = `${buttonClasses} bg-yellow-300 text-[var(--color-dark-text)] hover:bg-yellow-400 active:scale-95`;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-[var(--color-yellow-primary)] p-4"
    >
      <motion.div
        initial={{ scale: 0.8, rotate: -5 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="bg-[var(--color-calculator-bg)] rounded-3xl shadow-2xl p-6 w-full max-w-md transform rotate-2 hover:rotate-0 transition-transform duration-300 ease-in-out"
      >
        <div className="mb-6 p-4 text-right bg-blue-100 rounded-xl shadow-inner font-display text-5xl text-[var(--color-dark-text)] overflow-hidden break-words min-h-[80px] flex items-end justify-end">
          <motion.span
            key={display}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {display}
          </motion.span>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            className={functionButtonClasses}
            onClick={handleClearClick}
          >
            AC
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className={functionButtonClasses}
            onClick={handleToggleSignClick}
          >
            +/- 
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className={functionButtonClasses}
            onClick={handlePercentageClick}
          >
            %
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className={operatorButtonClasses}
            onClick={() => handleOperatorClick('/')}
          >
            ÷
          </motion.button>

          <motion.button whileTap={{ scale: 0.9 }} className={numberButtonClasses} onClick={() => handleDigitClick('7')}>7</motion.button>
          <motion.button whileTap={{ scale: 0.9 }} className={numberButtonClasses} onClick={() => handleDigitClick('8')}>8</motion.button>
          <motion.button whileTap={{ scale: 0.9 }} className={numberButtonClasses} onClick={() => handleDigitClick('9')}>9</motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className={operatorButtonClasses}
            onClick={() => handleOperatorClick('*')}
          >
            ×
          </motion.button>

          <motion.button whileTap={{ scale: 0.9 }} className={numberButtonClasses} onClick={() => handleDigitClick('4')}>4</motion.button>
          <motion.button whileTap={{ scale: 0.9 }} className={numberButtonClasses} onClick={() => handleDigitClick('5')}>5</motion.button>
          <motion.button whileTap={{ scale: 0.9 }} className={numberButtonClasses} onClick={() => handleDigitClick('6')}>6</motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className={operatorButtonClasses}
            onClick={() => handleOperatorClick('-')}
          >
            -
          </motion.button>

          <motion.button whileTap={{ scale: 0.9 }} className={numberButtonClasses} onClick={() => handleDigitClick('1')}>1</motion.button>
          <motion.button whileTap={{ scale: 0.9 }} className={numberButtonClasses} onClick={() => handleDigitClick('2')}>2</motion.button>
          <motion.button whileTap={{ scale: 0.9 }} className={numberButtonClasses} onClick={() => handleDigitClick('3')}>3</motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className={operatorButtonClasses}
            onClick={() => handleOperatorClick('+')}
          >
            +
          </motion.button>

          <motion.button whileTap={{ scale: 0.9 }} className={`${numberButtonClasses} col-span-2`} onClick={() => handleDigitClick('0')}>0</motion.button>
          <motion.button whileTap={{ scale: 0.9 }} className={numberButtonClasses} onClick={() => handleDigitClick('.')}>.</motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className={operatorButtonClasses}
            onClick={handleEqualsClick}
          >
            =
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
