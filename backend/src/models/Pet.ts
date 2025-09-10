import { dbGet, dbRun } from '../database/init';
import { randomUUID } from 'crypto';

export interface Pet {
  id: string;
  name: string;
  happiness: number;
  intelligence: number;
  energy: number;
  petType: string;
  color: string;
  userId: string;
}

export class PetModel {
  static async create(userId: string): Promise<string> {
    const id = randomUUID();
    await dbRun(
      'INSERT INTO pets (id, userId) VALUES (?, ?)',
      [id, userId]
    );
    return id;
  }

  static async findByUserId(userId: string): Promise<Pet | null> {
    return await dbGet('SELECT * FROM pets WHERE userId = ?', [userId]);
  }

  static async updateStats(userId: string, stats: Partial<Pet>): Promise<void> {
    const fields = Object.keys(stats).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(stats), userId];
    
    await dbRun(
      `UPDATE pets SET ${fields} WHERE userId = ?`,
      values
    );
  }

  static async updateName(userId: string, name: string): Promise<void> {
    await dbRun(
      'UPDATE pets SET name = ? WHERE userId = ?',
      [name, userId]
    );
  }

  static async updateAppearance(userId: string, petType: string, color: string): Promise<void> {
    await dbRun(
      'UPDATE pets SET petType = ?, color = ? WHERE userId = ?',
      [petType, color, userId]
    );
  }

  static async eat(userId: string, isPremium: boolean = false): Promise<void> {
    // Eating: Focuses on energy with small happiness gain, but decreases intelligence
    // Same for both free and premium users - creates tradeoff that makes premium actions attractive
    const energyIncrease = 12;
    const happinessIncrease = 3;
    const intelligenceDecrease = 4;
    
    await dbRun(
      'UPDATE pets SET energy = MIN(100, energy + ?), happiness = MIN(100, happiness + ?), intelligence = MAX(0, intelligence - ?) WHERE userId = ?',
      [energyIncrease, happinessIncrease, intelligenceDecrease, userId]
    );
  }

  static async play(userId: string): Promise<void> {
    // Premium playing: More balanced and efficient than free eating
    // Increases happiness and intelligence with smaller energy cost
    const happinessIncrease = 15;
    const intelligenceIncrease = 10;
    const energyDecrease = 5; // Smaller energy cost than before
    
    await dbRun(
      'UPDATE pets SET happiness = MIN(100, happiness + ?), intelligence = MIN(100, intelligence + ?), energy = MAX(0, energy - ?) WHERE userId = ?',
      [happinessIncrease, intelligenceIncrease, energyDecrease, userId]
    );
  }

  static async study(userId: string): Promise<void> {
    // Premium studying: Focused on intelligence with good efficiency
    // Increases intelligence significantly with moderate happiness gain and energy cost
    const intelligenceIncrease = 18;
    const happinessIncrease = 8;
    const energyDecrease = 6;
    
    await dbRun(
      'UPDATE pets SET intelligence = MIN(100, intelligence + ?), happiness = MIN(100, happiness + ?), energy = MAX(0, energy - ?) WHERE userId = ?',
      [intelligenceIncrease, happinessIncrease, energyDecrease, userId]
    );
  }
}
