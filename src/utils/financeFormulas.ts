/**
 * Financial Calculation Formulas
 */

// 1. EMI Calculator
export interface EMIResult {
  monthlyEMI: number;
  totalInterest: number;
  totalPayment: number;
  pieData: { name: string; value: number; color: string }[];
}

export function calculateEMI(principal: number, interestRate: number, tenureYears: number, tenureMonths: number): EMIResult {
  const totalMonths = tenureYears * 12 + tenureMonths;
  if (totalMonths <= 0 || interestRate <= 0 || principal <= 0) {
    return { monthlyEMI: 0, totalInterest: 0, totalPayment: principal, pieData: [] };
  }

  const r = interestRate / 12 / 100;
  const emi = (principal * r * Math.pow(1 + r, totalMonths)) / (Math.pow(1 + r, totalMonths) - 1);
  const totalPayment = emi * totalMonths;
  const totalInterest = totalPayment - principal;

  return {
    monthlyEMI: Math.round(emi),
    totalInterest: Math.round(totalInterest),
    totalPayment: Math.round(totalPayment),
    pieData: [
      { name: 'Principal Amount', value: Math.round(principal), color: '#0d9488' }, // Teal
      { name: 'Interest Amount', value: Math.round(totalInterest), color: '#3b82f6' }  // Blue
    ]
  };
}

// 2. SIP Calculator
export interface SIPResult {
  maturityAmount: number;
  totalInvested: number;
  totalReturns: number;
  growthData: { year: number; invested: number; returns: number; total: number }[];
}

export function calculateSIP(monthlyInvestment: number, expectedReturnRate: number, years: number): SIPResult {
  const n = years * 12;
  const i = expectedReturnRate / 12 / 100;

  if (n <= 0 || i <= 0 || monthlyInvestment <= 0) {
    return { maturityAmount: 0, totalInvested: 0, totalReturns: 0, growthData: [] };
  }

  // Monthly compounding SIP formula: M = P * [ ( (1 + i)^n - 1 ) / i ] * (1 + i)
  const maturityAmount = monthlyInvestment * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
  const totalInvested = monthlyInvestment * n;
  const totalReturns = maturityAmount - totalInvested;

  const growthData = [];
  for (let y = 1; y <= years; y++) {
    const ny = y * 12;
    const matVal = monthlyInvestment * ((Math.pow(1 + i, ny) - 1) / i) * (1 + i);
    const investedVal = monthlyInvestment * ny;
    growthData.push({
      year: y,
      invested: Math.round(investedVal),
      returns: Math.round(Math.max(0, matVal - investedVal)),
      total: Math.round(matVal)
    });
  }

  return {
    maturityAmount: Math.round(maturityAmount),
    totalInvested: Math.round(totalInvested),
    totalReturns: Math.round(totalReturns),
    growthData
  };
}

// 3. Lump Sum Calculator
export interface LumpSumResult {
  futureValue: number;
  totalInvested: number;
  totalReturns: number;
  growthData: { year: number; invested: number; returns: number; total: number }[];
}

export function calculateLumpSum(investment: number, expectedReturnRate: number, years: number): LumpSumResult {
  const r = expectedReturnRate / 100;
  if (years <= 0 || investment <= 0) {
    return { futureValue: investment, totalInvested: investment, totalReturns: 0, growthData: [] };
  }

  const futureValue = investment * Math.pow(1 + r, years);
  const totalReturns = futureValue - investment;

  const growthData = [];
  for (let y = 1; y <= years; y++) {
    const fVal = investment * Math.pow(1 + r, y);
    growthData.push({
      year: y,
      invested: investment,
      returns: Math.round(fVal - investment),
      total: Math.round(fVal)
    });
  }

  return {
    futureValue: Math.round(futureValue),
    totalInvested: investment,
    totalReturns: Math.round(totalReturns),
    growthData
  };
}

// 4. FD Calculator
export interface FDResult {
  maturityAmount: number;
  interestEarned: number;
  pieData: { name: string; value: number; color: string }[];
}

