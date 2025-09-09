#!/bin/bash

echo "🐾 Virtual Pet App - Testing Script"
echo "=================================="

# Test if backend is running
echo "Testing backend health endpoint..."
if curl -s --max-time 5 http://localhost:3001/api/health > /dev/null; then
    echo "✅ Backend is running"
else
    echo "❌ Backend is not running. Please start it with: cd backend && npm run dev"
    exit 1
fi

# Test registration endpoint
echo "Testing user registration..."
REGISTER_RESPONSE=$(curl -s --max-time 5 -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpassword123"}')

if echo "$REGISTER_RESPONSE" | grep -q "User created successfully"; then
    echo "✅ User registration works"
else
    echo "❌ User registration failed"
    echo "Response: $REGISTER_RESPONSE"
fi

# Test login endpoint
echo "Testing user login..."
LOGIN_RESPONSE=$(curl -s --max-time 5 -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpassword123"}')

if echo "$LOGIN_RESPONSE" | grep -q "Login successful"; then
    echo "✅ User login works"
    # Extract token for further testing
    TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
else
    echo "❌ User login failed"
    echo "Response: $LOGIN_RESPONSE"
    exit 1
fi

# Test pet endpoint
echo "Testing pet retrieval..."
PET_RESPONSE=$(curl -s --max-time 5 -X GET http://localhost:3001/api/pet \
  -H "Authorization: Bearer $TOKEN")

if echo "$PET_RESPONSE" | grep -q "Buddy"; then
    echo "✅ Pet retrieval works"
else
    echo "❌ Pet retrieval failed"
    echo "Response: $PET_RESPONSE"
fi

# Test feeding pet
echo "Testing pet feeding..."
FEED_RESPONSE=$(curl -s --max-time 5 -X POST http://localhost:3001/api/pet/feed \
  -H "Authorization: Bearer $TOKEN")

if echo "$FEED_RESPONSE" | grep -q "Pet fed successfully"; then
    echo "✅ Pet feeding works"
else
    echo "❌ Pet feeding failed"
    echo "Response: $FEED_RESPONSE"
fi

# Test premium feature (should fail for non-premium user)
echo "Testing premium feature access..."
PREMIUM_RESPONSE=$(curl -s --max-time 5 -X POST http://localhost:3001/api/pet/feed-premium \
  -H "Authorization: Bearer $TOKEN")

if echo "$PREMIUM_RESPONSE" | grep -q "Premium subscription required"; then
    echo "✅ Premium feature gating works correctly"
else
    echo "❌ Premium feature gating failed"
    echo "Response: $PREMIUM_RESPONSE"
fi

echo ""
echo "🎉 All tests completed!"
echo ""
echo "📱 Frontend should be running at: http://localhost:3000"
echo "🔧 Backend API is running at: http://localhost:3001"
echo ""
echo "💡 Try registering a new user and testing the pet features!"
echo "🚧 Remember: Payment integration is the exercise - not implemented yet!"
