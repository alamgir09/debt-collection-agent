export function validatePaymentPlan(
  paymentPlan: string, 
  totalDebt: number, 
  termLength: number, 
  paymentFrequency: string, 
  paymentAmount: number
): { isValid: boolean; message: string } {
  // Validate payment plan format
  const planRegex = /^\d+(\.\d{1,2})?$/;
  if (!planRegex.test(paymentPlan)) {
    return { 
      isValid: false, 
      message: "Invalid payment plan format. Please enter a valid number." 
    };
  }

  // Validate payment amount
  if (paymentAmount <= 0) {
    return { 
      isValid: false, 
      message: "Invalid payment amount. Please enter a positive number." 
    };
  }

  // Validate payment frequency
  if (!['weekly', 'biweekly', 'monthly'].includes(paymentFrequency)) {
    return { 
      isValid: false, 
      message: "Invalid payment frequency. Please choose weekly, biweekly, or monthly." 
    };
  }

  // Validate term length
  if (termLength < 3 || termLength > 24) {
    return { 
      isValid: false, 
      message: "Term length must be between 3 and 24 months." 
    };
  }

  // Calculate monthly equivalent payment
  const frequencyMultiplier = {
    weekly: 4,
    biweekly: 2,
    monthly: 1
  }[paymentFrequency];
  
  const monthlyEquivalent = paymentAmount * (frequencyMultiplier || 1);

  // Validate minimum monthly payment
  if (monthlyEquivalent < 120) {
    return { 
      isValid: false, 
      message: `Monthly payment must be at least $120. Your current plan equals $${monthlyEquivalent} per month.` 
    };
  }

  // Calculate total payments
  const totalPayments = paymentAmount * termLength;

  // Validate total payment amount
  if (Math.abs(totalPayments - totalDebt) > 0.10) {
    return { 
      isValid: false, 
      message: `Total payments ($${totalPayments.toFixed(2)}) must equal the debt amount ($${totalDebt}).` 
    };
  }

  return { 
    isValid: true, 
    message: "Payment plan is valid." 
  };
}