export function calculateFD(principal: number, interestRate: number, years: number, compoundingFrequency: number): FDResult {
  if (principal <= 0 || interestRate <= 0 || years <= 0) {
    return { maturityAmount: principal, interestEarned: 0, pieData: [] };
  }

  const r = interestRate / 100;
  const n = compoundingFrequency; // quarterly: 4, monthly: 12, half-yearly: 2, yearly: 1
  const t = years;

  const maturityAmount = principal * Math.pow(1 + r / n, n * t);
  const interestEarned = maturityAmount - principal;

  return {
    maturityAmount: Math.round(maturityAmount),
    interestEarned: Math.round(interestEarned),
    pieData: [
      { name: 'Principal Amount', value: Math.round(principal), color: '#0d9488' },
      { name: 'Interest Earned', value: Math.round(interestEarned), color: '#f59e0b' } // Amber
    ]
  };
}

// 5. RD Calculator
export interface RDResult {
  maturityAmount: number;
  totalDeposited: number;
  interestEarned: number;
  growthData: { year: number; deposited: number; interest: number; total: number }[];
}

export function calculateRD(monthlyDeposit: number, interestRate: number, years: number): RDResult {
  const totalMonths = years * 12;
  if (monthlyDeposit <= 0 || interestRate <= 0 || years <= 0) {
    return { maturityAmount: 0, totalDeposited: 0, interestEarned: 0, growthData: [] };
  }

  // RD in India typically compiles quarterly interest. Here we implement monthly compounding for RD to keep it precise & elegant.
  const r = interestRate / 12 / 100;
  let maturityAmount = 0;
  let totalDeposited = 0;

  const growthData = [];

  for (let y = 1; y <= years; y++) {
    let currentMaturity = 0;
    const currentMonths = y * 12;
    for (let m = 1; m <= currentMonths; m++) {
      // Monthly compounding of each deposit for remaining tenure
      currentMaturity += monthlyDeposit * Math.pow(1 + r, currentMonths - m + 1);
    }
    const currentDeposited = monthlyDeposit * currentMonths;
    growthData.push({
      year: y,
      deposited: Math.round(currentDeposited),
      interest: Math.round(Math.max(0, currentMaturity - currentDeposited)),
      total: Math.round(currentMaturity)
    });

    if (y === years) {
      maturityAmount = currentMaturity;
      totalDeposited = currentDeposited;
    }
  }

  return {
    maturityAmount: Math.round(maturityAmount),
    totalDeposited: Math.round(totalDeposited),
    interestEarned: Math.round(maturityAmount - totalDeposited),
    growthData
  };
}

// 6. PPF Calculator
export interface PPFResult {
  maturityValue: number;
  totalInvested: number;
  interestEarned: number;
  growthData: { year: number; invested: number; interest: number; total: number }[];
}

export function calculatePPF(yearlyInvestment: number, years: number, interestRate: number = 7.1): PPFResult {
  if (yearlyInvestment <= 0 || years < 15) {
    return { maturityValue: 0, totalInvested: 0, interestEarned: 0, growthData: [] };
  }

  const r = interestRate / 100;
  let totalBalance = 0;
  let totalInvested = 0;

  const growthData = [];

  for (let y = 1; y <= years; y++) {
    totalInvested += yearlyInvestment;
    // Compounded annually. In PPF, interest is compiled at the end of the financial year.
    const interest = (totalBalance + yearlyInvestment) * r;
    totalBalance = totalBalance + yearlyInvestment + interest;

    growthData.push({
      year: y,
      invested: Math.round(totalInvested),
      interest: Math.round(totalBalance - totalInvested),
      total: Math.round(totalBalance)
    });
  }

  return {
    maturityValue: Math.round(totalBalance),
    totalInvested: Math.round(totalInvested),
    interestEarned: Math.round(totalBalance - totalInvested),
    growthData
  };
}

// 7. Compound Interest Calculator
export interface CIResult {
  finalAmount: number;
  interestEarned: number;
  pieData: { name: string; value: number; color: string }[];
}

export function calculateCompoundInterest(principal: number, interestRate: number, years: number, compoundingFrequency: number): CIResult {
  if (principal <= 0 || interestRate <= 0 || years <= 0) {
    return { finalAmount: principal, interestEarned: 0, pieData: [] };
  }

  const r = interestRate / 100;
  const n = compoundingFrequency;
  const finalAmount = principal * Math.pow(1 + r / n, n * years);
  const interestEarned = finalAmount - principal;

  return {
    finalAmount: Math.round(finalAmount),
    interestEarned: Math.round(interestEarned),
    pieData: [
      { name: 'Principal', value: Math.round(principal), color: '#0d9488' },
      { name: 'Compound Interest', value: Math.round(interestEarned), color: '#6366f1' } // Indigo
    ]
  };
}

