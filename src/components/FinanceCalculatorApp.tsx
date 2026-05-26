import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import StandardCalculator from './StandardCalculator';
import {
  Calculator,
  TrendingUp,
  Coins,
  Percent,
  Calendar,
  IndianRupee,
  Scale,
  Briefcase,
  Layers,
  Sparkles,
  Info,
  Menu,
  X,
  PlusSquare,
  Shield,
  HelpCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  LineChart,
  Line
} from 'recharts';
import {
  calculateEMI,
  calculateSIP,
  calculateLumpSum,
  calculateFD,
  calculateRD,
  calculatePPF,
  calculateCompoundInterest,
  calculateSimpleInterest,
  calculateCAGR,
  compareLoans,
  calculateIncomeTaxIndia,
  calculateRetirementCorpus
} from '../utils/financeFormulas';

// Category types for organizing the calculators
type CalculatorId =
  | 'emi'
  | 'sip'
  | 'lumpsum'
  | 'fd'
  | 'rd'
  | 'ppf'
  | 'compound'
  | 'simple'
  | 'cagr'
  | 'compare'
  | 'tax'
  | 'retirement';

interface CalculatorConfig {
  id: CalculatorId;
  name: string;
  description: string;
  category: 'Investment' | 'Loan/Interest' | 'Tax & Planning';
  icon: React.ElementType;
}

const CALCULATORS: CalculatorConfig[] = [
  { id: 'emi', name: 'EMI Loan Calculator', description: 'Estimate your monthly loan installments & interest outlay', category: 'Loan/Interest', icon: Calculator },
  { id: 'sip', name: 'SIP Investment', description: 'Project future returns on systemic monthly investments', category: 'Investment', icon: TrendingUp },
  { id: 'lumpsum', name: 'Lump Sum return', description: 'See potential growth of a one-time principal investment', category: 'Investment', icon: Coins },
  { id: 'fd', name: 'Fixed Deposit (FD)', description: 'Calculate interest earned on guaranteed term deposits', category: 'Investment', icon: Briefcase },
  { id: 'rd', name: 'Recurring Deposit (RD)', description: 'Model monthly savings compiled with term interest', category: 'Investment', icon: Calendar },
  { id: 'ppf', name: 'Public Provident Fund', description: 'Simulate long-term, tax-free PPF debt growth (15 yrs+)', category: 'Investment', icon: Shield },
  { id: 'compound', name: 'Compound Interest', description: 'Observe compounding frequencies visual interest growth', category: 'Loan/Interest', icon: Layers },
  { id: 'simple', name: 'Simple Interest', description: 'Basic interest equation on principal, rate and time', category: 'Loan/Interest', icon: Percent },
  { id: 'cagr', name: 'CAGR Growth Rate', description: 'Establish the compound annual growth rate of returns', category: 'Investment', icon: Sparkles },
  { id: 'compare', name: 'Loan Comparison', description: 'Benchmark two loan regimes side-by-side to save interest', category: 'Loan/Interest', icon: Scale },
  { id: 'tax', name: 'Income Tax Estimator', description: 'Side-by-side preview of India Old vs New tax regimes', category: 'Tax & Planning', icon: IndianRupee },
  { id: 'retirement', name: 'Retirement Corpus', description: 'Formulate required corpus adjusted for post-retirement inflation', category: 'Tax & Planning', icon: HelpCircle },
];

export const formatINR = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
};

