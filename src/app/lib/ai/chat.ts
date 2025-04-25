'use server'

import { b, MyUserMessage, AssistantResponse } from '@/baml_client';
import { validatePaymentPlan } from '../utils/validation';

export async function handleChatMessage(messages: MyUserMessage[]): Promise<string> {
  try {
    // Simplify message handling to avoid hydration issues
    const validMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content,
      id: msg.id
    }));

    const rawResponse = await b.ChatWithLLM(validMessages);
    
    if (!rawResponse || typeof rawResponse !== 'object') {
      throw new Error('Invalid response from AI');
    }

    const response = rawResponse as AssistantResponse;

    if (response.status === 'agreement_reached' && response.paymentPlan) {
      return handlePaymentValidation(validMessages, response);
    }

    return response.message;

  } catch (error) {
    console.error('Chat error:', error);
    return 'An error occurred. Please try again.';
  }
}

async function handlePaymentValidation(
  messages: MyUserMessage[],
  response: AssistantResponse,
  attempts: number = 0
): Promise<string> {
  // Limit recursion to prevent infinite loops
  if (attempts >= 3) {
    return "I apologize, but I'm having trouble calculating a valid payment plan. Let's start over with a new proposal. Please try again.";
  }

  const plan = response.paymentPlan;
  if (!plan) return response.message;

  const validation = validatePaymentPlan(
    plan.termPaymentAmount.toString(),
    2400,
    plan.termLength,
    plan.frequency,
    plan.termPaymentAmount
  );

  if (validation.isValid) {
    return `${response.message}\n\nPayment Plan: $${plan.termPaymentAmount}\n\nFrequency: ${plan.frequency}\n\nTerm: ${plan.termLength} months\n\nHere's your payment link: ${response.paymentUrl}`;
  }

  // Add validation feedback to messages
  const newMessages = [
    ...messages,
    {
      role: "assistant" as const,
      content: response.message,
      id: `attempt-${attempts}-response`
    },
    {
      role: "user" as const,
      content: `The payment plan was incorrect: ${validation.message}. Please recalculate and suggest a corrected payment plan that equals exactly $2400.`,
      id: `attempt-${attempts}-validation`
    }
  ];

  // Try again with the validation feedback
  const newResponse = await b.ChatWithLLM(newMessages);
  return handlePaymentValidation(newMessages, newResponse as AssistantResponse, attempts + 1);
}