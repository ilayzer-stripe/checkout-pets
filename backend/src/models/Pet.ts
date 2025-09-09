import { dbGet, dbRun } from '../database/init';
import { randomUUID } from 'crypto';

export interface Pet {
  id: string;
  name: string;
  happiness: number;
  hunger: number;
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

  static async feed(userId: string, foodType: 'basic' | 'premium' = 'basic'): Promise<void> {
    const hungerIncrease = foodType === 'premium' ? 30 : 5; // Apple only gives 5 hunger vs Pizza's 30
    const happinessIncrease = foodType === 'premium' ? 20 : 3; // Apple only gives 3 happiness vs Pizza's 20
    
    await dbRun(
      'UPDATE pets SET hunger = MIN(100, hunger + ?), happiness = MIN(100, happiness + ?) WHERE userId = ?',
      [hungerIncrease, happinessIncrease, userId]
    );
  }

  static async play(userId: string): Promise<void> {
    const energyDecrease = 10;
    const happinessIncrease = 15;
    
    await dbRun(
      'UPDATE pets SET energy = MAX(0, energy - ?), happiness = MIN(100, happiness + ?) WHERE userId = ?',
      [energyDecrease, happinessIncrease, userId]
    );
  }
}