// 8. Simple Interest Calculator
export interface SIResult {
  interestEarned: number;
  totalAmount: number;
  pieData: { name: string; value: number; color: string }[];
}

export function calculateSimpleInterest(principal: number, interestRate: number, years: number): SIResult {
  if (principal <= 0 || interestRate <= 0 || years <= 0) {
    return { interestEarned: 0, totalAmount: principal, pieData: [] };
  }

  const interestEarned = (principal * interestRate * years) / 100;
  const totalAmount = principal + interestEarned;

  return {
    interestEarned: Math.round(interestEarned),
    totalAmount: Math.round(totalAmount),
    pieData: [
      { name: 'Principal', value: Math.round(principal), color: '#0d9488' },
      { name: 'Simple Interest', value: Math.round(interestEarned), color: '#a855f7' } // Purple
    ]
  };
}

// 9. CAGR Calculator
export interface CAGRResult {
  cagrPercentage: number;
}

export function calculateCAGR(initialValue: number, finalValue: number, years: number): CAGRResult {
  if (initialValue <= 0 || finalValue <= 0 || years <= 0) {
    return { cagrPercentage: 0 };
  }

  const cagr = Math.pow(finalValue / initialValue, 1 / years) - 1;
  return {
    cagrPercentage: parseFloat((cagr * 100).toFixed(2))
  };
}

// 10. Loan Comparison Tool
export interface LoanCompareResult {
  loan1EMI: number;
  loan1TotalInterest: number;
  loan1TotalPayment: number;
  loan2EMI: number;
  loan2TotalInterest: number;
  loan2TotalPayment: number;
  cheaperOption: 'Loan 1' | 'Loan 2' | 'Equal';
  savingsAmount: number;
}

export function compareLoans(
  p1: number, r1: number, y1: number, m1: number,
  p2: number, r2: number, y2: number, m2: number
): LoanCompareResult {
  const l1 = calculateEMI(p1, r1, y1, m1);
  const l2 = calculateEMI(p2, r2, y2, m2);

  let cheaperOption: 'Loan 1' | 'Loan 2' | 'Equal' = 'Equal';
  let savingsAmount = 0;

  if (l1.totalPayment < l2.totalPayment) {
    cheaperOption = 'Loan 1';
    savingsAmount = l2.totalPayment - l1.totalPayment;
  } else if (l2.totalPayment < l1.totalPayment) {
    cheaperOption = 'Loan 2';
    savingsAmount = l1.totalPayment - l2.totalPayment;
  }

  return {
    loan1EMI: l1.monthlyEMI,
    loan1TotalInterest: l1.totalInterest,
    loan1TotalPayment: l1.totalPayment,
    loan2EMI: l2.monthlyEMI,
    loan2TotalInterest: l2.totalInterest,
    loan2TotalPayment: l2.totalPayment,
    cheaperOption,
    savingsAmount: Math.round(savingsAmount)
  };
}

// 11. Income Tax Estimator (FY 24-25, India)
export interface TaxResult {
  taxableIncomeOld: number;
  taxableIncomeNew: number;
  taxOldRegime: number;
  taxNewRegime: number;
  breakdownOld: { slab: string; tax: number }[];
  breakdownNew: { slab: string; tax: number }[];
}

