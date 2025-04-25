// src/baml_src/debt_negotiation.baml

class PaymentPlan {
  termLength int @description("Number of terms for the payment plan, between 3 and 24")
  totalDebtAmount float @description("Total debt amount")
  termPaymentAmount float @description("Amount per payment term")
  frequency "weekly" | "biweekly" | "monthly" @description("Frequency of payments")
}

class AssistantResponse {
  message string @description("The message to display to the user")
  status "negotiating" | "agreement_reached" | "need_clarification" @description("Current status of the negotiation")
  paymentPlan PaymentPlan? @description("Payment plan details, null during initial negotiation")
  paymentUrl string? @description("Payment URL, only included when status is agreement_reached")
}

class MyUserMessage {
  role "user" | "assistant"
  content string
  id string
}

function ChatWithLLM(messages: MyUserMessage[]) -> AssistantResponse {
  client CustomGPT4o
  prompt #"
    You are a debt collection agent assistant. Your role is to help negotiate payment plans with users who owe $2400.
    
    Key Guidelines:
    - Be professional but empathetic
    - Be concise and to the point
    - Offer flexible payment plans (monthly, biweekly, or weekly) only
    - Payment plans must be between 3-24 months
    - Monthly payment must be at least 5% of total debt ($120/month minimum)
    - If terms are unreasonable, counter with a better proposal
    - Once agreement is reached, provide a payment link

    Negotiation Approach:
    - Lead with empathy and understanding
    - Ask about their financial situation if unclear to get to know them and their situation
    - Then try to ask about their payment preferences and constraints
    - If possible, adapt payment schedules to their income timing (weekly/biweekly/monthly)
    - Try to offer payment plans that match their circumstances (but don't mix payment amounts)
    - If they're struggling, explore why before trying to propose solutions
    - Counter unreasonable proposals with educational explanations and don't give up
    
    Payment Plan Rules:
    - Minimum term length: 1 month
    - Maximum term length: 24 months
    - Minimum monthly payment: 5% of total debt ($120/month)
    - Payment frequencies allowed: weekly, biweekly, monthly
    - If user agrees to a payment within 0.1% or 10 cents (whichever is lower) of target amount, consider it valid
    
    Assistant Response Rules:
    1. Always provide a clear, empathetic message
    2. Set status to:
       - "negotiating" when discussing terms or understanding situation
       - "agreement_reached" when user accepts a valid plan
       - "need_clarification" when user's response is unclear
    3. For paymentPlan:
       - Include complete plan details when proposing or accepting terms
       - Set to null during initial negotiation or unclear responses
    4. For paymentUrl:
       - Only include when status is "agreement_reached"
       - Use format: collectwise.com/payments?termLength={termLength}&totalDebtAmount=2400&termPaymentAmount={termPaymentAmount}
       - Set to empty string ("") when not providing a payment link
    
    Previous conversation:
    {% for message in messages %}
    {{ message.role }}: {{ message.content }}
    {% endfor %}

    Assistant: Let me help with the debt negotiation.

    {{ ctx.output_format }}
  "#
}


test math_check_needed {
  functions [ChatWithLLM]
  args {
    messages [
      {
        role "user"
        content "How about $150 biweekly for 8 months?"
        id "1"
      }
    ]
  }
}

// Test basic negotiation start
test BasicNegotiationStart {
  functions [ChatWithLLM]
  args {
    messages [
      {
        role "user"
        content "I need to set up a payment plan for my $2400 debt."
        id "start-1"
      }
    ]
  }
}

// Test valid weekly payment plan
test ValidWeeklyPlan {
  functions [ChatWithLLM]
  args {
    messages [
      {
        role "user"
        content "I can pay $100 per week for 24 weeks."
        id "weekly-1"
      }
    ]
  }
}

// Test valid monthly payment plan
test ValidMonthlyPlan {
  functions [ChatWithLLM]
  args {
    messages [
      {
        role "user"
        content "I'd like to pay $400 monthly for 6 months."
        id "monthly-1"
      }
    ]
  }
}

// Test invalid payment amount (too low)
test InvalidLowPayment {
  functions [ChatWithLLM]
  args {
    messages [
      {
        role "user"
        content "I can only afford $20 per week."
        id "low-1"
      }
    ]
  }
}

// Test invalid term length (too long)
test InvalidTermLength {
  functions [ChatWithLLM]
  args {
    messages [
      {
        role "user"
        content "I want to pay $50 per month for 36 months."
        id "term-1"
      }
    ]
  }
}

// Test negotiation with multiple messages
test NegotiationFlow {
  functions [ChatWithLLM]
  args {
    messages [
      {
        role "user"
        content "I need to set up a payment plan for my debt."
        id "flow-1"
      },
      {
        role "assistant"
        content "I understand you need to set up a payment plan for your $2400 debt. What kind of monthly payment would work for your budget?"
        id "flow-2"
      },
      {
        role "user"
        content "I can do $200 per month."
        id "flow-3"
      }
    ]
  }
}

// Test edge case - exact minimum payment
test MinimumPayment {
  functions [ChatWithLLM]
  args {
    messages [
      {
        role "user"
        content "I want to pay exactly $120 per month."
        id "min-1"
      }
    ]
  }
}

// Test biweekly payment plan
test BiweeklyPlan {
  functions [ChatWithLLM]
  args {
    messages [
      {
        role "user"
        content "I get paid biweekly. Can I pay $200 every two weeks?"
        id "biweekly-1"
      }
    ]
  }
}

// Test handling unclear responses
test UnclearResponse {
  functions [ChatWithLLM]
  args {
    messages [
      {
        role "user"
        content "Maybe I can pay something each week, not sure how much though."
        id "unclear-1"
      }
    ]
  }
}

// Test validation feedback loop
test ValidationFeedback {
  functions [ChatWithLLM]
  args {
    messages [
      {
        role "user"
        content "I can pay $150 per week for 20 weeks."
        id "validation-1"
      },
      {
        role "assistant"
        content "That would exceed the total debt amount. Let me suggest a corrected plan."
        id "validation-2"
      },
      {
        role "user"
        content "Okay, what would work better?"
        id "validation-3"
      }
    ]
  }
}

// Test handling of special characters and formatting
test SpecialCharacters {
  functions [ChatWithLLM]
  args {
    messages [
      {
        role "user"
        content "I can pay $1,000.50 for 2.5 months!!!"
        id "special-1"
      }
    ]
  }
}

// Test agreement reached scenario
test AgreementReached {
  functions [ChatWithLLM]
  args {
    messages [
      {
        role "user"
        content "I agree to pay $100 weekly for 24 weeks."
        id "agreement-1"
      }
    ]
  }
}

// Test decimal payment amounts
test DecimalPaymentPlan {
  functions [ChatWithLLM]
  args {
    messages [
      {
        role "user"
        content "I can pay $156.50 every two weeks."
        id "decimal-1"
      }
    ]
  }
}

// Test decimal payment with cents
test DecimalCentsPayment {
  functions [ChatWithLLM]
  args {
    messages [
      {
        role "user"
        content "I'd like to do monthly payments of $267.75"
        id "decimal-2"
      }
    ]
  }
}

// Test early payoff inquiry
test EarlyPayoffInquiry {
  functions [ChatWithLLM]
  args {
    messages [
      {
        role "user"
        content "If I agree to $200 weekly payments, can I pay off the debt early if I get some extra money?"
        id "early-1"
      }
    ]
  }
}

// Test early payoff during existing plan
test EarlyPayoffExistingPlan {
  functions [ChatWithLLM]
  args {
    messages [
      {
        role "user"
        content "I've been paying $150 biweekly, but I just got my tax return. Can I pay off the remaining balance now?"
        id "early-2"
      },
      {
        role "assistant"
        content "Of course! Early payoff is always welcome. Would you like me to calculate your remaining balance and provide a direct payment link?"
        id "early-3"
      },
      {
        role "user"
        content "Yes please, I want to pay it all off now."
        id "early-4"
      }
    ]
  }
}

// Test partial early payoff
test PartialEarlyPayoff {
  functions [ChatWithLLM]
  args {
    messages [
      {
        role "user"
        content "I'm currently paying $120 monthly, but I got a bonus and can put $1000 towards the debt. Can I do that and then continue with smaller payments for the rest?"
        id "early-5"
      }
    ]
  }
}

// Test precision handling and loop prevention
test PrecisionHandling {
  functions [ChatWithLLM]
  args {
    messages [
      {
        role "user"
        content "I want to pay this off in 9 months with equal payments."
        id "precision-1"
      },
      {
        role "assistant"
        content "For a 9-month payment plan, each monthly payment should be $266.67, which totals exactly $2400. Does this work for you?"
        id "precision-2"
      },
      {
        role "user"
        content "yes"
        id "precision-3"
      }
    ]
  }
}