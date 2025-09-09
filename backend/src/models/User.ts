import { dbGet, dbRun } from '../database/init';
import { randomUUID } from 'crypto';

export interface User {
  id: string;
  username: string;
  password: string;
  isPremium: number; // SQLite uses INTEGER for boolean
  stripeCustomerId?: string;
  createdAt: string;
}

export class UserModel {
  static async create(username: string, hashedPassword: string): Promise<string> {
    const id = randomUUID();
    await dbRun(
      'INSERT INTO users (id, username, password) VALUES (?, ?, ?)',
      [id, username, hashedPassword]
    );
    return id;
  }

  static async findByUsername(username: string): Promise<User | null> {
    return await dbGet('SELECT * FROM users WHERE username = ?', [username]);
  }

  static async findById(id: string): Promise<User | null> {
    return await dbGet('SELECT * FROM users WHERE id = ?', [id]);
  }

  static async updatePremiumStatus(id: string, isPremium: boolean): Promise<void> {
    await dbRun(
      'UPDATE users SET isPremium = ? WHERE id = ?',
      [isPremium ? 1 : 0, id]
    );
  }

  static async updateStripeCustomerId(id: string, stripeCustomerId: string): Promise<void> {
    await dbRun(
      'UPDATE users SET stripeCustomerId = ? WHERE id = ?',
      [stripeCustomerId, id]
    );
  }
}
