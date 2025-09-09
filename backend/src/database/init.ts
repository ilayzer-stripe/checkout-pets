import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '../../database.db');

// Create database connection
export const db = new sqlite3.Database(dbPath);

// Initialize tables asynchronously
setTimeout(() => {
  initTables();
}, 0);

function initTables() {
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      isPremium INTEGER DEFAULT 0,
      stripeCustomerId TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const createPetsTable = `
    CREATE TABLE IF NOT EXISTS pets (
      id TEXT PRIMARY KEY,
      name TEXT DEFAULT 'Buddy',
      happiness INTEGER DEFAULT 50,
      hunger INTEGER DEFAULT 50,
      energy INTEGER DEFAULT 50,
      petType TEXT DEFAULT 'cat',
      color TEXT DEFAULT 'orange',
      userId TEXT UNIQUE,
      FOREIGN KEY (userId) REFERENCES users (id)
    )
  `;

  db.run(createUsersTable, (err) => {
    if (err) {
      console.error('Error creating users table:', err);
    } else {
      console.log('Users table created/verified');
    }
  });
  
  db.run(createPetsTable, (err) => {
    if (err) {
      console.error('Error creating pets table:', err);
    } else {
      console.log('Pets table created/verified');
    }
  });
  
  console.log('Connected to SQLite database');
}

// Helper functions for async/await with sqlite3
export const dbGet = (sql: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const dbRun = (sql: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

export const dbAll = (sql: string, params: any[] = []): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};