export function calculateIncomeTaxIndia(grossIncome: number, deductions: number): TaxResult {
  // Standard deduction
  const standardDeductionOld = 50000;
  const standardDeductionNew = 75000; // Revised to 75,000 in Budget 2024 for New Regime

  // Taxable Incomes
  const taxableIncomeOld = Math.max(0, grossIncome - deductions - standardDeductionOld);
  const taxableIncomeNew = Math.max(0, grossIncome - standardDeductionNew); // Deductions generally not allowed in New regime except standard deduction

  // 1. Calculate Old Regime Tax
  let taxOld = 0;
  const breakdownOld: { slab: string; tax: number }[] = [];

  // Slabs for Old Regime:
  // Up to 2,50,000 : Nil
  // 2,50,001 to 5,00,000 : 5%
  // 5,00,001 to 10,00,000 : 20%
  // Above 10,00,000 : 30%
  // Rebate u/s 87A: If net taxable income <= 5L, tax is nil (rebate up to Rs. 12,500)

  if (taxableIncomeOld > 0) {
    let tempIncome = taxableIncomeOld;

    // Slab 1: Up to 2.5L
    const s1 = Math.min(tempIncome, 250000);
    tempIncome -= s1;

    // Slab 2: 2.5L to 5L (5%)
    const s2 = Math.min(tempIncome, 250000);
    const tax2 = s2 * 0.05;
    if (tax2 > 0) breakdownOld.push({ slab: '₹2.5L - ₹5L (5%)', tax: Math.round(tax2) });
    taxOld += tax2;
    tempIncome -= s2;

    // Slab 3: 5L to 10L (20%)
    const s3 = Math.min(tempIncome, 500000);
    const tax3 = s3 * 0.20;
    if (tax3 > 0) breakdownOld.push({ slab: '₹5L - ₹10L (20%)', tax: Math.round(tax3) });
    taxOld += tax3;
    tempIncome -= s3;

    // Slab 4: Above 10L (30%)
    if (tempIncome > 0) {
      const tax4 = tempIncome * 0.30;
      breakdownOld.push({ slab: '> ₹10L (30%)', tax: Math.round(tax4) });
      taxOld += tax4;
    }

    // Apply Rebate u/s 87A for Old Regime: Tax is nil if taxable income is <= Rs 5,00,000
    if (taxableIncomeOld <= 500000) {
      taxOld = 0;
      breakdownOld.length = 0;
      breakdownOld.push({ slab: 'Rebate u/s 87A', tax: 0 });
    }
  }

  // 2. Calculate New Regime Tax (Revised FY 2024-25 / AY 2025-26 slabs)
  // Up to ₹3,000,000: Nil
  // ₹300,001 to ₹700,000: 5%
  // ₹700,001 to ₹1,000,000: 10%
  // ₹1,000,001 to ₹1,200,000: 15% (Budget 24: adjusted slightly, wait: let's use the exact slab)
  // Exact revised slabs in FY 24-25 (New Regime):
  // Up to 3,00,000: Nil
  // 3,00,001 to 7,00,000: 5% (Earlier 3-6L: 5%)
  // 7,00,001 to 10,00,000: 10% (Earlier 6-9L: 10%)
  // 10,00,001 to 12,00,000: 15% (Earlier 9-12L: 15%)
  // 12,00,001 to 15,00,000: 20%
  // Above 15,00,000: 30%
  // Rebate u/s 87A: Net taxable income up to 7,00,000 gets rebate up to Rs 20,000 (effectively zero tax below 7L)

  let taxNew = 0;
  const breakdownNew: { slab: string; tax: number }[] = [];

  if (taxableIncomeNew > 0) {
    let tempIncome = taxableIncomeNew;

    // Slab 1: Up to 3L
    const s1 = Math.min(tempIncome, 300000);
    tempIncome -= s1;

    // Slab 2: 3L to 7L (5%)
    const s2 = Math.min(tempIncome, 400000);
    const tax2 = s2 * 0.05;
    if (tax2 > 0) breakdownNew.push({ slab: '₹3L - ₹7L (5%)', tax: Math.round(tax2) });
    taxNew += tax2;
    tempIncome -= s2;

    // Slab 3: 7L to 10L (10%)
    const s3 = Math.min(tempIncome, 300000);
    const tax3 = s3 * 0.10;
    if (tax3 > 0) breakdownNew.push({ slab: '₹7L - ₹10L (10%)', tax: Math.round(tax3) });
    taxNew += tax3;
    tempIncome -= s3;

    // Slab 4: 10L to 12L (15%)
    const s4 = Math.min(tempIncome, 200000);
    const tax4 = s4 * 0.15;
    if (tax4 > 0) breakdownNew.push({ slab: '₹10L - ₹12L (15%)', tax: Math.round(tax4) });
    taxNew += tax4;
    tempIncome -= s4;

    // Slab 5: 12L to 15L (20%)
    const s5 = Math.min(tempIncome, 300000);
    const tax5 = s5 * 0.20;
    if (tax5 > 0) breakdownNew.push({ slab: '₹12L - ₹15L (20%)', tax: Math.round(tax5) });
    taxNew += tax5;
    tempIncome -= s5;

    // Slab 6: Above 15L (30%)
    if (tempIncome > 0) {
      const tax6 = tempIncome * 0.30;
      breakdownNew.push({ slab: '> ₹15L (30%)', tax: Math.round(tax6) });
      taxNew += tax6;
    }

    // Apply Rebate u/s 87A for New Regime (up to Rs. 25,000 if income is <= 7L. Effectively zero tax up to 7L taxable income).
    if (taxableIncomeNew <= 700000) {
      taxNew = 0;
      breakdownNew.length = 0;
      breakdownNew.push({ slab: 'Rebate u/s 87A', tax: 0 });
    }
  }

  // Add 4% Health & Education Cess
  const finalTaxOld = taxOld + (taxOld * 0.04);
  const finalTaxNew = taxNew + (taxNew * 0.04);

  return {
    taxableIncomeOld: Math.round(taxableIncomeOld),
    taxableIncomeNew: Math.round(taxableIncomeNew),
    taxOldRegime: Math.round(finalTaxOld),
    taxNewRegime: Math.round(finalTaxNew),
    breakdownOld,
    breakdownNew
  };
}

