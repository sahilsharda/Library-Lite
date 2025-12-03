// Fine calculation service

// Configuration
const FINE_CONFIG = {
  dailyFineRate: 2.0, // $2 per day
  maxFine: 100.0, // Maximum fine cap
  gracePeriodDays: 0, // No grace period
};

/**
 * Calculate fine for an overdue loan
 * @param {Date} dueDate - The due date of the loan
 * @param {Date} returnDate - The return date (null if not returned yet)
 * @returns {number} - The calculated fine amount
 */
export const calculateFine = (dueDate, returnDate = null) => {
  const today = returnDate ? new Date(returnDate) : new Date();
  const due = new Date(dueDate);

  // Calculate days overdue
  const diffTime = today - due;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // No fine if not overdue or within grace period
  if (diffDays <= FINE_CONFIG.gracePeriodDays) {
    return 0;
  }

  // Calculate fine
  const overdueDays = diffDays - FINE_CONFIG.gracePeriodDays;
  const calculatedFine = overdueDays * FINE_CONFIG.dailyFineRate;

  // Apply maximum fine cap
  return Math.min(calculatedFine, FINE_CONFIG.maxFine);
};

/**
 * Check if a loan is overdue
 * @param {Date} dueDate - The due date of the loan
 * @param {Date} returnDate - The return date (null if not returned yet)
 * @returns {boolean} - True if overdue, false otherwise
 */
export const isOverdue = (dueDate, returnDate = null) => {
  if (returnDate) return false; // Already returned

  const today = new Date();
  const due = new Date(dueDate);

  return today > due;
};

/**
 * Get the number of days overdue
 * @param {Date} dueDate - The due date of the loan
 * @returns {number} - Number of days overdue (0 if not overdue)
 */
export const getDaysOverdue = (dueDate) => {
  const today = new Date();
  const due = new Date(dueDate);

  const diffTime = today - due;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return Math.max(0, diffDays);
};

/**
 * Update fine for a loan based on current date
 * @param {Object} loan - The loan object with dueDate and returnDate
 * @returns {number} - The updated fine amount
 */
export const updateLoanFine = (loan) => {
  if (loan.returnDate) {
    // Loan is returned, calculate final fine
    return calculateFine(loan.dueDate, loan.returnDate);
  }

  if (isOverdue(loan.dueDate)) {
    // Loan is overdue, calculate current fine
    return calculateFine(loan.dueDate);
  }

  // Loan is not overdue yet
  return 0;
};

/**
 * Get loan status based on dates
 * @param {Date} dueDate - The due date of the loan
 * @param {Date} returnDate - The return date (null if not returned yet)
 * @returns {string} - Status: 'returned', 'overdue', or 'borrowed'
 */
export const getLoanStatus = (dueDate, returnDate) => {
  if (returnDate) return "returned";
  if (isOverdue(dueDate)) return "overdue";
  return "borrowed";
};

export default {
  calculateFine,
  isOverdue,
  getDaysOverdue,
  updateLoanFine,
  getLoanStatus,
  FINE_CONFIG,
};
