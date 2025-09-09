# CheckoutPets - Stripe Onboarding Exercise

A simple virtual pet application built with Node.js/TypeScript backend and React frontend, designed as a Stripe onboarding exercise.

## Current Features (Complete App)

### Free Features
- User registration and authentication
- Basic pet care (feed with basic food)
- Pet stats tracking (happiness, hunger, energy)
- Pet name customization

### Premium Features (Currently Gated)
- Premium food with better stat bonuses
- Pet customization (different types and colors)
- Mini-games to play with your pet
- Advanced pet interactions

**Note**: Premium features are currently blocked by server-side validation but have NO payment integration. This is intentional - the exercise is to add Stripe payments to unlock these features.

## Tech Stack

### Backend
- Node.js + TypeScript + Express
- SQLite3 database
- JWT authentication
- bcrypt password hashing
- Stripe integration

### Frontend
- React + TypeScript
- Axios for API calls
- Context API for state management

## Quick Start

### Option 1: Start Everything at Once (Recommended)
```bash
# Install all dependencies
npm run install:all

# Start both backend and frontend
npm run dev
```

### Option 2: Manual Setup

#### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with:
   ```
   DATABASE_URL="file:./database.db"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   PORT=3001
   FRONTEND_URL="http://localhost:3000"
   STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key_here"
   STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key_here"
   STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret_here"
   PREMIUM_PRICE_ID="price_your_premium_price_id_here"
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

#### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Available Scripts

From the project root, you can run:

- `npm run dev` - Start both backend and frontend servers
- `npm run backend` - Start only the backend server
- `npm run frontend` - Start only the frontend server
- `npm run install:all` - Install dependencies for both projects
- `npm test` - Run the test suite to verify everything is working

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Pet Management
- `GET /api/pet` - Get user's pet
- `POST /api/pet/feed` - Feed pet (basic food)
- `POST /api/pet/feed-premium` - Feed pet (premium food) - Premium only
- `POST /api/pet/play` - Play with pet - Premium only
- `PUT /api/pet/name` - Update pet name
- `PUT /api/pet/appearance` - Update pet appearance - Premium only


## Exercise Goals

This app is designed to help new hires learn:
- Full-stack development with TypeScript
- Database design and management
- Authentication and authorization
- API design and implementation
- Stripe payment integration
- Frontend-backend communication

## The Exercise: Add Stripe Payments

**Your Task**: Add Stripe Checkout integration to unlock premium features.

### What You Need to Implement:

1. **Stripe Setup**
   - Create a Stripe account and get your API keys
   - Set up a product and price in Stripe Dashboard
   - Update the `.env` file with your Stripe keys

2. **Backend Integration**
   - Create Stripe checkout session endpoint (`POST /api/stripe/create-checkout-session`)
   - Add Stripe webhook handler (`POST /api/stripe/webhook`)
   - Update user premium status when payment succeeds

3. **Frontend Integration**
   - Create a paywall modal component
   - Add "Upgrade to Premium" buttons throughout the app
   - Handle successful payments and update UI state

4. **Testing**
   - Test the complete payment flow
   - Verify premium features unlock after payment
   - Test webhook handling

### Current State:
- ✅ Complete authentication system
- ✅ Pet management with stats tracking
- ✅ Premium feature gating (server-side validation)
- ✅ Frontend UI with premium feature buttons
- ❌ **Missing**: Stripe payment integration

### Files to Focus On:
- `backend/src/routes/stripe.ts` (create this)
- `frontend/src/components/PaywallModal.tsx` (create this)
- Update existing components to show upgrade prompts
- Add Stripe webhook handling to `backend/src/index.ts`

### Success Criteria:
- Users can click "Upgrade to Premium" and complete payment
- After successful payment, premium features become available
- User's premium status persists across sessions
- Webhook properly updates user premium status

**Hint**: Start with the Stripe Checkout documentation and work your way through the integration step by step!