// 12. Retirement Corpus Calculator
export interface RetirementResult {
  requiredCorpus: number;
  monthlySavingsNeeded: number;
  totalInvested: number;
  interestEarned: number;
  growthData: { year: number; balance: number; investedNet: number }[];
}

export function calculateRetirementCorpus(
  currentAge: number,
  retirementAge: number,
  monthlyExpenses: number,
  inflationRate: number,
  expectedReturnRate: number,
  postRetirementReturnRate: number = 6, // default conservative 6% post retirement return
  lifeExpectancy: number = 85
): RetirementResult {
  const yearsToRetirement = retirementAge - currentAge;
  const postRetirementYears = lifeExpectancy - retirementAge;

  if (yearsToRetirement <= 0 || postRetirementYears <= 0 || monthlyExpenses <= 0) {
    return { requiredCorpus: 0, monthlySavingsNeeded: 0, totalInvested: 0, interestEarned: 0, growthData: [] };
  }

  const rInflation = inflationRate / 100;
  const rReturnPre = expectedReturnRate / 100;
  const rReturnPost = postRetirementReturnRate / 100;

  // 1. Inflated Annual Expenses at retirement
  const annualExpensesAtRetirement = monthlyExpenses * 12 * Math.pow(1 + rInflation, yearsToRetirement);

  // 2. Real rate of return post retirement (for annuity calculation)
  // Adjusted for inflation: realRate = (return - inflation) / (1 + inflation)
  const realRatePost = (rReturnPost - rInflation) / (1 + rInflation);

  // 3. NPV of growing annuity post retirement (to sustain until life expectancy)
  let requiredCorpus = 0;
  if (Math.abs(realRatePost) < 0.0001) {
    requiredCorpus = annualExpensesAtRetirement * postRetirementYears;
  } else {
    requiredCorpus = annualExpensesAtRetirement * (1 - Math.pow(1 + realRatePost, -postRetirementYears)) / realRatePost;
  }

  // 4. Monthly SIP required to accumulate this corpus
  // Pre-retirement monthly return rate i
  const i = expectedReturnRate / 12 / 100;
  const totalMonths = yearsToRetirement * 12;

  let monthlySavingsNeeded = 0;
  if (i > 0) {
    // SIP future value formula: Corpus = SIP * [((1+i)^n - 1)/i] * (1+i)
    monthlySavingsNeeded = requiredCorpus / (((Math.pow(1 + i, totalMonths) - 1) / i) * (1 + i));
  } else {
    monthlySavingsNeeded = requiredCorpus / totalMonths;
  }

  // Generate growth projections
  const growthData = [];
  let balance = 0;
  let investedNet = 0;

  for (let y = 1; y <= yearsToRetirement; y++) {
    const months = y * 12;
    investedNet += monthlySavingsNeeded * 12;
    if (i > 0) {
      balance = monthlySavingsNeeded * (((Math.pow(1 + i, months) - 1) / i) * (1 + i));
    } else {
      balance = investedNet;
    }
    growthData.push({
      year: y,
      investedNet: Math.round(investedNet),
      balance: Math.round(balance)
    });
  }

  return {
    requiredCorpus: Math.round(requiredCorpus),
    monthlySavingsNeeded: Math.round(monthlySavingsNeeded),
    totalInvested: Math.round(investedNet),
    interestEarned: Math.round(Math.max(0, balance - investedNet)),
    growthData
  };
}