export default function FinanceCalculatorApp() {
  const [activeTab, setActiveTab] = useState<CalculatorId>('emi');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // States for all inputs
  // 1. EMI states
  const [emiPrincipal, setEmiPrincipal] = useState(1000000); // 10 Lakhs
  const [emiRate, setEmiRate] = useState(8.5); // 8.5%
  const [emiYears, setEmiYears] = useState(5);
  const [emiMonths, setEmiMonths] = useState(0);

  // 2. SIP states
  const [sipMonthly, setSipMonthly] = useState(10000);
  const [sipRate, setSipRate] = useState(12);
  const [sipYears, setSipYears] = useState(10);

  // 3. Lumpsum states
  const [lumpAmount, setLumpAmount] = useState(100000);
  const [lumpRate, setLumpRate] = useState(12);
  const [lumpYears, setLumpYears] = useState(10);

  // 4. FD states
  const [fdPrincipal, setFdPrincipal] = useState(100000);
  const [fdRate, setFdRate] = useState(7.1);
  const [fdYears, setFdYears] = useState(5);
  const [fdCompounding, setFdCompounding] = useState(4); // Quarterly default

  // 5. RD states
  const [rdMonthly, setRdMonthly] = useState(5000);
  const [rdRate, setRdRate] = useState(6.8);
  const [rdYears, setRdYears] = useState(5);

  // 6. PPF states
  const [ppfYearly, setPpfYearly] = useState(50000);
  const [ppfYears, setPpfYears] = useState(15); // min 15

  // 7. Compound Interest states
  const [ciPrincipal, setCiPrincipal] = useState(100000);
  const [ciRate, setCiRate] = useState(8);
  const [ciYears, setCiYears] = useState(5);
  const [ciCompounding, setCiCompounding] = useState(4); // Quarterly

  // 8. Simple Interest states
  const [siPrincipal, setSiPrincipal] = useState(100000);
  const [siRate, setSiRate] = useState(8);
  const [siYears, setSiYears] = useState(5);

  // 9. CAGR states
  const [cagrInitial, setCagrInitial] = useState(100000);
  const [cagrFinal, setCagrFinal] = useState(250000);
  const [cagrYears, setCagrYears] = useState(5);

  // 10. Loan Comparison states
  const [compP1, setCompP1] = useState(1000000);
  const [compR1, setCompR1] = useState(8.5);
  const [compY1, setCompY1] = useState(10);
  const [compM1, setCompM1] = useState(0);

  const [compP2, setCompP2] = useState(1000000);
  const [compR2, setCompR2] = useState(9.2);
  const [compY2, setCompY2] = useState(8);
  const [compM2, setCompM2] = useState(0);

  // 11. Income Tax states
  const [taxGross, setTaxGross] = useState(1200000); // 12 LPA
  const [taxDeductions, setTaxDeductions] = useState(200000); // 1.5L 80C + 50k standard, etc.

  // 12. Retirement states
  const [retCurrentAge, setRetCurrentAge] = useState(30);
  const [retRetAge, setRetRetAge] = useState(60);
  const [retExpenses, setRetExpenses] = useState(40000); // Monthly expense currently
  const [retInflation, setRetInflation] = useState(6); // 6% default inflation
  const [retReturnPre, setRetReturnPre] = useState(12); // Expected pre-retirement rate
  const [retReturnPost, setRetReturnPost] = useState(6); // Post retirement return (conservative)

  // Real-time computations
  const emiResult = useMemo(() => calculateEMI(emiPrincipal, emiRate, emiYears, emiMonths), [emiPrincipal, emiRate, emiYears, emiMonths]);
  const sipResult = useMemo(() => calculateSIP(sipMonthly, sipRate, sipYears), [sipMonthly, sipRate, sipYears]);
  const lumpResult = useMemo(() => calculateLumpSum(lumpAmount, lumpRate, lumpYears), [lumpAmount, lumpRate, lumpYears]);
  const fdResult = useMemo(() => calculateFD(fdPrincipal, fdRate, fdYears, fdCompounding), [fdPrincipal, fdRate, fdYears, fdCompounding]);
  const rdResult = useMemo(() => calculateRD(rdMonthly, rdRate, rdYears), [rdMonthly, rdRate, rdYears]);
  const ppfResult = useMemo(() => calculatePPF(ppfYearly, ppfYears), [ppfYearly, ppfYears]);
  const ciResult = useMemo(() => calculateCompoundInterest(ciPrincipal, ciRate, ciYears, ciCompounding), [ciPrincipal, ciRate, ciYears, ciCompounding]);
  const siResult = useMemo(() => calculateSimpleInterest(siPrincipal, siRate, siYears), [siPrincipal, siRate, siYears]);
  const cagrResult = useMemo(() => calculateCAGR(cagrInitial, cagrFinal, cagrYears), [cagrInitial, cagrFinal, cagrYears]);
  const compareResult = useMemo(() => compareLoans(compP1, compR1, compY1, compM1, compP2, compR2, compY2, compM2), [compP1, compR1, compY1, compM1, compP2, compR2, compY2, compM2]);
  const taxResult = useMemo(() => calculateIncomeTaxIndia(taxGross, taxDeductions), [taxGross, taxDeductions]);
  const retirementResult = useMemo(() => calculateRetirementCorpus(retCurrentAge, retRetAge, retExpenses, retInflation, retReturnPre, retReturnPost), [retCurrentAge, retRetAge, retExpenses, retInflation, retReturnPre, retReturnPost]);

  const activeCalculatorGroup = useMemo(() => {
    return CALCULATORS.find(c => c.id === activeTab);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#030f26] flex flex-col md:flex-row antialiased font-sans text-slate-100">
      
      {/* Mobile Header Block */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#00224d] border-b border-[#ffd700]/30 sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2">
          <div className="bg-[#ffd700] text-[#00224d] p-1.5 rounded-lg shadow-sm font-extrabold text-xs">
            <Calculator className="w-4 h-4 text-[#00224d]" />
          </div>
          <span className="font-display font-black text-base tracking-tight text-white uppercase">TACTILE SUPER-CALC</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 hover:bg-[#053272] rounded-lg transition border border-[#ffd700]/10"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6 text-[#ffd700]" /> : <Menu className="w-6 h-6 text-[#ffd700]" />}
        </button>
      </header>

      {/* Sidebar Navigation for Desktop & Tablet */}
      <aside className="hidden md:flex flex-col w-72 bg-[#00224d] border-r border-[#ffd700]/20 shrink-0 sticky top-0 h-screen select-none text-white">
        <div className="p-6 border-b border-[#ffd700]/20 flex items-center gap-3">
          <div className="bg-[#ffd700] text-[#00224d] p-2 rounded-xl shadow-md">
            <Calculator className="w-6 h-6 text-[#00224d]" />
          </div>
          <div>
            <span className="font-display font-extrabold text-lg tracking-wider block text-white leading-tight uppercase">SUPER-CALC</span>
            <span className="text-xs font-bold text-[#ffd700] tracking-wider uppercase">Pro Finance Suite</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {/* Group 1: Investment Suite */}
          <div>
            <span className="text-xxs uppercase tracking-widest font-black text-[#ffd700] block px-3 mb-2 opacity-80">Investment Suite</span>
            <div className="space-y-1">
              {CALCULATORS.filter(c => c.category === 'Investment').map(calc => (
                <button
                  key={calc.id}
                  onClick={() => setActiveTab(calc.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-extrabold tracking-wide uppercase transition duration-200 group text-left ${
                    activeTab === calc.id
                      ? 'bg-[#ffd700] text-slate-900 border-b-2 border-amber-500 shadow-md'
                      : 'text-slate-200 hover:bg-[#053272] hover:text-[#ffd700]'
                  }`}
                >
                  <calc.icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${activeTab === calc.id ? 'text-slate-900' : 'text-[#ffd700]'}`} />
                  <span className="truncate">{calc.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Group 2: Interest & Loans */}
          <div>
            <span className="text-xxs uppercase tracking-widest font-black text-[#ffd700] block px-3 mb-2 opacity-80">Loan & Interest</span>
            <div className="space-y-1">
              {CALCULATORS.filter(c => c.category === 'Loan/Interest').map(calc => (
                <button
                  key={calc.id}
                  onClick={() => setActiveTab(calc.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-extrabold tracking-wide uppercase transition duration-200 group text-left ${
                    activeTab === calc.id
                      ? 'bg-[#ffd700] text-slate-900 border-b-2 border-amber-500 shadow-md'
                      : 'text-slate-200 hover:bg-[#053272] hover:text-[#ffd700]'
                  }`}
                >
                  <calc.icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${activeTab === calc.id ? 'text-slate-900' : 'text-[#ffd700]'}`} />
                  <span className="truncate">{calc.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Group 3: Taxation & Planning */}
          <div>
            <span className="text-xxs uppercase tracking-widest font-black text-[#ffd700] block px-3 mb-2 opacity-80">Tax & Planning</span>
            <div className="space-y-1">
              {CALCULATORS.filter(c => c.category === 'Tax & Planning').map(calc => (
                <button
                  key={calc.id}
                  onClick={() => setActiveTab(calc.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-extrabold tracking-wide uppercase transition duration-200 group text-left ${
                    activeTab === calc.id
                      ? 'bg-[#ffd700] text-slate-900 border-b-2 border-amber-500 shadow-md'
                      : 'text-slate-200 hover:bg-[#053272] hover:text-[#ffd700]'
                  }`}
                >
                  <calc.icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${activeTab === calc.id ? 'text-slate-900' : 'text-[#ffd700]'}`} />
                  <span className="truncate">{calc.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-[#ffd700]/10 bg-[#001736]">
          <p className="text-xxs text-[#ffd700] font-bold text-center uppercase tracking-wider">TACTILE SECURE client ENGINE</p>
        </div>
      </aside>

      {/* Mobile Drawer Navigation List */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed top-[53px] inset-x-0 bottom-0 bg-[#00224d] text-white z-40 overflow-y-auto px-4 py-6 border-t border-[#ffd700]/30 flex flex-col gap-6"
          >
            {CALCULATORS.map(calc => (
              <button
                key={calc.id}
                onClick={() => {
                  setActiveTab(calc.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-4 p-3 rounded-2xl text-left transition ${
                  activeTab === calc.id 
                    ? 'bg-[#ffd700] text-[#00224d] font-black border-b-2 border-amber-500 shadow-md' 
                    : 'hover:bg-[#053272] text-slate-100'
                }`}
              >
                <div className={`p-2 rounded-xl ${activeTab === calc.id ? 'bg-[#00224d] text-[#ffd700]' : 'bg-[#053272] text-slate-350'}`}>
                  <calc.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm tracking-tight uppercase">{calc.name}</div>
                  <div className="text-xs text-slate-300 mt-0.5 line-clamp-1">{calc.description}</div>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Panel Area */}
      <main className="flex-1 p-4 md:p-8 lg:p-10 flex flex-col gap-8 overflow-x-hidden min-h-0 bg-[#030f26]">
        
        {/* HERO SECTION: STANDARD CALCULATOR PROMINENT CENTERPIECE */}
        <section className="bg-gradient-to-br from-[#0c1e3a] via-[#091629] to-[#01142f] text-white rounded-[32px] p-6 md:p-10 shadow-xl border border-[#ffd700]/25 flex flex-col lg:flex-row items-center gap-8 lg:gap-12 md:mb-2 text-left">
          <div className="flex-1 flex flex-col gap-4">
            <div className="inline-flex items-center gap-2 bg-[#ffd700]/15 text-[#ffd700] px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase border border-[#ffd700]/30 w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              Standard Pocket Calculator
            </div>
            
            <h2 className="font-display font-extrabold text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight text-white uppercase">
              Tactile <span className="text-[#ffd700]">Desk Calculator</span>
            </h2>
            
            <p className="text-sm md:text-base text-slate-300 leading-relaxed font-normal max-w-xl font-medium">
              Need to crunch a fast sum or double check some quick arithmetic? Use our yellow-blue interactive pocket calculator directly right here. Tap keypads, chain equations, or hit clear to start fresh.
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2 text-xs font-semibold text-slate-300 font-mono">
              <div className="bg-[#121c2c] border border-[#ffd700]/20 px-3 py-2.5 rounded-xl flex items-center gap-2 text-emerald-400">
                <span className="font-black">12+</span> TOOLS ACTIVE
              </div>
              <div className="bg-[#121c2c] border border-[#ffd700]/20 px-3 py-2.5 rounded-xl flex items-center gap-2 text-[#ffd700]">
                <span className="font-black">★</span> TACTILE AUDIO
              </div>
              <div className="bg-[#121c2c] border border-[#ffd700]/20 px-3 py-2.5 rounded-xl flex items-center gap-2 col-span-2 sm:col-span-1 text-sky-450 text-sky-400">
                <span className="font-black">100%</span> SECURED
              </div>
            </div>
          </div>
          
          {/* Main Visual interactive standard calculator */}
          <div className="w-full lg:w-auto shrink-0 flex justify-center">
            <StandardCalculator />
          </div>
        </section>

        {/* SECTION BREAK: PRO FINANCIAL UTILITY SYSTEM */}
        <div className="border-t border-[#ffd700]/15 pt-6 flex flex-col gap-1.5 text-left">
          <div className="inline-flex items-center gap-2 text-[#ffd700] text-xs font-bold tracking-widest uppercase mb-1">
            <IndianRupee className="w-4 h-4 text-[#ffd700]" />
            Institutional Portfolio & Savings Suite
          </div>
          <h2 className="font-display font-black text-2.5xl md:text-3.5xl text-white tracking-tight leading-none uppercase">
            Financial & <span className="text-[#ffd700]">Specialized Estimators</span>
          </h2>
          <p className="text-xs md:text-sm text-slate-300 font-medium">
            Explore advanced wealth accumulators, compound schedules, EMI comparators, and tax estimators from the categories below or the side panel. All calculators are beautifully themed in the physical game console styling below.
          </p>
        </div>

        {/* Active Tab Explanation banner */}
        {activeCalculatorGroup && (
          <div className="flex flex-col gap-1.5 md:mb-1 bg-[#00224d] border border-[#ffd700]/30 rounded-2xl p-4 md:p-6 text-left shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="bg-[#ffd700] text-[#00224d] p-1.5 rounded-lg shadow-sm font-extrabold text-sm">
                <activeCalculatorGroup.icon className="w-4 h-4 text-[#00224d]" />
              </div>
              <h1 className="font-display font-extrabold text-xl md:text-2xl text-white tracking-tight leading-none uppercase">
                {activeCalculatorGroup.name}
              </h1>
            </div>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl font-medium ml-9">
              {activeCalculatorGroup.description}
            </p>
          </div>
        )}

        {/* Dynamic Calculator Wrapper */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* Active component panels render here */}
          <div className="xl:col-span-12">
            <div className="tactile-finance-console relative bg-[#0051ba] border-[12px] border-[#ffd700] rounded-[38px] shadow-2xl overflow-hidden p-6 md:p-8 text-left">
              {/* Playful Console Badge */}
              <div className="flex justify-between items-center mb-6 px-2 border-b-2 border-[#ffd700]/20 pb-4">
                <span className="text-xxs font-extrabold text-[#ffd700] tracking-widest uppercase flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#ffd700] animate-pulse" />
                  CONSOLIZED ENHANCED MATH UNIT // {activeCalculatorGroup?.name}
                </span>
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                </div>
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  
                  {/* Tab 1: EMI Loans */}
                  {activeTab === 'emi' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      {/* Left: Input sliders */}
                      <div className="lg:col-span-7 flex flex-col gap-6">
                        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Adjust Loan Particulars</h3>
                        
                        {/* Principal Input */}
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-center text-sm font-semibold text-slate-600">
                            <span>Loan Amount</span>
                            <span className="text-teal-600 font-bold bg-teal-50 px-2.5 py-1 rounded-lg">{formatINR(emiPrincipal)}</span>
                          </div>
                          <input
                            type="range"
                            min="100000"
                            max="50000000"
                            step="50000"
                            value={emiPrincipal}
                            onChange={(e) => setEmiPrincipal(Number(e.target.value))}
                            className="w-full accent-teal-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-xxs text-slate-400 font-bold tracking-wider">
                            <span>₹1 Lakh</span>
                            <span>₹5 Crores</span>
                          </div>
                        </div>

                        {/* Interest Rate */}
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-center text-sm font-semibold text-slate-600">
                            <span>Annual Interest Rate</span>
                            <span className="text-teal-600 font-bold bg-teal-50 px-2.5 py-1 rounded-lg">{emiRate}%</span>
                          </div>
                          <input
                            type="range"
                            min="5"
                            max="20"
                            step="0.1"
                            value={emiRate}
                            onChange={(e) => setEmiRate(Number(e.target.value))}
                            className="w-full accent-teal-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-xxs text-slate-400 font-bold tracking-wider">
                            <span>5% p.a.</span>
                            <span>20% p.a.</span>
                          </div>
                        </div>

                        {/* Tenure in Years */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-600">Years</label>
                            <input
                              type="number"
                              min="0"
                              max="30"
                              value={emiYears}
                              onChange={(e) => setEmiYears(Math.max(0, Number(e.target.value)))}
                              className="border border-slate-200 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-teal-600 font-bold text-slate-800 text-lg"
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-600">Months</label>
                            <input
                              type="number"
                              min="0"
                              max="11"
                              value={emiMonths}
                              onChange={(e) => setEmiMonths(Math.min(11, Math.max(0, Number(e.target.value))))}
                              className="border border-slate-200 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-teal-600 font-bold text-slate-800 text-lg"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Right: Outputs & representation */}
                      <div className="lg:col-span-5 flex flex-col gap-6 bg-slate-50 rounded-2xl p-6 border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900">Outlay Calculations</h3>
                        
                        <div className="grid grid-cols-1 gap-4">
                          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-1">
                            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Monthly EMI Payment</span>
                            <span className="text-3xl font-extrabold text-slate-900">{formatINR(emiResult.monthlyEMI)}</span>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-1">
                              <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase text-teal-600">Principal</span>
                              <span className="text-lg font-bold text-slate-800">{formatINR(emiPrincipal)}</span>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-1">
                              <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase text-blue-600">Interest</span>
                              <span className="text-lg font-bold text-slate-800">{formatINR(emiResult.totalInterest)}</span>
                            </div>
                          </div>

                          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1 mt-2">
                            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Total Outlay Payable</span>
                            <span className="text-xl font-extrabold text-slate-800">{formatINR(emiResult.totalPayment)}</span>
                          </div>
                        </div>

                        {/* Pie chart representing ratio of principal to interest */}
                        {emiResult.pieData.length > 0 && (
                          <div className="h-56 mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={emiResult.pieData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={60}
                                  outerRadius={80}
                                  paddingAngle={4}
                                  dataKey="value"
                                >
                                  {emiResult.pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                                </Pie>
                                <Tooltip formatter={(value) => formatINR(Number(value))} />
                                <Legend verticalAlign="bottom" height={36} />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tab 2: SIP Investment */}
                  {activeTab === 'sip' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      {/* Left Side: Parameters Slider */}
                      <div className="lg:col-span-7 flex flex-col gap-6">
                        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Adjust SIP Variables</h3>

                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-center text-sm font-semibold text-slate-600">
                            <span>Monthly Investment</span>
                            <span className="text-teal-600 font-bold bg-teal-50 px-2.5 py-1 rounded-lg">{formatINR(sipMonthly)}</span>
                          </div>
                          <input
                            type="range"
                            min="500"
                            max="100000"
                            step="500"
                            value={sipMonthly}
                            onChange={(e) => setSipMonthly(Number(e.target.value))}
                            className="w-full accent-teal-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-xxs text-slate-400 font-bold tracking-wider">
                            <span>₹500</span>
                            <span>₹1,00,000 /mo</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-center text-sm font-semibold text-slate-600">
                            <span>Expected Return Rate</span>
                            <span className="text-teal-600 font-bold bg-teal-50 px-2.5 py-1 rounded-lg">{sipRate}%</span>
                          </div>
                          <input
                            type="range"
                            min="5"
                            max="30"
                            step="0.5"
                            value={sipRate}
                            onChange={(e) => setSipRate(Number(e.target.value))}
                            className="w-full accent-teal-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-xxs text-slate-400 font-bold tracking-wider">
                            <span>5% p.a.</span>
                            <span>30% p.a.</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-center text-sm font-semibold text-slate-600">
                            <span>Tenure (Time Period)</span>
                            <span className="text-teal-600 font-bold bg-teal-50 px-2.5 py-1 rounded-lg">{sipYears} Years</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="40"
                            step="1"
                            value={sipYears}
                            onChange={(e) => setSipYears(Number(e.target.value))}
                            className="w-full accent-teal-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-xxs text-slate-400 font-bold tracking-wider">
                            <span>1 Year</span>
                            <span>40 Years</span>
                          </div>
                        </div>
                      </div>

                      {/* Right side: Growth Outcomes */}
                      <div className="lg:col-span-5 flex flex-col gap-6 bg-slate-50 rounded-2xl p-6 border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900">Compound Projections</h3>
                        
                        <div className="grid grid-cols-1 gap-4">
                          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-1">
                            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Future Maturity Amount</span>
                            <span className="text-3xl font-extrabold text-teal-600">{formatINR(sipResult.maturityAmount)}</span>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-1">
                              <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Total Invested</span>
                              <span className="text-md font-bold text-slate-800">{formatINR(sipResult.totalInvested)}</span>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-1">
                              <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Est. Returns</span>
                              <span className="text-md font-bold text-slate-800">{formatINR(sipResult.totalReturns)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Line Chart showing yearly growth */}
                        {sipResult.growthData.length > 0 && (
                          <div className="h-56 mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={sipResult.growthData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} />
                                <YAxis tickFormatter={(val) => `₹${val/1000}K`} stroke="#94a3b8" fontSize={11} />
                                <Tooltip formatter={(value) => formatINR(Number(value))} />
                                <Legend />
                                <Area type="monotone" dataKey="invested" stackId="1" stroke="#0d9488" fill="#e6f4f1" name="Invested" />
                                <Area type="monotone" dataKey="returns" stackId="2" stroke="#3b82f6" fill="#eff6ff" name="Returns" />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tab 3: Lump Sum return */}
                  {activeTab === 'lumpsum' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      <div className="lg:col-span-7 flex flex-col gap-6">
                        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Adjust Lump Sum Parameters</h3>

                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-center text-sm font-semibold text-slate-600">
                            <span>One-time Investment</span>
                            <span className="text-teal-600 font-bold bg-teal-50 px-2.5 py-1 rounded-lg">{formatINR(lumpAmount)}</span>
                          </div>
                          <input
                            type="range"
                            min="5000"
                            max="10000000"
                            step="5000"
                            value={lumpAmount}
                            onChange={(e) => setLumpAmount(Number(e.target.value))}
                            className="w-full accent-teal-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-xxs text-slate-400 font-bold tracking-wider">
                            <span>₹5,000</span>
                            <span>₹1 Crore</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-center text-sm font-semibold text-slate-600">
                            <span>Expected Return Rate</span>
                            <span className="text-teal-600 font-bold bg-teal-50 px-2.5 py-1 rounded-lg">{lumpRate}%</span>
                          </div>
                          <input
                            type="range"
                            min="5"
                            max="30"
                            step="0.5"
                            value={lumpRate}
                            onChange={(e) => setLumpRate(Number(e.target.value))}
                            className="w-full accent-teal-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-xxs text-slate-400 font-bold tracking-wider">
                            <span>5% p.a.</span>
                            <span>30% p.a.</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-center text-sm font-semibold text-slate-600">
                            <span>Investment Duration</span>
                            <span className="text-teal-600 font-bold bg-teal-50 px-2.5 py-1 rounded-lg">{lumpYears} Years</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="40"
                            step="1"
                            value={lumpYears}
                            onChange={(e) => setLumpYears(Number(e.target.value))}
                            className="w-full accent-teal-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-xxs text-slate-400 font-bold tracking-wider">
                            <span>1 Year</span>
                            <span>40 Years</span>
                          </div>
                        </div>
                      </div>

                      <div className="lg:col-span-5 flex flex-col gap-6 bg-slate-50 rounded-2xl p-6 border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900">Growth Projections</h3>
                        
                        <div className="grid grid-cols-1 gap-4">
                          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-1">
                            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Future Maturity Value</span>
                            <span className="text-3xl font-extrabold text-blue-600">{formatINR(lumpResult.futureValue)}</span>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-1">
                              <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Initial Investment</span>
                              <span className="text-md font-bold text-slate-800">{formatINR(lumpResult.totalInvested)}</span>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-1">
                              <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Total Interest Growth</span>
                              <span className="text-md font-bold text-slate-800">{formatINR(lumpResult.totalReturns)}</span>
                            </div>
                          </div>
                        </div>

                        {lumpResult.growthData.length > 0 && (
                          <div className="h-56 mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={lumpResult.growthData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} />
                                <YAxis tickFormatter={(val) => `₹${val/1000}K`} stroke="#94a3b8" fontSize={11} />
                                <Tooltip formatter={(value) => formatINR(Number(value))} />
                                <Legend />
                                <Area type="monotone" dataKey="invested" stackId="1" stroke="#0d9488" fill="#e6f4f1" name="Invested" />
                                <Area type="monotone" dataKey="returns" stackId="2" stroke="#6366f1" fill="#e0e7ff" name="Growth Outlay" />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tab 4: Fixed Deposit */}
                  {activeTab === 'fd' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      <div className="lg:col-span-7 flex flex-col gap-6">
                        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Fixed Term Settings</h3>

                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-center text-sm font-semibold text-slate-600">
                            <span>Principal Investment</span>
                            <span className="text-teal-600 font-bold bg-teal-50 px-2.5 py-1 rounded-lg">{formatINR(fdPrincipal)}</span>
                          </div>
                          <input
                            type="range"
                            min="5000"
                            max="10000000"
                            step="5000"
                            value={fdPrincipal}
                            onChange={(e) => setFdPrincipal(Number(e.target.value))}
                            className="w-full accent-teal-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-xxs text-slate-400 font-bold tracking-wider">
                            <span>₹5,000</span>
                            <span>₹1 Crore</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-center text-sm font-semibold text-slate-600">
                            <span>FD Rate of Interest</span>
                            <span className="text-teal-600 font-bold bg-teal-50 px-2.5 py-1 rounded-lg">{fdRate}%</span>
                          </div>
                          <input
                            type="range"
                            min="3"
                            max="15"
                            step="0.1"
                            value={fdRate}
                            onChange={(e) => setFdRate(Number(e.target.value))}
                            className="w-full accent-teal-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-xxs text-slate-400 font-bold tracking-wider">
                            <span>3% p.a.</span>
                            <span>15% p.a.</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-600">Years (Tenure)</label>
                            <input
                              type="number"
                              min="1"
                              max="25"
                              value={fdYears}
                              onChange={(e) => setFdYears(Math.max(1, Number(e.target.value)))}
                              className="border border-slate-200 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-teal-600 font-bold text-slate-800 text-lg"
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-600">Compounding Frequency</label>
                            <select
                              value={fdCompounding}
                              onChange={(e) => setFdCompounding(Number(e.target.value))}
                              className="border border-slate-200 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-teal-600 font-bold text-slate-850 text-base bg-white"
                            >
                              <option value={12}>Compounded Monthly</option>
                              <option value={4}>Compounded Quarterly (Standard)</option>
                              <option value={2}>Compounded Half-Yearly</option>
                              <option value={1}>Compounded Annually</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="lg:col-span-5 flex flex-col gap-6 bg-slate-50 rounded-2xl p-6 border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900">Term Valuation</h3>
                        
                        <div className="grid grid-cols-1 gap-4">
                          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-1">
                            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Maturity Value</span>
                            <span className="text-3xl font-extrabold text-teal-700">{formatINR(fdResult.maturityAmount)}</span>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-1">
                              <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Principal Paid</span>
                              <span className="text-md font-bold text-slate-800">{formatINR(fdPrincipal)}</span>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-1">
                              <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Interest Accrued</span>
                              <span className="text-md font-bold text-slate-800">{formatINR(fdResult.interestEarned)}</span>
                            </div>
                          </div>
                        </div>

                        {fdResult.pieData.length > 0 && (
                          <div className="h-56 mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={fdResult.pieData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={60}
                                  outerRadius={80}
                                  paddingAngle={4}
                                  dataKey="value"
                                >
                                  {fdResult.pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                                </Pie>
                                <Tooltip formatter={(value) => formatINR(Number(value))} />
                                <Legend />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tab 5: RD Calculator */}
                  {activeTab === 'rd' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      <div className="lg:col-span-7 flex flex-col gap-6">
                        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Monthly Accruals</h3>

                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-center text-sm font-semibold text-slate-600">
                            <span>Monthly Deposit</span>
                            <span className="text-teal-600 font-bold bg-teal-50 px-2.5 py-1 rounded-lg">{formatINR(rdMonthly)}</span>
                          </div>
                          <input
                            type="range"
                            min="500"
                            max="200000"
                            step="500"
                            value={rdMonthly}
                            onChange={(e) => setRdMonthly(Number(e.target.value))}
                            className="w-full accent-teal-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-xxs text-slate-400 font-bold tracking-wider">
                            <span>₹500</span>
                            <span>₹2,00,000 /mo</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-center text-sm font-semibold text-slate-600">
                            <span>Expected Interest Rate</span>
                            <span className="text-teal-600 font-bold bg-teal-50 px-2.5 py-1 rounded-lg">{rdRate}%</span>
                          </div>
                          <input
                            type="range"
                            min="3"
                            max="15"
                            step="0.1"
                            value={rdRate}
                            onChange={(e) => setRdRate(Number(e.target.value))}
                            className="w-full accent-teal-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-xxs text-slate-400 font-bold tracking-wider">
                            <span>3% p.a.</span>
                            <span>15% p.a.</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-center text-sm font-semibold text-slate-600">
                            <span>Duration</span>
                            <span className="text-teal-600 font-bold bg-teal-50 px-2.5 py-1 rounded-lg">{rdYears} Years</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="25"
                            step="1"
                            value={rdYears}
                            onChange={(e) => setRdYears(Number(e.target.value))}
                            className="w-full accent-teal-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-xxs text-slate-400 font-bold tracking-wider">
                            <span>1 Year</span>
                            <span>25 Years</span>
                          </div>
                        </div>
                      </div>

                      <div className="lg:col-span-5 flex flex-col gap-6 bg-slate-50 rounded-2xl p-6 border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900">RD Projections</h3>
                        
                        <div className="grid grid-cols-1 gap-4">
                          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-1">
                            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Future Maturity Value</span>
                            <span className="text-3xl font-extrabold text-teal-800">{formatINR(rdResult.maturityAmount)}</span>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-1">
                              <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Total Deposited</span>
                              <span className="text-md font-bold text-slate-800">{formatINR(rdResult.totalDeposited)}</span>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-1">
                              <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Estimated Return</span>
                              <span className="text-md font-bold text-slate-800">{formatINR(rdResult.interestEarned)}</span>
                            </div>
                          </div>
                        </div>

                        {rdResult.growthData.length > 0 && (
                          <div className="h-56 mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={rdResult.growthData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} />
                                <YAxis tickFormatter={(val) => `₹${val/1000}K`} stroke="#94a3b8" fontSize={11} />
                                <Tooltip formatter={(value) => formatINR(Number(value))} />
                                <Legend />
                                <Area type="monotone" dataKey="deposited" stackId="1" stroke="#0d9488" fill="#e6f4f1" name="Principal" />
                                <Area type="monotone" dataKey="interest" stackId="2" stroke="#f59e0b" fill="#fef3c7" name="Returns" />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tab 6: PPF Calculator */}
                  {activeTab === 'ppf' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      <div className="lg:col-span-7 flex flex-col gap-6">
                        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Public Provident Fund Settings</h3>

                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-center text-sm font-semibold text-slate-600">
                            <span>Yearly Deposit (Max ₹1.5L)</span>
                            <span className="text-teal-600 font-bold bg-teal-50 px-2.5 py-1 rounded-lg">{formatINR(ppfYearly)}</span>
                          </div>
                          <input
                            type="range"
                            min="500"
                            max="150000"
                            step="500"
                            value={ppfYearly}
                            onChange={(e) => setPpfYearly(Number(e.target.value))}
                            className="w-full accent-teal-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-xxs text-slate-400 font-bold tracking-wider">
                            <span>₹500 / Yr</span>
                            <span>₹1,50,000 / Yr</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-center text-sm font-semibold text-slate-600">
                            <span>Tenure (Min 15 Years)</span>
                            <span className="text-teal-600 font-bold bg-teal-50 px-2.5 py-1 rounded-lg">{ppfYears} Years</span>
                          </div>
                          <input
                            type="range"
                            min="15"
                            max="50"
                            step="1"
                            value={ppfYears}
                            onChange={(e) => setPpfYears(Math.max(15, Number(e.target.value)))}
                            className="w-full accent-teal-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-xxs text-slate-400 font-bold tracking-wider">
                            <span>15 Years (Min)</span>
                            <span>50 Years</span>
                          </div>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-slate-650 text-xs leading-relaxed flex items-start gap-3">
                          <span className="p-1 px-2.5 font-bold text-white bg-teal-600 rounded-md text-xs">PPF Info</span>
                          <div>
                            PPF enjoys EEE (Exempt-Exempt-Exempt) tax status in India. Yearly interest compounding calculations use the standard prevailing PPF return rate of <strong>7.1%</strong>.
                          </div>
                        </div>
                      </div>

                      <div className="lg:col-span-5 flex flex-col gap-6 bg-slate-50 rounded-2xl p-6 border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900">Term Valuation</h3>
                        
                        <div className="grid grid-cols-1 gap-4">
                          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-1">
                            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Maturity Balance value</span>
                            <span className="text-3xl font-extrabold text-indigo-700">{formatINR(ppfResult.maturityValue)}</span>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-1">
                              <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Principal Paid</span>
                              <span className="text-md font-bold text-slate-800">{formatINR(ppfResult.totalInvested)}</span>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-1">
                              <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Interest Accrued</span>
                              <span className="text-md font-bold text-slate-800">{formatINR(ppfResult.interestEarned)}</span>
                            </div>
                          </div>
                        </div>

                        {ppfResult.growthData.length > 0 && (
                          <div className="h-56 mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={ppfResult.growthData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} />
                                <YAxis tickFormatter={(val) => `₹${val/1000}K`} stroke="#94a3b8" fontSize={11} />
                                <Tooltip formatter={(value) => formatINR(Number(value))} />
                                <Legend />
                                <Area type="monotone" dataKey="invested" stackId="1" stroke="#4f46e5" fill="#e0e7ff" name="Invested" />
                                <Area type="monotone" dataKey="interest" stackId="2" stroke="#6366f1" fill="#eef2ff" name="Cumulative Returns" />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tab 7: Compound Interest */}
                  {activeTab === 'compound' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      <div className="lg:col-span-7 flex flex-col gap-6">
                        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Compound Settings</h3>

                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-center text-sm font-semibold text-slate-600">
                            <span>Principal Value</span>
                            <span className="text-teal-600 font-bold bg-teal-50 px-2.5 py-1 rounded-lg">{formatINR(ciPrincipal)}</span>
                          </div>
                          <input
                            type="range"
                            min="1000"
                            max="10000000"
                            step="1000"
                            value={ciPrincipal}
                            onChange={(e) => setCiPrincipal(Number(e.target.value))}
                            className="w-full accent-teal-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-center text-sm font-semibold text-slate-600">
                            <span>Annual Interest Rate</span>
                            <span className="text-teal-600 font-bold bg-teal-50 px-2.5 py-1 rounded-lg">{ciRate}%</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="30"
                            step="0.1"
                            value={ciRate}
                            onChange={(e) => setCiRate(Number(e.target.value))}
                            className="w-full accent-teal-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-600">Years</label>
                            <input
                              type="number"
                              min="1"
                              max="40"
                              value={ciYears}
                              onChange={(e) => setCiYears(Math.max(1, Number(e.target.value)))}
                              className="border border-slate-200 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-teal-600 font-bold text-slate-800 text-lg"
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-600">Compounding Frequency</label>
                            <select
                              value={ciCompounding}
                              onChange={(e) => setCiCompounding(Number(e.target.value))}
                              className="border border-slate-200 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-teal-600 font-bold text-slate-850 text-base bg-white"
                            >
                              <option value={12}>Monthly compounding (12/yr)</option>
                              <option value={4}>Quarterly compounding (4/yr)</option>
                              <option value={2}>Half-Yearly compounding (2/yr)</option>
                              <option value={1}>Annually compounding (1/yr)</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="lg:col-span-5 flex flex-col gap-6 bg-slate-50 rounded-2xl p-6 border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900">Maturity Sum</h3>
                        
                        <div className="grid grid-cols-1 gap-4">
                          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-1">
                            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Total Accumulated Value</span>
                            <span className="text-3xl font-extrabold text-slate-950">{formatINR(ciResult.finalAmount)}</span>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-1">
                              <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase text-teal-600">Original Principal</span>
                              <span className="text-md font-bold text-slate-800">{formatINR(ciPrincipal)}</span>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-1">
                              <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase text-indigo-500">Compound Returns</span>
                              <span className="text-md font-bold text-slate-800">{formatINR(ciResult.interestEarned)}</span>
                            </div>
                          </div>
                        </div>

                        {ciResult.pieData.length > 0 && (
                          <div className="h-56 mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={ciResult.pieData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={60}
                                  outerRadius={80}
                                  paddingAngle={4}
                                  dataKey="value"
                                >
                                  {ciResult.pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                                </Pie>
                                <Tooltip formatter={(value) => formatINR(Number(value))} />
                                <Legend />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tab 8: Simple Interest */}
                  {activeTab === 'simple' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      <div className="lg:col-span-7 flex flex-col gap-6">
                        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Simple Interest Inputs</h3>

                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-center text-sm font-semibold text-slate-600">
                            <span>Principal Value</span>
                            <span className="text-teal-600 font-bold bg-teal-50 px-2.5 py-1 rounded-lg">{formatINR(siPrincipal)}</span>
                          </div>
                          <input
                            type="range"
                            min="1000"
                            max="5000000"
                            step="1000"
                            value={siPrincipal}
                            onChange={(e) => setSiPrincipal(Number(e.target.value))}
                            className="w-full accent-teal-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-center text-sm font-semibold text-slate-600">
                            <span>Simple Interest Rate</span>
                            <span className="text-teal-600 font-bold bg-teal-50 px-2.5 py-1 rounded-lg">{siRate}%</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="25"
                            step="0.5"
                            value={siRate}
                            onChange={(e) => setSiRate(Number(e.target.value))}
                            className="w-full accent-teal-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-center text-sm font-semibold text-slate-600">
                            <span>Duration Tenure</span>
                            <span className="text-teal-600 font-bold bg-teal-50 px-2.5 py-1 rounded-lg">{siYears} Years</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="30"
                            step="1"
                            value={siYears}
                            onChange={(e) => setSiYears(Number(e.target.value))}
                            className="w-full accent-teal-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                      </div>

                      <div className="lg:col-span-5 flex flex-col gap-6 bg-slate-50 rounded-2xl p-6 border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900">Total Accumulation</h3>
                        
                        <div className="grid grid-cols-1 gap-4">
                          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-1">
                            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Total Outlay Amount</span>
                            <span className="text-3xl font-extrabold text-[#702459]">{formatINR(siResult.totalAmount)}</span>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-1">
                              <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase text-teal-600">Principal</span>
                              <span className="text-md font-bold text-slate-800">{formatINR(siPrincipal)}</span>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-1">
                              <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase text-purple-600">Simple Interest</span>
                              <span className="text-md font-bold text-slate-800">{formatINR(siResult.interestEarned)}</span>
                            </div>
                          </div>
                        </div>

                        {siResult.pieData.length > 0 && (
                          <div className="h-56 mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={siResult.pieData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={60}
                                  outerRadius={80}
                                  paddingAngle={4}
                                  dataKey="value"
                                >
                                  {siResult.pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                                </Pie>
                                <Tooltip formatter={(value) => formatINR(Number(value))} />
                                <Legend />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tab 9: CAGR */}
                  {activeTab === 'cagr' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      <div className="lg:col-span-7 flex flex-col gap-6">
                        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">CAGR Inputs</h3>

                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-center text-sm font-semibold text-slate-600">
                            <span>Initial Buying Price (Value)</span>
                            <span className="text-teal-600 font-bold bg-teal-50 px-2.5 py-1 rounded-lg">{formatINR(cagrInitial)}</span>
                          </div>
                          <input
                            type="range"
                            min="1000"
                            max="5000000"
                            step="5000"
                            value={cagrInitial}
                            onChange={(e) => setCagrInitial(Number(e.target.value))}
                            className="w-full accent-teal-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-center text-sm font-semibold text-slate-600">
                            <span>Final Redeemed Value</span>
                            <span className="text-teal-600 font-bold bg-teal-50 px-2.5 py-1 rounded-lg">{formatINR(cagrFinal)}</span>
                          </div>
                          <input
                            type="range"
                            min="1000"
                            max="20000000"
                            step="5000"
                            value={cagrFinal}
                            onChange={(e) => setCagrFinal(Number(e.target.value))}
                            className="w-full accent-teal-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-center text-sm font-semibold text-slate-600">
                            <span>Compounding Duration</span>
                            <span className="text-teal-600 font-bold bg-teal-50 px-2.5 py-1 rounded-lg">{cagrYears} Years</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="30"
                            step="1"
                            value={cagrYears}
                            onChange={(e) => setCagrYears(Number(e.target.value))}
                            className="w-full accent-teal-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                      </div>

                      <div className="lg:col-span-5 flex flex-col gap-6 bg-slate-50 rounded-2xl p-6 border border-slate-100 items-center justify-center min-h-[300px]">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center mb-1">Compound Annual Growth Rate (CAGR)</span>
                        <div className="text-5xl font-extrabold text-teal-600 mb-2">{cagrResult.cagrPercentage}%</div>
                        <p className="text-xs text-slate-500 font-medium text-center max-w-xs leading-relaxed">
                          A compounding annual growth rate of <strong className="text-slate-700">{cagrResult.cagrPercentage}%</strong> means your initial investment of <strong className="text-slate-700">{formatINR(cagrInitial)}</strong> grew into <strong className="text-slate-700">{formatINR(cagrFinal)}</strong> over <strong className="text-slate-700">{cagrYears} years</strong>.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Tab 10: Loan Comparison */}
                  {activeTab === 'compare' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      {/* Inputs Column */}
                      <div className="lg:col-span-7 flex flex-col gap-6">
                        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Benchmark Loan Scenarios</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Loan 1 */}
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-4">
                            <h4 className="font-bold text-slate-800 text-sm tracking-tight border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
                              <span className="inline-block w-2.5 h-2.5 bg-teal-600 rounded-full"></span>
                              Loan Scenario 1
                            </h4>
                            
                            <div className="flex flex-col gap-1.5">
                              <label className="text-xxs font-bold text-slate-500 uppercase tracking-wider">Principal</label>
                              <input
                                type="number"
                                value={compP1}
                                onChange={(e) => setCompP1(Number(e.target.value))}
                                className="border border-slate-200 rounded-xl p-2 font-semibold bg-white text-sm"
                              />
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="text-xxs font-bold text-slate-500 uppercase tracking-wider">Interest Rate %</label>
                              <input
                                type="number"
                                step="0.1"
                                value={compR1}
                                onChange={(e) => setCompR1(Number(e.target.value))}
                                className="border border-slate-200 rounded-xl p-2 font-semibold bg-white text-sm"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-xxs font-bold text-slate-500 uppercase tracking-wider">Years</label>
                                <input
                                  type="number"
                                  value={compY1}
                                  onChange={(e) => setCompY1(Number(e.target.value))}
                                  className="border border-slate-200 rounded-xl p-2 font-semibold bg-white text-sm w-full"
                                />
                              </div>
                              <div>
                                <label className="text-xxs font-bold text-slate-500 uppercase tracking-wider">Months</label>
                                <input
                                  type="number"
                                  value={compM1}
                                  onChange={(e) => setCompM1(Number(e.target.value))}
                                  className="border border-slate-200 rounded-xl p-2 font-semibold bg-white text-sm w-full"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Loan 2 */}
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-4">
                            <h4 className="font-bold text-slate-800 text-sm tracking-tight border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
                              <span className="inline-block w-2.5 h-2.5 bg-blue-500 rounded-full"></span>
                              Loan Scenario 2
                            </h4>
                            
                            <div className="flex flex-col gap-1.5">
                              <label className="text-xxs font-bold text-slate-500 uppercase tracking-wider">Principal</label>
                              <input
                                type="number"
                                value={compP2}
                                onChange={(e) => setCompP2(Number(e.target.value))}
                                className="border border-slate-200 rounded-xl p-2 font-semibold bg-white text-sm"
                              />
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="text-xxs font-bold text-slate-500 uppercase tracking-wider">Interest Rate %</label>
                              <input
                                type="number"
                                step="0.1"
                                value={compR2}
                                onChange={(e) => setCompR2(Number(e.target.value))}
                                className="border border-slate-200 rounded-xl p-2 font-semibold bg-white text-sm"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-xxs font-bold text-slate-500 uppercase tracking-wider">Years</label>
                                <input
                                  type="number"
                                  value={compY2}
                                  onChange={(e) => setCompY2(Number(e.target.value))}
                                  className="border border-slate-200 rounded-xl p-2 font-semibold bg-white text-sm w-full"
                                />
                              </div>
                              <div>
                                <label className="text-xxs font-bold text-slate-500 uppercase tracking-wider">Months</label>
                                <input
                                  type="number"
                                  value={compM2}
                                  onChange={(e) => setCompM2(Number(e.target.value))}
                                  className="border border-slate-200 rounded-xl p-2 font-semibold bg-white text-sm w-full"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Comparison Columns */}
                      <div className="lg:col-span-5 flex flex-col gap-6 bg-slate-50 rounded-2xl p-6 border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900">Side-by-Side Savings Analysis</h3>
                        
                        <div className="space-y-4">
                          <div className="bg-teal-600 text-white p-4 rounded-xl flex flex-col gap-1 shadow-sm">
                            <span className="text-xs uppercase tracking-wider font-semibold opacity-85">More Economical Loan Option</span>
                            <span className="text-xl font-bold">{compareResult.cheaperOption === 'Equal' ? 'Both are equal' : `${compareResult.cheaperOption}`} is cheaper!</span>
                            {compareResult.savingsAmount > 0 && (
                              <span className="text-xs font-medium bg-white/20 inline-block px-2 py-0.5 rounded-md mt-1 self-start">Saving you {formatINR(compareResult.savingsAmount)} in total payouts</span>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col gap-1">
                              <span className="text-xxs font-bold text-slate-400 uppercase tracking-wider">Loan 1 EMI</span>
                              <span className="text-base font-extrabold text-teal-700">{formatINR(compareResult.loan1EMI)}</span>
                              <span className="text-xxs text-slate-500 mt-1 block">Total Owed: {formatINR(compareResult.loan1TotalPayment)}</span>
                            </div>

                            <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col gap-1">
                              <span className="text-xxs font-bold text-slate-400 uppercase tracking-wider">Loan 2 EMI</span>
                              <span className="text-base font-extrabold text-blue-600">{formatINR(compareResult.loan2EMI)}</span>
                              <span className="text-xxs text-slate-500 mt-1 block">Total Owed: {formatINR(compareResult.loan2TotalPayment)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Direct visual comparison in Recharts */}
                        <div className="h-44 mt-2">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={[
                                { name: 'Interest Cost', 'Scenario 1': compareResult.loan1TotalInterest, 'Scenario 2': compareResult.loan2TotalInterest },
                                { name: 'Total Cost', 'Scenario 1': compareResult.loan1TotalPayment, 'Scenario 2': compareResult.loan2TotalPayment }
                              ]}
                            >
                              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                              <YAxis tickFormatter={(val) => `₹${val/1000}K`} stroke="#94a3b8" fontSize={11} />
                              <Tooltip formatter={(value) => formatINR(Number(value))} />
                              <Legend />
                              <Bar dataKey="Scenario 1" fill="#0d9488" radius={[4, 4, 0, 0]} />
                              <Bar dataKey="Scenario 2" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab 11: India Income Tax Calculator */}
                  {activeTab === 'tax' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      <div className="lg:col-span-7 flex flex-col gap-6">
                        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Indian Income Details</h3>

                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-center text-sm font-semibold text-slate-600">
                            <span>Gross Annual Income (LPA)</span>
                            <span className="text-teal-600 font-bold bg-teal-50 px-2.5 py-1 rounded-lg">{formatINR(taxGross)}</span>
                          </div>
                          <input
                            type="range"
                            min="200000"
                            max="7500000"
                            step="25000"
                            value={taxGross}
                            onChange={(e) => setTaxGross(Number(e.target.value))}
                            className="w-full accent-teal-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-xxs text-slate-400 font-bold tracking-wider">
                            <span>₹2 Lakhs</span>
                            <span>₹75 Lakhs</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-center text-sm font-semibold text-slate-600">
                            <span>Applicable Deductions (Old Regime)</span>
                            <span className="text-teal-600 font-bold bg-teal-50 px-2.5 py-1 rounded-lg">{formatINR(taxDeductions)}</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="500000"
                            step="5000"
                            value={taxDeductions}
                            onChange={(e) => setTaxDeductions(Number(e.target.value))}
                            className="w-full accent-teal-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-xxs text-slate-400 font-bold tracking-wider">
                            <span>₹0 (Nil)</span>
                            <span>₹5,00,000 (80C, 80D, etc)</span>
                          </div>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-slate-650 text-xs leading-relaxed flex items-start gap-3">
                          <span className="p-1 px-2 font-bold text-white bg-teal-600 rounded">Tax Slabs Update</span>
                          <div>
                            Calculated using <strong>FY 2024-25 / AY 2025-26 rules</strong>. Under the New Regime, standard deduction is automatically applied at <strong>₹75,000</strong> with standard rebate up to 7L relative tax.
                          </div>
                        </div>
                      </div>

                      {/* Resulting tax regimes side-by-side */}
                      <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-6 bg-slate-50 rounded-2xl p-6 border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900 pb-2 border-b border-slate-200">Regime Benchmarking</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          
                          {/* Old Regime Summary */}
                          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3">
                            <div>
                              <span className="text-xxs uppercase tracking-wider text-slate-400 font-black block">Old Tax Regime</span>
                              <span className="text-2xl font-bold text-slate-800">{formatINR(taxResult.taxOldRegime)}</span>
                              <span className="text-xxs text-slate-500 block mt-1">Taxable Income: {formatINR(taxResult.taxableIncomeOld)}</span>
                            </div>

                            {taxResult.breakdownOld.length > 0 && (
                              <div className="text-xxs text-slate-500 space-y-1 mt-2 border-t border-slate-150 pt-2">
                                <span className="font-bold text-slate-600 block mb-1">Tax Slab Division</span>
                                {taxResult.breakdownOld.map((b, i) => (
                                  <div key={i} className="flex justify-between">
                                    <span>{b.slab}</span>
                                    <span className="font-semibold text-slate-850">{formatINR(b.tax)}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* New Regime Summary */}
                          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3">
                            <div>
                              <span className="text-xxs uppercase tracking-wider text-slate-400 font-black block">New Tax Regime</span>
                              <span className="text-2xl font-bold text-teal-700">{formatINR(taxResult.taxNewRegime)}</span>
                              <span className="text-xxs text-slate-500 block mt-1">Taxable Income: {formatINR(taxResult.taxableIncomeNew)}</span>
                            </div>

                            {taxResult.breakdownNew.length > 0 && (
                              <div className="text-xxs text-slate-500 space-y-1 mt-2 border-t border-slate-150 pt-2">
                                <span className="font-bold text-slate-600 block mb-1">Tax Slab Division</span>
                                {taxResult.breakdownNew.map((b, i) => (
                                  <div key={i} className="flex justify-between">
                                    <span>{b.slab}</span>
                                    <span className="font-semibold text-slate-850">{formatINR(b.tax)}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                        </div>

                        {/* Savings recommendation banner */}
                        <div className={`p-4 rounded-xl text-center text-sm font-semibold ${
                          taxResult.taxNewRegime < taxResult.taxOldRegime
                            ? 'bg-teal-50 text-teal-800'
                            : taxResult.taxOldRegime < taxResult.taxNewRegime
                            ? 'bg-indigo-50 text-indigo-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {taxResult.taxNewRegime < taxResult.taxOldRegime ? (
                            <span>New Regime saves you {formatINR(taxResult.taxOldRegime - taxResult.taxNewRegime)} annually!</span>
                          ) : taxResult.taxOldRegime < taxResult.taxNewRegime ? (
                            <span>Old Regime saves you {formatINR(taxResult.taxNewRegime - taxResult.taxOldRegime)} annually!</span>
                          ) : (
                            <span>Both options generate identical tax implications.</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab 12: Retirement Corpus Calculator */}
                  {activeTab === 'retirement' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      {/* Inputs Column */}
                      <div className="lg:col-span-7 flex flex-col gap-6">
                        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Retirement Settings</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-600">Current Age</label>
                            <input
                              type="number"
                              min="18"
                              max={retRetAge - 1}
                              value={retCurrentAge}
                              onChange={(e) => setRetCurrentAge(Math.min(retRetAge - 1, Math.max(18, Number(e.target.value))))}
                              className="border border-slate-200 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-teal-600 font-bold text-slate-800 text-lg"
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-600">Retirement Age</label>
                            <input
                              type="number"
                              min={retCurrentAge + 1}
                              max="80"
                              value={retRetAge}
                              onChange={(e) => setRetRetAge(Math.max(retCurrentAge + 1, Number(e.target.value)))}
                              className="border border-slate-200 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-teal-600 font-bold text-slate-800 text-lg"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-center text-sm font-semibold text-slate-600">
                            <span>Monthly Desired Expenses (Today's value)</span>
                            <span className="text-teal-600 font-bold bg-teal-50 px-2.5 py-1 rounded-lg">{formatINR(retExpenses)}</span>
                          </div>
                          <input
                            type="range"
                            min="5000"
                            max="500000"
                            step="5000"
                            value={retExpenses}
                            onChange={(e) => setRetExpenses(Number(e.target.value))}
                            className="w-full accent-teal-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-600">Inflation Rate %</label>
                            <input
                              type="number"
                              step="0.5"
                              value={retInflation}
                              onChange={(e) => setRetInflation(Number(e.target.value))}
                              className="border border-slate-200 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-teal-600 font-semibold text-slate-800 text-md"
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-600">Pre-Ret. Return %</label>
                            <input
                              type="number"
                              step="0.5"
                              value={retReturnPre}
                              onChange={(e) => setRetReturnPre(Number(e.target.value))}
                              className="border border-slate-200 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-teal-600 font-semibold text-slate-800 text-md"
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-600">Post-Ret. Return %</label>
                            <input
                              type="number"
                              step="0.5"
                              value={retReturnPost}
                              onChange={(e) => setRetReturnPost(Number(e.target.value))}
                              className="border border-slate-200 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-teal-600 font-semibold text-slate-800 text-md"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Required Corpus outcomes */}
                      <div className="lg:col-span-5 flex flex-col gap-6 bg-slate-50 rounded-2xl p-6 border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900">Capital Projections</h3>
                        
                        <div className="grid grid-cols-1 gap-4">
                          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-1">
                            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Desired Corpus on Retirement</span>
                            <span className="text-3xl font-extrabold text-teal-700">{formatINR(retirementResult.requiredCorpus)}</span>
                          </div>

                          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-1">
                            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Alternative Monthly Accumulation (SIP)</span>
                            <span className="text-xl font-extrabold text-indigo-700">{formatINR(retirementResult.monthlySavingsNeeded)} / month</span>
                          </div>
                        </div>

                        {/* Area Chart Projection over retirement horizon */}
                        {retirementResult.growthData.length > 0 && (
                          <div className="h-56 mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={retirementResult.growthData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} />
                                <YAxis tickFormatter={(val) => `₹${val/1000}K`} stroke="#94a3b8" fontSize={11} />
                                <Tooltip formatter={(value) => formatINR(Number(value))} />
                                <Legend />
                                <Area type="monotone" dataKey="investedNet" stroke="#0d9488" fill="#e6f4f1" name="Savings Principal" />
                                <Area type="monotone" dataKey="balance" stroke="#3730a3" fill="#e0e7ff" name="Est. Portfolio" />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                </motion.div>
              </AnimatePresence>

            </div>
          </div>

        </div>
      </main>
      
    </div>
  );
}
