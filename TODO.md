# Debt Collection Agent TODO

## ✨ Setup & Structure
- [x] Create Next.js project with TypeScript
- [x] Deploy to Vercel
- [x] Set up BAML integration
- [x] Configure environment variables

## 🎨 Frontend
- [x] Research chatbot UI designs
- [x] Build chat interface components:
  - [x] Chat container
  - [x] Message bubbles
  - [x] Input field
  - [x] Loading states
  - [ ] Payment plan display
- [x] Mobile Responsive
- [x] Implement localStorage for message persistence
- [x] Auto-scrolling to latest messages

## 🤖 Backend (BAML)
- [x] Set up initial prompt structure
- [x] Implement core functions:
  - [x] Initial $2,400 debt notification
  - [x] Basic message handling
  - [ ] Payment plan negotiation logic
  - [ ] Payment validation (reject unrealistic offers)
  - [ ] URL generation: `collectwise.com/payments?termLength={}&totalDebtAmount={}&termPaymentAmount={}`

## 🔄 Integration
- [x] Connect frontend to BAML
- [x] Implement real-time chat updates
- [x] Add error handling
- [ ] Test payment plan scenarios:
  - [ ] $800/month for 3 months
  - [ ] $400/month for 6 months
  - [ ] Handle unrealistic proposals

## 🧪 Testing & Polish
- [x] Basic error states and recovery
- [x] Loading indicators
- [ ] Test negotiation flows
- [ ] Improve agent responses
- [ ] Add comprehensive payment validation
- [ ] Implement payment link generation

## ✅ Completed Features
- Next.js + TypeScript setup
- BAML integration
- Chat UI components
- Message persistence
- Error handling
- Loading states
- Auto-scrolling
- Initial debt notification
- Basic conversation flow

## 🚧 Remaining Tasks
1. Implement payment plan validation logic
2. Add payment link generation
3. Enhance BAML prompt for better negotiation
4. Test various payment scenarios
5. Add comprehensive payment validation rules