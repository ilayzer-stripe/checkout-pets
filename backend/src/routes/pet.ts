import { Router, Response } from 'express';
import { PetModel } from '../models/Pet';
import { UserModel } from '../models/User';
import { authenticateToken, requirePremium, AuthRequest } from '../middleware/auth';

const router = Router();

// Get user's pet
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const pet = await PetModel.findByUserId(req.user!.id);
    if (!pet) {
      return res.status(404).json({ error: 'Pet not found' });
    }

    res.json({ pet });
  } catch (error) {
    console.error('Get pet error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Eat with pet
router.post('/eat', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    // Check if user has food
    const user = await UserModel.findById(req.user!.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.foodCount <= 0) {
      return res.status(400).json({ error: 'No food available! You need to get more food.' });
    }

    // Get current pet stats before eating
    const petBefore = await PetModel.findByUserId(req.user!.id);
    if (!petBefore) {
      return res.status(404).json({ error: 'Pet not found' });
    }

    // Check if pet has enough intelligence (Eating decreases intelligence by 4)
    if (petBefore.intelligence < 4) {
      return res.status(400).json({ error: 'Not smart enough! Eating requires 4 intelligence.' });
    }

    // Consume food
    const foodConsumed = await UserModel.consumeFood(req.user!.id);
    if (!foodConsumed) {
      return res.status(400).json({ error: 'No food available!' });
    }

    const isPremium = req.user!.isPremium;
    await PetModel.eat(req.user!.id, isPremium);
    const petAfter = await PetModel.findByUserId(req.user!.id);
    
    // Get updated user with new food count
    const updatedUser = await UserModel.findById(req.user!.id);
    
    // Calculate changes
    const happinessChange = petAfter!.happiness - petBefore.happiness;
    const energyChange = petAfter!.energy - petBefore.energy;
    const intelligenceChange = petAfter!.intelligence - petBefore.intelligence;
    
    res.json({ 
      message: isPremium ? 'Pet ate premium food!' : 'Pet ate successfully!',
      pet: petAfter,
      user: {
        id: updatedUser!.id,
        username: updatedUser!.username,
        isPremium: Boolean(updatedUser!.isPremium),
        foodCount: updatedUser!.foodCount
      },
      changes: {
        happiness: happinessChange,
        energy: energyChange,
        intelligence: intelligenceChange
      }
    });
  } catch (error) {
    console.error('Eat pet error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Play with pet (premium feature)
router.post('/play', authenticateToken, requirePremium, async (req: AuthRequest, res: Response) => {
  try {
    // Get current pet stats before playing
    const petBefore = await PetModel.findByUserId(req.user!.id);
    if (!petBefore) {
      return res.status(404).json({ error: 'Pet not found' });
    }

    // Check if pet has enough energy (Play costs 5 energy)
    if (petBefore.energy < 5) {
      return res.status(400).json({ error: 'Not enough energy! Play costs 5 energy.' });
    }

    await PetModel.play(req.user!.id);
    const petAfter = await PetModel.findByUserId(req.user!.id);
    
    // Calculate changes
    const happinessChange = petAfter!.happiness - petBefore.happiness;
    const energyChange = petAfter!.energy - petBefore.energy;
    const intelligenceChange = petAfter!.intelligence - petBefore.intelligence;
    
    res.json({ 
      message: 'Played with pet!',
      pet: petAfter,
      changes: {
        happiness: happinessChange,
        energy: energyChange,
        intelligence: intelligenceChange
      }
    });
  } catch (error) {
    console.error('Play with pet error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Study with pet (premium feature)
router.post('/study', authenticateToken, requirePremium, async (req: AuthRequest, res: Response) => {
  try {
    // Get current pet stats before studying
    const petBefore = await PetModel.findByUserId(req.user!.id);
    if (!petBefore) {
      return res.status(404).json({ error: 'Pet not found' });
    }

    // Check if pet has enough energy (Study costs 6 energy)
    if (petBefore.energy < 6) {
      return res.status(400).json({ error: 'Not enough energy! Study costs 6 energy.' });
    }

    await PetModel.study(req.user!.id);
    const petAfter = await PetModel.findByUserId(req.user!.id);
    
    // Calculate changes
    const happinessChange = petAfter!.happiness - petBefore.happiness;
    const energyChange = petAfter!.energy - petBefore.energy;
    const intelligenceChange = petAfter!.intelligence - petBefore.intelligence;
    
    res.json({ 
      message: 'Studied with pet!',
      pet: petAfter,
      changes: {
        happiness: happinessChange,
        energy: energyChange,
        intelligence: intelligenceChange
      }
    });
  } catch (error) {
    console.error('Study with pet error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update pet name
router.put('/name', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.body;
    
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: 'Pet name is required' });
    }

    await PetModel.updateName(req.user!.id, name.trim());
    const pet = await PetModel.findByUserId(req.user!.id);
    
    res.json({ 
      message: 'Pet name updated!',
      pet 
    });
  } catch (error) {
    console.error('Update pet name error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update pet appearance (premium feature)
router.put('/appearance', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { petType, color } = req.body;
    
    // Allow updating just petType (emoji) for all users
    if (petType) {
      const freeTypes = ['cat', 'dog', 'bird'];
      const premiumTypes = ['rabbit', 'dragon'];
      const allTypes = [...freeTypes, ...premiumTypes];
      
      if (!allTypes.includes(petType)) {
        return res.status(400).json({ error: 'Invalid pet type' });
      }

      // Check if user is trying to use a premium pet type
      if (premiumTypes.includes(petType) && !req.user!.isPremium) {
        return res.status(403).json({ error: 'Premium subscription required for rabbit and dragon pets' });
      }

      await PetModel.updateAppearance(req.user!.id, petType, req.body.color || 'orange');
      const pet = await PetModel.findByUserId(req.user!.id);
      
      res.json({ 
        message: 'Pet emoji updated!',
        pet 
      });
    } else if (color) {
      // Color changes still require premium
      if (!req.user!.isPremium) {
        return res.status(403).json({ error: 'Premium subscription required for color customization' });
      }

      const allowedColors = ['orange', 'black', 'white', 'brown', 'gray', 'gold'];

      if (!allowedColors.includes(color)) {
        return res.status(400).json({ error: 'Invalid color' });
      }

      await PetModel.updateAppearance(req.user!.id, req.body.petType || 'cat', color);
      const pet = await PetModel.findByUserId(req.user!.id);
      
      res.json({ 
        message: 'Pet color updated!',
        pet 
      });
    } else {
      return res.status(400).json({ error: 'Pet type or color is required' });
    }
  } catch (error) {
    console.error('Update pet appearance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reset pet stats (for testing)
router.post('/reset', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    // Reset pet stats to 50%
    await PetModel.updateStats(req.user!.id, {
      happiness: 50,
      intelligence: 50,
      energy: 50
    });
    
    // Reset user's food count to default (10)
    await UserModel.updateFoodCount(req.user!.id, 10);
    
    const pet = await PetModel.findByUserId(req.user!.id);
    const user = await UserModel.findById(req.user!.id);
    
    res.json({ 
      message: 'Pet stats and food count reset successfully!',
      pet,
      user: {
        id: user!.id,
        username: user!.username,
        isPremium: Boolean(user!.isPremium),
        foodCount: user!.foodCount
      }
    });
  } catch (error) {
    console.error('Reset pet stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
