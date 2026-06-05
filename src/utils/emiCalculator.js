// Calculate EMI using reducing balance formula
// P = principal, r = monthly interest rate (annual/12/100), n = tenure in months
export const calculateEMI = (principal, annualRate, tenureMonths) => {
  if (!principal || !annualRate || !tenureMonths) return 0;
  const monthlyRate = annualRate / 12 / 100;
  if (monthlyRate === 0) return principal / tenureMonths;
  const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  return Math.round(emi);
};

// Get interest rate based on loan type
export const getInterestRate = (loanType) => {
  switch (loanType) {
    case 'personal': return 10.5;
    case 'home': return 8.5;
    case 'business': return 14.0;
    default: return 10.5;
  }
};

// Total cost of borrowing = EMI * tenure - principal
export const getTotalCost = (emi, tenureMonths, principal) => (emi * tenureMonths) - principal;

// Processing fee = 1% of loan amount, min 2000, max 25000
export const getProcessingFee = (loanAmount) => {
  const fee = loanAmount * 0.01;
  return Math.min(Math.max(fee, 2000), 25000);
};

// Format Indian currency (e.g., 10,50,000)
export const formatIndianCurrency = (amount) => {
  if (!amount && amount !== 0) return '';
  const num = Number(amount);
  const [integer, decimal] = num.toFixed(0).split('.');
  const lastThree = integer.slice(-3);
  const otherNumbers = integer.slice(0, -3);
  const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + (otherNumbers ? ',' : '') + lastThree;
  return decimal ? `${formatted}.${decimal}` : formatted;
};