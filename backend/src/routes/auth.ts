import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';
import { PetModel } from '../models/Pet';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// Register endpoint
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Check if user already exists
    const existingUser = await UserModel.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const userId = await UserModel.create(username, hashedPassword);

    // Create initial pet for the user
    await PetModel.create(userId);

    // Get the created user to get the actual foodCount
    const createdUser = await UserModel.findById(userId);

    // Generate JWT token
    const token = jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '7d' });

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { 
        id: userId, 
        username, 
        isPremium: false, 
        foodCount: createdUser?.foodCount || 10 
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login endpoint
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find user
    const user = await UserModel.findByUsername(username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: { 
        id: user.id, 
        username: user.username, 
        isPremium: Boolean(user.isPremium),
        foodCount: user.foodCount
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user info
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = await UserModel.findById(req.user!.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        username: user.username,
        isPremium: Boolean(user.isPremium),
        foodCount: user.foodCount
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Upgrade user to premium (for testing)
router.post('/upgrade', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    await UserModel.updatePremiumStatus(req.user!.id, true);
    
    // Get updated user data from database
    const updatedUser = await UserModel.findById(req.user!.id);
    
    res.json({
      message: 'Successfully upgraded to premium!',
      user: {
        id: updatedUser!.id,
        username: updatedUser!.username,
        isPremium: true,
        foodCount: updatedUser!.foodCount
      }
    });
  } catch (error) {
    console.error('Upgrade error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Downgrade user to free (for testing)
router.post('/downgrade', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    await UserModel.updatePremiumStatus(req.user!.id, false);
    
    // Check if user's pet has a premium emoji and reset to free emoji if needed
    const pet = await PetModel.findByUserId(req.user!.id);
    if (pet) {
      const premiumTypes = ['rabbit', 'dragon'];
      if (premiumTypes.includes(pet.petType)) {
        // Reset to first free emoji (cat)
        await PetModel.updateAppearance(req.user!.id, 'cat', pet.color);
      }
    }
    
    // Get updated user data from database
    const updatedUser = await UserModel.findById(req.user!.id);
    
    res.json({
      message: 'Successfully downgraded to free!',
      user: {
        id: updatedUser!.id,
        username: updatedUser!.username,
        isPremium: false,
        foodCount: updatedUser!.foodCount
      }
    });
  } catch (error) {
    console.error('Downgrade error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Purchase food (for testing)
router.post('/purchase-food', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { amount, price } = req.body;
    
    if (!amount || !price || amount <= 0 || price <= 0) {
      return res.status(400).json({ error: 'Invalid amount or price' });
    }

    // Get current user
    const user = await UserModel.findById(req.user!.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Add food to user's account
    const newFoodCount = user.foodCount + amount;
    await UserModel.updateFoodCount(req.user!.id, newFoodCount);

    // Get updated user
    const updatedUser = await UserModel.findById(req.user!.id);
    
    res.json({
      message: `Successfully purchased ${amount} food!`,
      user: {
        id: updatedUser!.id,
        username: updatedUser!.username,
        isPremium: Boolean(updatedUser!.isPremium),
        foodCount: updatedUser!.foodCount
      }
    });
  } catch (error) {
    console.error('Purchase food error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
