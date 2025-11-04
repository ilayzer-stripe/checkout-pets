# CheckoutPets

A simple virtual pet application built with Node.js/TypeScript backend and React frontend.

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
