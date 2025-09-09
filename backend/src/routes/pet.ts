import { Router, Response } from 'express';
import { PetModel } from '../models/Pet';
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

// Feed pet (basic food)
router.post('/feed', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    // Get current pet stats before feeding
    const petBefore = await PetModel.findByUserId(req.user!.id);
    if (!petBefore) {
      return res.status(404).json({ error: 'Pet not found' });
    }

    await PetModel.feed(req.user!.id, 'basic');
    const petAfter = await PetModel.findByUserId(req.user!.id);
    
    // Calculate changes
    const hungerChange = petAfter!.hunger - petBefore.hunger;
    const happinessChange = petAfter!.happiness - petBefore.happiness;
    
    res.json({ 
      message: 'Pet fed successfully!',
      pet: petAfter,
      changes: {
        hunger: hungerChange,
        happiness: happinessChange
      }
    });
  } catch (error) {
    console.error('Feed pet error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Feed pet with premium food (premium feature)
router.post('/feed-premium', authenticateToken, requirePremium, async (req: AuthRequest, res: Response) => {
  try {
    // Get current pet stats before feeding
    const petBefore = await PetModel.findByUserId(req.user!.id);
    if (!petBefore) {
      return res.status(404).json({ error: 'Pet not found' });
    }

    await PetModel.feed(req.user!.id, 'premium');
    const petAfter = await PetModel.findByUserId(req.user!.id);
    
    // Calculate changes
    const hungerChange = petAfter!.hunger - petBefore.hunger;
    const happinessChange = petAfter!.happiness - petBefore.happiness;
    
    res.json({ 
      message: 'Pet fed with premium food!',
      pet: petAfter,
      changes: {
        hunger: hungerChange,
        happiness: happinessChange
      }
    });
  } catch (error) {
    console.error('Feed premium pet error:', error);
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

    await PetModel.play(req.user!.id);
    const petAfter = await PetModel.findByUserId(req.user!.id);
    
    // Calculate changes
    const energyChange = petAfter!.energy - petBefore.energy;
    const happinessChange = petAfter!.happiness - petBefore.happiness;
    
    res.json({ 
      message: 'Played with pet!',
      pet: petAfter,
      changes: {
        energy: energyChange,
        happiness: happinessChange
      }
    });
  } catch (error) {
    console.error('Play with pet error:', error);
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
router.put('/appearance', authenticateToken, requirePremium, async (req: AuthRequest, res: Response) => {
  try {
    const { petType, color } = req.body;
    
    if (!petType || !color) {
      return res.status(400).json({ error: 'Pet type and color are required' });
    }

    const allowedTypes = ['cat', 'dog', 'bird', 'rabbit'];
    const allowedColors = ['orange', 'black', 'white', 'brown', 'gray', 'gold'];

    if (!allowedTypes.includes(petType) || !allowedColors.includes(color)) {
      return res.status(400).json({ error: 'Invalid pet type or color' });
    }

    await PetModel.updateAppearance(req.user!.id, petType, color);
    const pet = await PetModel.findByUserId(req.user!.id);
    
    res.json({ 
      message: 'Pet appearance updated!',
      pet 
    });
  } catch (error) {
    console.error('Update pet appearance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reset pet stats (for testing)
router.post('/reset', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    await PetModel.updateStats(req.user!.id, {
      happiness: 50,
      hunger: 50,
      energy: 50
    });
    const pet = await PetModel.findByUserId(req.user!.id);
    
    res.json({ 
      message: 'Pet stats reset successfully!',
      pet 
    });
  } catch (error) {
    console.error('Reset pet stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
