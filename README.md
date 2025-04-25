# Debt Collection Agent

An AI-powered debt collection chatbot that helps negotiate payment plans with empathy and efficiency.

## Architecture

The application is built using:
- Next.js 15 (App Router)
- BAML for AI interactions
- Tailwind CSS for styling
- Shadcn UI for components

Key components:
```
src/
├── app/
│   ├── chat/        # Chat interface
│   ├── components/  # Reusable UI components
│   └── lib/
│       ├── ai/      # AI logic and chat handling
│       └── utils/   # Validation and helpers
├── baml_src/        # BAML definitions
└── baml_client/     # Generated BAML client
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000/chat](http://localhost:3000/chat) in your browser

## How It Works

1. **Initial Interaction**:
   - Visit the /chat route
   - The chatbot waits 3 seconds before prompting you about debt payment
   - Initial debt amount is set to $2400

2. **Payment Plan Negotiation**:
   - Supports weekly, biweekly, or monthly payments
   - Minimum monthly payment: $120 (5% of total debt)
   - Term length: 1-24 months
   - Handles decimal amounts and early payoff requests

3. **Features**:
   - Real-time validation of payment plans
   - Empathetic responses
   - Flexible payment scheduling
   - Early payoff options
   - Clear error handling

4. **Example Interactions**:
   - "I can pay $100 weekly"
   - "I get paid biweekly, can I pay $200 every two weeks?"
   - "I want to pay $400 monthly"

## Testing

The system includes was briefly tested with cases covering:
- Valid payment plans
- Edge cases
- Error scenarios
- Decimal amounts
- Early payoff requests
```

## Note

This is a demonstration project. The payment URLs generated are mock URLs and do not process actual payments.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
